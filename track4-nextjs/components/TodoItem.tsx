'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Todo } from '@/types';

interface Props {
  todo: Todo;
  onToggle: (todo: Todo) => Promise<void>;
  onEdit: (id: string, newTitle: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    await onEdit(todo.id, editTitle.trim());
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') { setEditing(false); setEditTitle(todo.title); }
  };

  return (
    <li style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 12px',
      marginBottom: 6,
      background: '#fff',
      border: '1px solid #e0e0e0',
      opacity: todo.is_done ? 0.6 : 1,
    }}>
      <input
        type="checkbox"
        checked={todo.is_done}
        onChange={() => onToggle(todo)}
        style={{ cursor: 'pointer', width: 16, height: 16, flexShrink: 0 }}
      />

      {editing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ flex: 1, padding: '4px 6px', border: '1px solid #ccc' }}
        />
      ) : (
        <Link
          href={`/todos/${todo.id}`}
          style={{
            flex: 1,
            textDecoration: todo.is_done ? 'line-through' : 'none',
            color: todo.is_done ? '#999' : '#111',
            fontSize: 14,
          }}
        >
          {todo.title}
        </Link>
      )}

      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        {editing ? (
          <>
            <button onClick={handleSave} style={{ padding: '3px 8px', fontSize: 12, cursor: 'pointer' }}>저장</button>
            <button onClick={() => { setEditing(false); setEditTitle(todo.title); }} style={{ padding: '3px 8px', fontSize: 12, cursor: 'pointer' }}>취소</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} style={{ padding: '3px 8px', fontSize: 12, cursor: 'pointer', background: 'none', border: '1px solid #ccc' }}>수정</button>
            <button onClick={() => onDelete(todo.id)} style={{ padding: '3px 8px', fontSize: 12, cursor: 'pointer', background: 'none', border: '1px solid #ccc', color: '#c00' }}>삭제</button>
          </>
        )}
      </div>
    </li>
  );
}
