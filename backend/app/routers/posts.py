from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db, get_current_user
from app.schemas import PostCreate, PostUpdate, PostResponse, PostListResponse, ErrorResponse
from app import models

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post(
    "",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
    summary="게시글 작성 (인증 필요)",
)
def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    post = models.Post(
        title=post_data.title,
        content=post_data.content,
        author_id=current_user.id,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get(
    "",
    response_model=List[PostListResponse],
    summary="게시글 목록 조회",
)
def list_posts(
    skip: int = Query(0, ge=0, description="건너뛸 게시글 수"),
    limit: int = Query(10, ge=1, le=100, description="최대 반환 수"),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Post)
        .order_by(models.Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get(
    "/{post_id}",
    response_model=PostResponse,
    responses={404: {"model": ErrorResponse}},
    summary="게시글 단건 조회",
)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.put(
    "/{post_id}",
    response_model=PostResponse,
    responses={
        403: {"model": ErrorResponse, "description": "Not the author"},
        404: {"model": ErrorResponse},
    },
    summary="게시글 수정 (작성자만)",
)
def update_post(
    post_id: int,
    post_data: PostUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this post")

    if post_data.title is not None:
        post.title = post_data.title
    if post_data.content is not None:
        post.content = post_data.content

    db.commit()
    db.refresh(post)
    return post


@router.delete(
    "/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        403: {"model": ErrorResponse, "description": "Not the author"},
        404: {"model": ErrorResponse},
    },
    summary="게시글 삭제 (작성자만)",
)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")

    db.delete(post)
    db.commit()
