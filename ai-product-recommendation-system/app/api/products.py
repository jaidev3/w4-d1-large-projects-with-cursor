from typing import List, Optional
from enum import Enum

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_

from ..core.database import get_db
from ..models.product import Product as ProductModel
from ..schemas.product import Product, ProductCreate, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


class SortOrder(str, Enum):
    ASC = "asc"
    DESC = "desc"


class SortBy(str, Enum):
    NAME = "name"
    PRICE = "price"
    RATING = "rating"
    CREATED_AT = "created_at"
    POPULARITY = "popularity"


@router.get("/", response_model=List[Product])
def read_products(
    skip: int = Query(0, ge=0, description="Number of products to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of products to return"),
    search: Optional[str] = Query(None, description="Search term for product name or description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    subcategory: Optional[str] = Query(None, description="Filter by subcategory"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating filter"),
    max_rating: Optional[float] = Query(None, ge=0, le=5, description="Maximum rating filter"),
    is_featured: Optional[bool] = Query(None, description="Filter by featured products"),
    is_on_sale: Optional[bool] = Query(None, description="Filter by products on sale"),
    in_stock: Optional[bool] = Query(None, description="Filter by products in stock"),
    sort_by: SortBy = Query(SortBy.CREATED_AT, description="Sort by field"),
    sort_order: SortOrder = Query(SortOrder.DESC, description="Sort order"),
    db: Session = Depends(get_db)
):
    """
    Get products with comprehensive filtering, search, and sorting capabilities.
    """
    query = db.query(ProductModel)
    
    # Search functionality
    if search:
        search_filter = or_(
            ProductModel.name.ilike(f"%{search}%"),
            ProductModel.description.ilike(f"%{search}%"),
            ProductModel.manufacturer.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    # Category and subcategory filters
    if category:
        query = query.filter(ProductModel.category.ilike(f"%{category}%"))
    
    if subcategory:
        query = query.filter(ProductModel.subcategory.ilike(f"%{subcategory}%"))
    
    # Price range filters
    if min_price is not None:
        query = query.filter(ProductModel.price >= min_price)
    
    if max_price is not None:
        query = query.filter(ProductModel.price <= max_price)
    
    # Rating filters
    if min_rating is not None:
        query = query.filter(ProductModel.rating >= min_rating)
    
    if max_rating is not None:
        query = query.filter(ProductModel.rating <= max_rating)
    
    # Boolean filters
    if is_featured is not None:
        query = query.filter(ProductModel.is_featured == is_featured)
    
    if is_on_sale is not None:
        query = query.filter(ProductModel.is_on_sale == is_on_sale)
    
    if in_stock is not None:
        if in_stock:
            query = query.filter(ProductModel.quantity_in_stock > 0)
        else:
            query = query.filter(ProductModel.quantity_in_stock == 0)
    
    # Sorting
    if sort_by == SortBy.NAME:
        order_field = ProductModel.name
    elif sort_by == SortBy.PRICE:
        order_field = ProductModel.price
    elif sort_by == SortBy.RATING:
        order_field = ProductModel.rating
    elif sort_by == SortBy.POPULARITY:
        # For now, use rating as popularity proxy
        order_field = ProductModel.rating
    else:  # CREATED_AT
        order_field = ProductModel.created_at
    
    if sort_order == SortOrder.DESC:
        query = query.order_by(order_field.desc())
    else:
        query = query.order_by(order_field.asc())
    
    # Pagination
    products = query.offset(skip).limit(limit).all()
    return products


@router.get("/search", response_model=List[Product])
def search_products(
    q: str = Query(..., description="Search query"),
    limit: int = Query(20, ge=1, le=100, description="Number of results to return"),
    db: Session = Depends(get_db)
):
    """
    Dedicated search endpoint for products.
    """
    search_filter = or_(
        ProductModel.name.ilike(f"%{q}%"),
        ProductModel.description.ilike(f"%{q}%"),
        ProductModel.manufacturer.ilike(f"%{q}%"),
        ProductModel.category.ilike(f"%{q}%"),
        ProductModel.subcategory.ilike(f"%{q}%")
    )
    
    products = db.query(ProductModel).filter(search_filter).limit(limit).all()
    return products


@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    """
    Get all unique product categories.
    """
    categories = db.query(ProductModel.category).distinct().all()
    return [category[0] for category in categories if category[0]]


@router.get("/categories/{category}/subcategories", response_model=List[str])
def get_subcategories_by_category(
    category: str,
    db: Session = Depends(get_db)
):
    """
    Get all subcategories for a specific category.
    """
    subcategories = db.query(ProductModel.subcategory).filter(
        ProductModel.category.ilike(f"%{category}%")
    ).distinct().all()
    return [subcategory[0] for subcategory in subcategories if subcategory[0]]


@router.get("/featured", response_model=List[Product])
def get_featured_products(
    limit: int = Query(10, ge=1, le=50, description="Number of featured products to return"),
    db: Session = Depends(get_db)
):
    """
    Get featured products.
    """
    products = db.query(ProductModel).filter(
        ProductModel.is_featured == True
    ).order_by(ProductModel.rating.desc()).limit(limit).all()
    return products


@router.get("/on-sale", response_model=List[Product])
def get_sale_products(
    limit: int = Query(20, ge=1, le=100, description="Number of sale products to return"),
    db: Session = Depends(get_db)
):
    """
    Get products currently on sale.
    """
    products = db.query(ProductModel).filter(
        ProductModel.is_on_sale == True
    ).order_by(ProductModel.rating.desc()).limit(limit).all()
    return products


@router.get("/stats")
def get_product_stats(db: Session = Depends(get_db)):
    """
    Get overall product statistics.
    """
    total_products = db.query(ProductModel).count()
    featured_count = db.query(ProductModel).filter(ProductModel.is_featured == True).count()
    on_sale_count = db.query(ProductModel).filter(ProductModel.is_on_sale == True).count()
    in_stock_count = db.query(ProductModel).filter(ProductModel.quantity_in_stock > 0).count()
    
    avg_price = db.query(func.avg(ProductModel.price)).scalar() or 0
    avg_rating = db.query(func.avg(ProductModel.rating)).scalar() or 0
    
    price_range = db.query(
        func.min(ProductModel.price),
        func.max(ProductModel.price)
    ).first()
    
    return {
        "total_products": total_products,
        "featured_count": featured_count,
        "on_sale_count": on_sale_count,
        "in_stock_count": in_stock_count,
        "average_price": round(avg_price, 2),
        "average_rating": round(avg_rating, 2),
        "price_range": {
            "min": price_range[0] or 0,
            "max": price_range[1] or 0
        }
    }


@router.get("/{product_id}", response_model=Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    """
    Get a specific product by ID.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product.
    """
    product = ProductModel(**product_in.dict())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=Product)
def update_product(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db)):
    """
    Update a product.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    for field, value in product_in.dict(exclude_unset=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """
    Delete a product.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    db.delete(product)
    db.commit()
    return None 