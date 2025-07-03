from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str
    category: str
    subcategory: Optional[str] = None
    price: float
    manufacturer: Optional[str] = None
    description: Optional[str] = None

    quantity_in_stock: int = 0
    is_featured: bool = False
    is_on_sale: bool = False
    sale_price: Optional[float] = None

    weight: Optional[float] = None
    dimensions: Optional[str] = None
    release_date: Optional[datetime] = None
    rating: Optional[float] = 0.0
    image_url: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    name: Optional[str] = None  # All fields optional for update
    category: Optional[str] = None
    price: Optional[float] = None


class ProductInDBBase(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Product(ProductInDBBase):
    """Schema for responses."""


class ProductInDB(ProductInDBBase):
    """Internal schema with potential sensitive fields.""" 