import { createServerSupabase } from '@/lib/supabase-server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TodoDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: todo, error } = await supabase
    .from('todos')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !todo) notFound();

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
      <Link href="/todos" style={{ fontSize: 13 }}>← 목록으로</Link>
      <h1 style={{ margin: '16px 0 8px' }}>할 일 상세</h1>
      <div style={{ border: '1px solid #ddd', padding: 20, background: '#fff' }}>
        <p><strong>제목:</strong> {todo.title}</p>
        <p style={{ marginTop: 8 }}>
          <strong>상태:</strong> {todo.is_done ? '✅ 완료' : '⬜ 미완료'}
        </p>
        <p style={{ marginTop: 8 }}>
          <strong>등록일:</strong> {new Date(todo.created_at).toLocaleString('ko-KR')}
        </p>
        <p style={{ marginTop: 8 }}>
          <strong>수정일:</strong> {new Date(todo.updated_at).toLocaleString('ko-KR')}
        </p>
      </div>
    </div>
  );
}
