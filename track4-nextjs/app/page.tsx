import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ maxWidth: 480, margin: '120px auto', padding: '0 16px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>할 일 목록</h1>
      <p style={{ color: '#555', marginBottom: 32 }}>회원 전용 Todo 리스트 서비스입니다.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link href="/login" style={{ padding: '10px 24px', background: '#111', color: '#fff', fontSize: 14 }}>
          로그인
        </Link>
        <Link href="/signup" style={{ padding: '10px 24px', border: '1px solid #111', fontSize: 14 }}>
          회원가입
        </Link>
      </div>
    </div>
  );
}
