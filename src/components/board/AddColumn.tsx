'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  onAdd: (title: string) => void;
}

export default function AddColumn({ onAdd }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed) onAdd(trimmed);
    setTitle('');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
        className="flex h-fit w-72 shrink-0 items-center gap-2 rounded-xl bg-white/20 px-3 py-2.5 text-sm font-medium text-white hover:bg-white/30"
      >
        <span className="text-lg leading-none">+</span>
        <span>컬럼 추가</span>
      </button>
    );
  }

  return (
    <div className="flex w-72 shrink-0 flex-col gap-2 rounded-xl bg-neutral-100/90 p-2">
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="컬럼 이름 입력..."
        aria-label="새 컬럼 이름"
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 rounded-lg bg-sky-600 py-1.5 text-sm font-medium text-white hover:bg-sky-700"
        >
          추가
        </button>
        <button
          onClick={() => {
            setTitle('');
            setIsEditing(false);
          }}
          className="flex-1 rounded-lg bg-neutral-200 py-1.5 text-sm font-medium text-gray-700 hover:bg-neutral-300"
        >
          취소
        </button>
      </div>
    </div>
  );
}
