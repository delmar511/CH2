'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/todos');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 24 }}>로그인</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 4 }}>이메일</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 4 }}>비밀번호</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc' }} />
        </div>
        {error && <p style={{ color: 'red', marginBottom: 12, fontSize: 13 }}>{error}</p>}
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '10px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14, textAlign: 'center' }}>
        계정이 없으신가요? <Link href="/signup">회원가입</Link>
      </p>
    </div>
  );
}
