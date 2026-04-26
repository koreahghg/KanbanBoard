'use client';

import { useEffect, useState } from 'react';
import type { Card as CardType } from '@/types';

interface Props {
  card: CardType;
  onDelete: () => void;
  onEdit: (title: string, description: string) => void;
}

export default function Card({ card, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(card.description);

  useEffect(() => {
    if (!isEditing) {
      setEditTitle(card.title);
      setEditDescription(card.description);
    }
  }, [card.title, card.description, isEditing]);

  const handleSave = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    onEdit(trimmed, editDescription.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(card.title);
    setEditDescription(card.description);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleCancel();
    if (e.key === 'Enter') {
      const isTextArea = (e.target as HTMLElement).tagName === 'TEXTAREA';
      if (!isTextArea || e.metaKey || e.ctrlKey) {
        e.preventDefault();
        handleSave();
      }
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 rounded-md bg-white p-3 shadow-sm">
        <input
          autoFocus
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="카드 제목"
          aria-label="카드 제목 수정"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="설명 (선택)"
          rows={3}
          aria-label="카드 설명 수정"
          className="resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 rounded-lg bg-sky-600 py-1.5 text-sm font-medium text-white hover:bg-sky-700"
          >
            저장
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg bg-neutral-200 py-1.5 text-sm font-medium text-gray-700 hover:bg-neutral-300"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-md bg-white px-3 py-2 shadow-sm transition-shadow hover:shadow-md">
      <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
        <p className="pr-5 text-sm font-medium text-gray-800">{card.title}</p>
        {card.description && (
          <p className="mt-1 text-xs text-gray-500">{card.description}</p>
        )}
      </div>
      <button
        onClick={onDelete}
        className="absolute right-2 top-2 rounded p-0.5 text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
        aria-label="카드 삭제"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
