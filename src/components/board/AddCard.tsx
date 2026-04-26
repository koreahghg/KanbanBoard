'use client';

import { useState } from 'react';

interface Props {
  onAdd: (title: string) => void;
}

export default function AddCard({ onAdd }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed) onAdd(trimmed);
    setTitle('');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') {
      setTitle('');
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="w-full rounded px-2 py-1.5 text-left text-sm text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700"
      >
        + 카드 추가
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSubmit}
        placeholder="카드 제목 입력..."
        className="w-full rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
        aria-label="카드 제목"
      />
      <div className="flex gap-1">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600"
        >
          추가
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            setTitle('');
            setIsEditing(false);
          }}
          className="rounded px-3 py-1 text-sm text-neutral-600 transition-colors hover:bg-neutral-200"
        >
          취소
        </button>
      </div>
    </div>
  );
}
