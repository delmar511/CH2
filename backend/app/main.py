from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.database import Base, engine
from app.routers import auth, posts

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="게시판 API",
    description=(
        "## RESTful 게시판 API\n\n"
        "JWT 인증 기반의 게시판 CRUD API입니다.\n\n"
        "### 사용 방법\n"
        "1. `/auth/signup` 으로 회원가입\n"
        "2. `/auth/login` 으로 로그인 → `access_token` 획득\n"
        "3. 우측 상단 **Authorize** 버튼 클릭 → `Bearer <token>` 입력\n"
        "4. `/posts` 엔드포인트 사용"
    ),
    version="1.0.0",
    contact={"name": "Board API"},
    license_info={"name": "MIT"},
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_msg = errors[0]["msg"] if errors else "Invalid input"
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": "Validation Error", "detail": first_msg},
    )


app.include_router(auth.router)
app.include_router(posts.router)


@app.get("/", tags=["Health"], summary="서버 상태 확인")
def health_check():
    return {"status": "ok", "message": "게시판 API is running"}
