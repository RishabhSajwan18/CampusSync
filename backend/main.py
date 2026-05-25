from datetime import datetime
from typing import Literal
import os

from fastapi.middleware.cors import CORSMiddleware

import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from models import Item, Embedding
from ml.embedding import get_embedding
from io import BytesIO

from db import SessionLocal
from sqlalchemy import text

from pathlib import Path

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

print("ENV TEST:", os.getenv("CLOUDINARY_CLOUD_NAME"))


# =========================
# RESPONSE MODELS
# =========================
class ItemResponse(BaseModel):
    id: int
    title: str
    description: str | None
    type: str
    location: str | None
    image_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class CreateItemResponse(BaseModel):
    message: str
    item: ItemResponse


# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {"message": "Backend running"}


# =========================
# CREATE ITEM + AUTO MATCH
# =========================
@app.post("/items")
async def create_item(
    title: str = Form(...),
    description: str | None = Form(None),
    type: Literal["lost", "found"] = Form(...),
    location: str | None = Form(None),
    image: UploadFile = File(...),
):
    print("🔥 CREATE ITEM HIT")

    db = SessionLocal()
    try:
        # check cloudinary credentials
        if not os.getenv("CLOUDINARY_CLOUD_NAME") or not os.getenv("CLOUDINARY_API_KEY") or not os.getenv(
            "CLOUDINARY_API_SECRET"
        ):
            raise HTTPException(status_code=500, detail="Cloudinary credentials missing")

        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET"),
            secure=True,
        )

        # read image
        image_bytes = await image.read()
        print("✅ IMAGE RECEIVED")

        # upload
        upload_result = cloudinary.uploader.upload(image_bytes, folder="items")
        secure_url = upload_result.get("secure_url")

        if not secure_url:
            raise HTTPException(status_code=400, detail="Image upload failed")

        # create item
        db_item = Item(
            title=title,
            description=description,
            type=type,
            location=location,
            image_url=secure_url,
        )

        db.add(db_item)
        db.flush()

        print("✅ ITEM SAVED IN DB")

        # embedding
        embedding = get_embedding(BytesIO(image_bytes))
        print("✅ EMBEDDING GENERATED")

        db_embedding = Embedding(
            item_id=db_item.id,
            vector=embedding.tolist()
        )
        db.add(db_embedding)

        db.commit()
        db.refresh(db_item)

        print("🚀 STARTING MATCHING")

        # =========================
        # AUTO MATCHING
        # =========================
        opposite_type = "found" if type == "lost" else "lost"

        results = db.execute(
            text("""
            SELECT items.*, embeddings.vector <-> CAST(:query_vector AS vector) AS distance
            FROM embeddings
            JOIN items ON items.id = embeddings.item_id
            WHERE items.type = :opposite_type
            ORDER BY embeddings.vector <-> CAST(:query_vector AS vector)
            LIMIT 5;
            """),
            {
                "query_vector": str(embedding.tolist()),
                "opposite_type": opposite_type
            }
        ).fetchall()

        print("RAW RESULTS:", results)

        # 🔥 APPLY PROPER FILTERING
        THRESHOLD = 5.0

        matches = []

        for row in results:
            distance = float(row.distance)
            print("DISTANCE:", distance)

            if distance <= THRESHOLD:
                score = 1 / (1 + distance)

                matches.append({
                    "id": row.id,
                    "title": row.title,
                    "type": row.type,
                    "location": row.location,
                    "image_url": row.image_url,
                    "distance": distance,
                    "score": round(score, 3)
                })

        print("FILTERED MATCHES:", matches)

        matches = sorted(matches, key=lambda x: x["score"], reverse=True)

        return {
            "message": "Item created successfully",
            "item": db_item,
            "possible_matches": matches,
            "total_matches": len(matches)
        }

    except Exception as exc:
        print("❌ ERROR:", str(exc))
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc))

    finally:
        db.close()

# =========================
# GET ITEMS
# =========================
@app.get("/items", response_model=list[ItemResponse])
def get_items():
    db = SessionLocal()
    try:
        return db.query(Item).all()
    finally:
        db.close()


# =========================
# TEST EMBEDDING
# =========================
@app.post("/test-embedding")
async def test_embedding(image: UploadFile = File(...)):
    emb = get_embedding(BytesIO(await image.read()))
    return {"length": len(emb)}


# =========================
# SEARCH API
# =========================
@app.post("/search")
async def search_similar(
    image: UploadFile = File(...),
    type: Literal["lost", "found"] = Form(...)
):
    db = SessionLocal()
    try:
        print("🔍 SEARCH HIT")

        image_bytes = await image.read()

        query_embedding = get_embedding(BytesIO(image_bytes)).tolist()

        opposite_type = "found" if type == "lost" else "lost"

        THRESHOLD = 1.2

        results = db.execute(
            text("""
            SELECT items.*, embeddings.vector <-> CAST(:query_vector AS vector) AS distance
            FROM embeddings
            JOIN items ON items.id = embeddings.item_id
            WHERE items.type = :opposite_type
            ORDER BY embeddings.vector <-> CAST(:query_vector AS vector)
            LIMIT 10;
            """),
            {
                "query_vector": str(query_embedding),
                "opposite_type": opposite_type
            }
        ).fetchall()

        output = []

        for row in results:
            distance = float(row.distance)
            print("SEARCH DISTANCE:", distance)

            if distance <= THRESHOLD:
                score = 1 / (1 + distance)

                output.append({
                    "id": row.id,
                    "title": row.title,
                    "description": row.description,
                    "type": row.type,
                    "location": row.location,
                    "image_url": row.image_url,
                    "distance": distance,
                    "score": round(score, 3)
                })

        output = sorted(output, key=lambda x: x["score"], reverse=True)

        return {
            "matches": output,
            "total_matches": len(output)
        }

    finally:
        db.close()