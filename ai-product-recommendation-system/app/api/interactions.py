from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from ..core.database import get_db
from ..api.auth import get_current_user
from ..models.user import User
from ..models.user_interaction import UserInteraction
from ..models.product import Product
from ..schemas.user_interaction import (
    UserInteractionCreate,
    UserInteractionResponse,
    UserInteractionHistory,
    UserInteractionAnalytics,
    ProductInteractionStats,
    InteractionType
)

router = APIRouter()


@router.post("/interactions", response_model=UserInteractionResponse)
async def create_interaction(
    interaction: UserInteractionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Log a user interaction with a product"""
    # Validate that the product exists
    product = db.query(Product).filter(Product.id == interaction.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Create the interaction
    db_interaction = UserInteraction(
        user_id=current_user.id,
        product_id=interaction.product_id,
        interaction_type=interaction.interaction_type.value,
        rating_value=interaction.rating_value,
        quantity=interaction.quantity,
        session_id=interaction.session_id,
        interaction_metadata=interaction.interaction_metadata
    )
    
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    
    return db_interaction


@router.get("/interactions/history", response_model=UserInteractionHistory)
async def get_interaction_history(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    interaction_type: Optional[InteractionType] = None,
    product_id: Optional[int] = None,
    days_back: Optional[int] = Query(None, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's interaction history with optional filtering"""
    query = db.query(UserInteraction).filter(UserInteraction.user_id == current_user.id)
    
    # Apply filters
    if interaction_type:
        query = query.filter(UserInteraction.interaction_type == interaction_type.value)
    
    if product_id:
        query = query.filter(UserInteraction.product_id == product_id)
    
    if days_back:
        cutoff_date = datetime.utcnow() - timedelta(days=days_back)
        query = query.filter(UserInteraction.timestamp >= cutoff_date)
    
    # Get total count
    total_count = query.count()
    
    # Apply pagination and ordering
    interactions = query.order_by(desc(UserInteraction.timestamp)).offset(
        (page - 1) * per_page
    ).limit(per_page).all()
    
    return UserInteractionHistory(
        interactions=interactions,
        total_count=total_count,
        page=page,
        per_page=per_page
    )


@router.get("/interactions/analytics", response_model=UserInteractionAnalytics)
async def get_user_analytics(
    days_back: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user interaction analytics"""
    cutoff_date = datetime.utcnow() - timedelta(days=days_back)
    
    # Base query for the time period
    base_query = db.query(UserInteraction).filter(
        UserInteraction.user_id == current_user.id,
        UserInteraction.timestamp >= cutoff_date
    )
    
    # Get interaction counts by type
    interaction_counts = base_query.with_entities(
        UserInteraction.interaction_type,
        func.count(UserInteraction.id).label('count')
    ).group_by(UserInteraction.interaction_type).all()
    
    # Initialize counts
    counts = {
        'view': 0,
        'like': 0,
        'add_to_cart': 0,
        'purchase': 0,
        'rating': 0
    }
    
    for interaction_type, count in interaction_counts:
        counts[interaction_type] = count
    
    # Get average rating
    avg_rating = base_query.filter(
        UserInteraction.interaction_type == 'rating'
    ).with_entities(
        func.avg(UserInteraction.rating_value).label('avg_rating')
    ).scalar()
    
    # Get most viewed categories
    most_viewed_categories = db.query(
        Product.category,
        func.count(UserInteraction.id).label('view_count')
    ).join(
        UserInteraction, Product.id == UserInteraction.product_id
    ).filter(
        UserInteraction.user_id == current_user.id,
        UserInteraction.interaction_type == 'view',
        UserInteraction.timestamp >= cutoff_date
    ).group_by(Product.category).order_by(desc('view_count')).limit(5).all()
    
    # Get most liked products
    most_liked_products = db.query(
        Product.id,
        Product.name,
        func.count(UserInteraction.id).label('like_count')
    ).join(
        UserInteraction, Product.id == UserInteraction.product_id
    ).filter(
        UserInteraction.user_id == current_user.id,
        UserInteraction.interaction_type == 'like',
        UserInteraction.timestamp >= cutoff_date
    ).group_by(Product.id, Product.name).order_by(desc('like_count')).limit(5).all()
    
    # Get recent activity
    recent_activity = base_query.order_by(desc(UserInteraction.timestamp)).limit(10).all()
    
    return UserInteractionAnalytics(
        total_views=counts['view'],
        total_likes=counts['like'],
        total_cart_additions=counts['add_to_cart'],
        total_purchases=counts['purchase'],
        total_ratings=counts['rating'],
        average_rating=avg_rating,
        most_viewed_categories=[
            {'category': cat, 'count': count} 
            for cat, count in most_viewed_categories
        ],
        most_liked_products=[
            {'id': product_id, 'name': name, 'count': count}
            for product_id, name, count in most_liked_products
        ],
        recent_activity=recent_activity
    )


@router.get("/products/{product_id}/stats", response_model=ProductInteractionStats)
async def get_product_stats(
    product_id: int,
    days_back: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Admin users might want all stats
):
    """Get interaction statistics for a specific product"""
    # Verify product exists
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    cutoff_date = datetime.utcnow() - timedelta(days=days_back)
    
    # Get interaction counts by type
    interaction_counts = db.query(
        UserInteraction.interaction_type,
        func.count(UserInteraction.id).label('count')
    ).filter(
        UserInteraction.product_id == product_id,
        UserInteraction.timestamp >= cutoff_date
    ).group_by(UserInteraction.interaction_type).all()
    
    # Initialize counts
    counts = {
        'view': 0,
        'like': 0,
        'add_to_cart': 0,
        'purchase': 0,
        'rating': 0
    }
    
    for interaction_type, count in interaction_counts:
        counts[interaction_type] = count
    
    # Get average rating
    avg_rating = db.query(
        func.avg(UserInteraction.rating_value).label('avg_rating')
    ).filter(
        UserInteraction.product_id == product_id,
        UserInteraction.interaction_type == 'rating',
        UserInteraction.timestamp >= cutoff_date
    ).scalar()
    
    # Calculate conversion ratios
    view_to_cart_ratio = None
    cart_to_purchase_ratio = None
    
    if counts['view'] > 0:
        view_to_cart_ratio = counts['add_to_cart'] / counts['view']
    
    if counts['add_to_cart'] > 0:
        cart_to_purchase_ratio = counts['purchase'] / counts['add_to_cart']
    
    return ProductInteractionStats(
        product_id=product_id,
        total_views=counts['view'],
        total_likes=counts['like'],
        total_cart_additions=counts['add_to_cart'],
        total_purchases=counts['purchase'],
        total_ratings=counts['rating'],
        average_rating=avg_rating,
        view_to_cart_ratio=view_to_cart_ratio,
        cart_to_purchase_ratio=cart_to_purchase_ratio
    )


@router.delete("/interactions/{interaction_id}")
async def delete_interaction(
    interaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a user interaction (for privacy/GDPR compliance)"""
    interaction = db.query(UserInteraction).filter(
        UserInteraction.id == interaction_id,
        UserInteraction.user_id == current_user.id
    ).first()
    
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    db.delete(interaction)
    db.commit()
    
    return {"message": "Interaction deleted successfully"}


@router.get("/interactions/bulk", response_model=List[UserInteractionResponse])
async def get_bulk_interactions(
    product_ids: List[int] = Query(...),
    interaction_types: List[InteractionType] = Query(...),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get multiple interactions for specific products and types (useful for recommendation engines)"""
    interactions = db.query(UserInteraction).filter(
        UserInteraction.user_id == current_user.id,
        UserInteraction.product_id.in_(product_ids),
        UserInteraction.interaction_type.in_([t.value for t in interaction_types])
    ).order_by(desc(UserInteraction.timestamp)).limit(limit).all()
    
    return interactions 