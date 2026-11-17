# Track 4 — 회원 전용 Todo 리스트 (Next.js + Supabase)

## Supabase 테이블 생성 SQL

```sql
CREATE TABLE todos (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title      TEXT NOT NULL,
    is_done    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 본인 데이터만 접근 가능
CREATE POLICY "users can manage own todos"
ON todos FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

## 설정 방법

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.local.example .env.local
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 입력

# 3. 개발 서버 실행
npm run dev
```

## 배포 (Vercel)

1. GitHub에 푸시
2. Vercel에서 "Import Project" → 이 저장소 선택
3. Environment Variables에 `.env.local` 값 입력
4. Deploy

## 배포 URL

> https://track4-nextjs.vercel.app

## 구현 내용

| 항목 | 구현 방식 |
|------|----------|
| 컴포넌트 분리 | `TodoList`, `TodoForm`, `TodoItem` (Props 전달) |
| 인증 | Supabase Auth (회원가입/로그인/로그아웃) |
| 미인증 접근 제어 | `middleware.ts`에서 `/todos` 보호 |
| 상태 관리 | `useState`, `useEffect` |
| 4가지 상태 UI | loading / success / error / empty |
| 라우팅 | `/todos` 목록, `/todos/[id]` 상세 (동적 라우트) |
| 서버/클라이언트 구분 | 목록·상세 페이지: Server Component, CRUD 조작: Client Component |
| 데이터 저장 | Supabase DB (Row Level Security 적용) |
