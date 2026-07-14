"""Run once: python migrate_auth.py"""

from models import Base, User  # noqa: F401
from db import engine


def migrate():
    Base.metadata.create_all(bind=engine)
    print("Auth migration complete: users table ready")


if __name__ == "__main__":
    migrate()
