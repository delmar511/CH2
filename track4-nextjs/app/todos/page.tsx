import { createServerSupabase } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import TodoList from '@/components/TodoList';

export default async function TodosPage() {
  const supabase = await createServerSupabase();

  // 서버 컴포넌트: 사용자 인증 확인
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 서버 컴포넌트: 초기 데이터 조회
  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>할 일 목록</h1>
        <span style={{ fontSize: 13, color: '#666' }}>{user.email}</span>
      </div>
      {error ? (
        <p style={{ color: 'red' }}>데이터를 불러오지 못했습니다: {error.message}</p>
      ) : (
        <TodoList initialTodos={todos ?? []} userId={user.id} />
      )}
    </div>
  );
}
