from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from enum import Enum


class InteractionType(str, Enum):
    view = "view"
    like = "like"
    add_to_cart = "add_to_cart"
    purchase = "purchase"
    rating = "rating"


class UserInteractionCreate(BaseModel):
    product_id: int
    interaction_type: InteractionType
    rating_value: Optional[float] = None  # For rating interactions (1-5)
    quantity: Optional[int] = None  # For add_to_cart/purchase interactions
    session_id: Optional[str] = None  # For tracking user sessions
    interaction_metadata: Optional[dict] = None  # Additional interaction data


class UserInteractionResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    interaction_type: str
    timestamp: datetime
    rating_value: Optional[float] = None
    quantity: Optional[int] = None
    session_id: Optional[str] = None
    interaction_metadata: Optional[dict] = None

    class Config:
        from_attributes = True


class UserInteractionHistory(BaseModel):
    interactions: list[UserInteractionResponse]
    total_count: int
    page: int
    per_page: int


class UserInteractionAnalytics(BaseModel):
    total_views: int
    total_likes: int
    total_cart_additions: int
    total_purchases: int
    total_ratings: int
    average_rating: Optional[float] = None
    most_viewed_categories: list[dict]
    most_liked_products: list[dict]
    recent_activity: list[UserInteractionResponse]


class ProductInteractionStats(BaseModel):
    product_id: int
    total_views: int
    total_likes: int
    total_cart_additions: int
    total_purchases: int
    total_ratings: int
    average_rating: Optional[float] = None
    view_to_cart_ratio: Optional[float] = None
    cart_to_purchase_ratio: Optional[float] = None 