'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setMessage('가입 확인 이메일을 발송했습니다. 이메일을 확인해 주세요.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>회원가입</h1>
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 4 }}>이메일</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 4 }}>비밀번호 (6자 이상)</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc' }} />
        </div>
        {error && <p style={{ color: 'red', marginBottom: 12, fontSize: 13 }}>{error}</p>}
        {message && <p style={{ color: 'green', marginBottom: 12, fontSize: 13 }}>{message}</p>}
        {!message ? (
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer' }}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        ) : (
          <button type="button" onClick={() => router.push('/login')}
            style={{ width: '100%', padding: '10px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer' }}>
            로그인 페이지로
          </button>
        )}
      </form>
      <p style={{ marginTop: 16, fontSize: 14, textAlign: 'center' }}>
        이미 계정이 있으신가요? <Link href="/login">로그인</Link>
      </p>
    </div>
  );
}
