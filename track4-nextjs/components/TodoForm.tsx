'use client';

import { useState } from 'react';

interface Props {
  onAdd: (title: string) => Promise<void>;
}

export default function TodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onAdd(title.trim());
    setTitle('');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할 일을 입력하세요..."
        required
        style={{ flex: 1, padding: '8px 10px', border: '1px solid #ccc' }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{ padding: '8px 16px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        {loading ? '...' : '추가'}
      </button>
    </form>
  );
}
