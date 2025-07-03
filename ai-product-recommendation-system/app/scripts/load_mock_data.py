import json
from pathlib import Path
from datetime import datetime
from typing import Dict, Any

from ..core.database import Base, SessionLocal, engine
from ..models.product import Product

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def parse_date(date_str: str) -> datetime:
    """Parse date string in MM/DD/YYYY format to datetime object."""
    try:
        return datetime.strptime(date_str, "%m/%d/%Y")
    except (ValueError, TypeError):
        return datetime.utcnow()

def map_mock_data_to_model(mock_item: Dict[str, Any]) -> Dict[str, Any]:
    """Map mock data fields to model fields."""
    mapped_data = {
        'id': mock_item.get('product_id'),
        'name': mock_item.get('product_name'),
        'category': mock_item.get('category'),
        'subcategory': mock_item.get('subcategory'),
        'price': mock_item.get('price'),
        'manufacturer': mock_item.get('manufacturer'),
        'description': mock_item.get('description'),
        'quantity_in_stock': mock_item.get('quantity_in_stock', 0),
        'is_featured': mock_item.get('is_featured', False),
        'is_on_sale': mock_item.get('is_on_sale', False),
        'sale_price': mock_item.get('sale_price'),
        'weight': mock_item.get('weight'),
        'dimensions': mock_item.get('dimensions'),
        'release_date': parse_date(mock_item.get('release_date', '')),
        'rating': mock_item.get('rating', 0.0),
        'image_url': mock_item.get('image_url'),
    }
    
    # Remove None values
    return {k: v for k, v in mapped_data.items() if v is not None}

def clear_existing_products():
    """Clear existing products from database."""
    with SessionLocal() as session:
        session.query(Product).delete()
        session.commit()
        print("Cleared existing products from database.")

def load_mock_products(mock_json_path: Path, clear_existing: bool = True):
    """Load mock products from JSON file into database."""
    if not mock_json_path.exists():
        raise FileNotFoundError(f"Mock data file not found: {mock_json_path}")
    
    with mock_json_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if clear_existing:
        clear_existing_products()

    with SessionLocal() as session:
        loaded_count = 0
        error_count = 0
        
        for item in data:
            try:
                mapped_data = map_mock_data_to_model(item)
                product = Product(**mapped_data)
                session.add(product)
                loaded_count += 1
                
                # Commit in batches to avoid memory issues
                if loaded_count % 100 == 0:
                    session.commit()
                    print(f"Loaded {loaded_count} products...")
                    
            except Exception as e:
                error_count += 1
                print(f"Error loading product {item.get('product_id', 'unknown')}: {e}")
                continue
        
        # Final commit
        session.commit()
        print(f"Successfully loaded {loaded_count} products with {error_count} errors.")

def get_product_stats():
    """Get basic statistics about loaded products."""
    with SessionLocal() as session:
        total_products = session.query(Product).count()
        featured_count = session.query(Product).filter(Product.is_featured == True).count()
        on_sale_count = session.query(Product).filter(Product.is_on_sale == True).count()
        categories = session.query(Product.category).distinct().count()
        
        print(f"\nDatabase Statistics:")
        print(f"Total products: {total_products}")
        print(f"Featured products: {featured_count}")
        print(f"Products on sale: {on_sale_count}")
        print(f"Unique categories: {categories}")

if __name__ == "__main__":
    project_root = Path(__file__).resolve().parents[2]
    mock_file = project_root / "mock_data.json"
    
    print("Loading mock data...")
    load_mock_products(mock_file)
    get_product_stats()
    print("Mock data loading completed!") 