from sqlalchemy import Column, DateTime, Enum, Integer, String, Text, func
from sqlalchemy.orm import declarative_base
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector 


Base = declarative_base()

item_type_enum = Enum("lost", "found", name="item_type", native_enum=True)


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    type = Column(item_type_enum, nullable=False)
    location = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Embedding(Base):
    __tablename__ = "embeddings"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))
    vector = Column(Vector(512))   # 512-dim vector

    item = relationship("Item")