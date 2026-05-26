from datetime import datetime
from typing import Literal
import os
from io import BytesIO
from pathlib import Path

import cloudinary
import cloudinary.uploader

from dotenv import load_dotenv

from fastapi import (
    FastAPI,
    File,
    Form,
    HTTPException,
    UploadFile,
)

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text

from models import Item, Embedding
from ml.embedding import get_embedding
from db import SessionLocal


# =========================
# APP
# =========================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# ENV
# =========================

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

print("ENV TEST:", os.getenv("CLOUDINARY_CLOUD_NAME"))


# =========================
# RESPONSE MODEL
# =========================

class ItemResponse(BaseModel):
    id: int
    title: str
    description: str | None
    type: str
    location: str | None
    image_url: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


# =========================
# ROOT
# =========================

@app.get("/")
def root():
    return {
        "message": "Backend running"
    }


# =========================
# CREATE ITEM
# =========================

@app.post("/items")
async def create_item(
    title: str = Form(...),
    description: str | None = Form(None),
    type: Literal["lost", "found"] = Form(...),
    location: str | None = Form(None),
    image: UploadFile = File(...)
):

    db = SessionLocal()

    try:

        print("🔥 CREATE ITEM")

        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET"),
            secure=True,
        )

        # -------------------
        # READ IMAGE
        # -------------------

        image_bytes = await image.read()

        upload = cloudinary.uploader.upload(
            image_bytes,
            folder="items"
        )

        image_url = upload["secure_url"]

        # -------------------
        # SAVE ITEM
        # -------------------

        db_item = Item(
            title=title,
            description=description,
            type=type,
            location=location,
            image_url=image_url,
        )

        db.add(db_item)
        db.flush()

        # -------------------
        # EMBEDDING
        # -------------------

        embedding = get_embedding(
            BytesIO(image_bytes)
        )

        db_embedding = Embedding(
            item_id=db_item.id,
            vector=embedding.tolist()
        )

        db.add(db_embedding)

        db.commit()
        db.refresh(db_item)

        print("✅ ITEM SAVED")

        # -------------------
        # MATCHING
        # -------------------

        opposite_type = (
            "found"
            if type == "lost"
            else "lost"
        )

        results = db.execute(
            text("""
                SELECT
                    items.*,
                    embeddings.vector
                    <->
                    CAST(:query_vector AS vector)
                    AS distance

                FROM embeddings

                JOIN items
                ON items.id = embeddings.item_id

                WHERE items.type = :opposite_type

                ORDER BY distance

                LIMIT 10
            """),
            {
                "query_vector": str(
                    embedding.tolist()
                ),

                "opposite_type":
                opposite_type,
            },
        ).fetchall()

        matches = []

        print("RAW RESULTS")

        for row in results:

            distance = float(
                row.distance
            )

            print(
                "DIST:",
                row.title,
                distance
            )

            # ===================
            # SCORE
            # ===================

            score = max(
                0,
                (1 - distance) * 100
            )

            # TITLE BONUS

            if (
                title
                and row.title
                and title.lower().strip()
                ==
                row.title.lower().strip()
            ):
                score += 8

            # DESCRIPTION BONUS

            if (
                description
                and row.description
            ):

                d1 = (
                    description
                    .lower()
                    .strip()
                )

                d2 = (
                    row.description
                    .lower()
                    .strip()
                )

                if (
                    d1 in d2
                    or
                    d2 in d1
                ):
                    score += 5

            score = min(
                score,
                100
            )

            # FILTER

            if score < 55:
                continue

            matches.append({

                "id":
                row.id,

                "title":
                row.title,

                "description":
                row.description,

                "type":
                row.type,

                "location":
                row.location,

                "image_url":
                row.image_url,

                "distance":
                round(
                    distance,
                    3
                ),

                "score":
                round(
                    score,
                    1
                )
            })

        matches.sort(
            key=lambda x:
            x["score"],
            reverse=True
        )

        print(
            "FINAL MATCHES:",
            matches
        )

        return {

            "message":
            "Item created successfully",

            "item":
            db_item,

            "possible_matches":
            matches,

            "total_matches":
            len(matches)
        }

    except Exception as e:

        db.rollback()

        print("ERROR:", str(e))

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    finally:

        db.close()


# =========================
# GET ITEMS
# =========================

@app.get("/items")
def get_items():

    db = SessionLocal()

    try:

        return (
            db
            .query(Item)
            .all()
        )

    finally:

        db.close()


# =========================
# TEST EMBEDDING
# =========================

@app.post("/test-embedding")
async def test_embedding(
    image: UploadFile = File(...)
):

    emb = get_embedding(
        BytesIO(
            await image.read()
        )
    )

    return {
        "length":
        len(emb)
    }