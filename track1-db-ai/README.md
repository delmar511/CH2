# Track 1 — 쇼핑몰 DB CRUD (Supabase + uv)

## 테이블 스키마

### 1. members (회원)

| 컬럼 | 타입 | 제약조건 |
|------|------|----------|
| **member_id** | SERIAL | **PK** |
| username | VARCHAR(50) | UNIQUE NOT NULL |
| email | VARCHAR(100) | UNIQUE NOT NULL |
| full_name | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(20) | |
| role | VARCHAR(10) | CHECK IN ('customer','admin','seller'), DEFAULT 'customer' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### 2. products (상품)

| 컬럼 | 타입 | 제약조건 |
|------|------|----------|
| **product_id** | SERIAL | **PK** |
| name | VARCHAR(200) | NOT NULL |
| description | TEXT | |
| price | NUMERIC(12,2) | CHECK >= 0 |
| stock | INTEGER | CHECK >= 0, DEFAULT 0 |
| category | VARCHAR(50) | |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### 3. orders (주문)

| 컬럼 | 타입 | 제약조건 |
|------|------|----------|
| **order_id** | SERIAL | **PK** |
| **member_id** | INTEGER | **FK** → members(member_id) ON DELETE RESTRICT |
| **product_id** | INTEGER | **FK** → products(product_id) ON DELETE RESTRICT |
| quantity | INTEGER | CHECK > 0 |
| total_amount | NUMERIC(12,2) | CHECK >= 0 |
| status | VARCHAR(20) | CHECK IN ('pending','confirmed','shipped','delivered','cancelled') |
| shipping_address | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

## 설정 방법

```bash
# 1. .env 파일 생성
cp .env.example .env
# SUPABASE_URL, SUPABASE_KEY 입력

# 2. Supabase SQL Editor에서 crud.ipynb 셀 0의 SQL 실행

# 3. 가상환경 활성화 후 Jupyter 실행
uv run jupyter notebook crud.ipynb
```

## CRUD 동작 화면

> **[캡처 이미지를 여기에 추가하세요]**
> 
> 각 셀 실행 후 출력 결과 캡처:
> - CREATE (회원/상품/주문 삽입)
> - READ (전체 조회, 조건 조회)
> - UPDATE (전화번호 변경, 재고 변경, 주문 상태 변경)
> - DELETE (회원 삭제, 주문 삭제)
> - 트랜잭션 COMMIT/ROLLBACK 결과
