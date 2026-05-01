'use client';

import { useEffect, useRef, useState } from 'react';
import type { Card as CardType } from '@/types';

interface Props {
  card: CardType;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
}

export default function CardDetailModal({ card, onClose, onSave }: Props) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(trimmed, description.trim());
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const isTextArea = (e.target as HTMLElement).tagName === 'TEXTAREA';
      if (!isTextArea || e.metaKey || e.ctrlKey) {
        e.preventDefault();
        handleSave();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">카드 상세</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-neutral-100 hover:text-gray-600"
            aria-label="닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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

        <div className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="modal-card-title"
              className="mb-1 block text-xs font-medium text-gray-500"
            >
              제목
            </label>
            <input
              ref={titleRef}
              id="modal-card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="카드 제목"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <div>
            <label
              htmlFor="modal-card-description"
              className="mb-1 block text-xs font-medium text-gray-500"
            >
              설명
            </label>
            <textarea
              id="modal-card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="설명을 입력하세요 (선택)"
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            저장
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-neutral-200 py-2 text-sm font-medium text-gray-700 hover:bg-neutral-300"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
