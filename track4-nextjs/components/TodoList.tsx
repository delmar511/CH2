'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { Todo } from '@/types';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

interface Props {
  initialTodos: Todo[];
  userId: string;
}

type UIState = 'loading' | 'success' | 'error' | 'empty';

export default function TodoList({ initialTodos, userId }: Props) {
  const supabase = createClient(); // safe: only runs in browser

  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [uiState, setUiState] = useState<UIState>(initialTodos.length === 0 ? 'empty' : 'success');
  const [errorMsg, setErrorMsg] = useState('');

  // 목록 새로고침
  const refresh = async () => {
    setUiState('loading');
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setUiState('error');
    } else {
      setTodos(data ?? []);
      setUiState(data && data.length > 0 ? 'success' : 'empty');
    }
  };

  // 할 일 추가
  const handleAdd = async (title: string) => {
    const { error } = await supabase.from('todos').insert({
      user_id: userId,
      title,
      is_done: false,
    });
    if (error) alert('추가 실패: ' + error.message);
    else await refresh();
  };

  // 완료 토글
  const handleToggle = async (todo: Todo) => {
    const { error } = await supabase
      .from('todos')
      .update({ is_done: !todo.is_done, updated_at: new Date().toISOString() })
      .eq('id', todo.id);
    if (error) alert('수정 실패: ' + error.message);
    else await refresh();
  };

  // 제목 수정
  const handleEdit = async (id: string, newTitle: string) => {
    const { error } = await supabase
      .from('todos')
      .update({ title: newTitle, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) alert('수정 실패: ' + error.message);
    else await refresh();
  };

  // 삭제
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) alert('삭제 실패: ' + error.message);
    else await refresh();
  };

  // 로그아웃
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <>
      <TodoForm onAdd={handleAdd} />

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0 8px', fontSize: 13, color: '#666' }}>
        <span>전체 {todos.length}개 / 완료 {todos.filter(t => t.is_done).length}개</span>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 13 }}>
          로그아웃
        </button>
      </div>

      {/* 4가지 상태 UI */}
      {uiState === 'loading' && (
        <p style={{ textAlign: 'center', padding: 32, color: '#888' }}>불러오는 중...</p>
      )}

      {uiState === 'error' && (
        <p style={{ color: 'red', padding: 16 }}>오류: {errorMsg}</p>
      )}

      {uiState === 'empty' && (
        <p style={{ textAlign: 'center', padding: 32, color: '#888' }}>할 일이 없습니다. 위에서 추가해 보세요!</p>
      )}

      {uiState === 'success' && (
        <ul style={{ listStyle: 'none' }}>
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </>
  );
}
