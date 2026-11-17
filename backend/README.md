# 게시판 API

RESTful 게시판 API — FastAPI + PostgreSQL + SQLAlchemy + JWT

## 기술 스택

| 항목 | 사용 기술 |
|------|-----------|
| Framework | FastAPI |
| ORM | SQLAlchemy 2.x |
| Database | PostgreSQL |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Validation | Pydantic v2 |
| API Docs | Swagger UI (내장) |
| Package Manager | uv |

## 프로젝트 구조

```
track-api/
├── app/
│   ├── main.py          # FastAPI 앱, 예외 핸들러
│   ├── database.py      # DB 엔진, 세션, 설정
│   ├── models.py        # SQLAlchemy 모델 (User, Post)
│   ├── schemas.py       # Pydantic 스키마
│   ├── auth.py          # JWT, 비밀번호 해싱
│   ├── dependencies.py  # 의존성 주입 (get_db, get_current_user)
│   └── routers/
│       ├── auth.py      # 회원가입, 로그인
│       └── posts.py     # 게시글 CRUD
├── pyproject.toml
└── .env.example
```

## API 엔드포인트

### 인증

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/auth/signup` | 회원가입 |
| POST | `/auth/login` | 로그인 (JWT 발급) |

### 게시글

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| GET | `/posts` | 불필요 | 목록 조회 (페이지네이션) |
| GET | `/posts/{id}` | 불필요 | 단건 조회 |
| POST | `/posts` | 필요 | 게시글 작성 |
| PUT | `/posts/{id}` | 필요 (작성자) | 게시글 수정 |
| DELETE | `/posts/{id}` | 필요 (작성자) | 게시글 삭제 |

## 로컬 실행

### 1. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 열어 DATABASE_URL, SECRET_KEY 수정
```

### 2. 의존성 설치 및 실행

```bash
uv sync
uv run uvicorn app.main:app --reload
```

### 3. Swagger UI 접속

```
http://localhost:8000/docs
```

## EC2 배포

```bash
# 의존성 설치
uv sync

# 백그라운드 실행
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 &
```

Swagger UI: `http://<EC2_PUBLIC_IP>:8000/docs`

## 데이터 모델

### users

| 컬럼 | 타입 | 제약 |
|------|------|------|
| id | INTEGER | PK, AI |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| hashed_password | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT now() |

### posts

| 컬럼 | 타입 | 제약 |
|------|------|------|
| id | INTEGER | PK, AI |
| title | VARCHAR(200) | NOT NULL |
| content | TEXT | NOT NULL |
| author_id | INTEGER | FK → users.id |
| created_at | TIMESTAMP | DEFAULT now() |
| updated_at | TIMESTAMP | ON UPDATE now() |
