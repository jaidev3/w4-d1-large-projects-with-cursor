import json
from pathlib import Path

from ..core.database import Base, SessionLocal, engine
from ..models.product import Product

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def load_mock_products(mock_json_path: Path):
    with mock_json_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    with SessionLocal() as session:
        for item in data:
            product = Product(**item)
            session.add(product)
        session.commit()


if __name__ == "__main__":
    project_root = Path(__file__).resolve().parents[3]
    mock_file = project_root / "mock_data.json"
    if not mock_file.exists():
        raise FileNotFoundError("mock_data.json not found at project root")

    load_mock_products(mock_file)
    print("Mock data loaded successfully.") 