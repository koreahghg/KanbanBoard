'use client';

import { useInlineEditor } from '@/hooks/useInlineEditor';

interface Props {
  onAdd: (title: string) => void;
}

export default function AddCard({ onAdd }: Props) {
  const { isEditing, title, inputRef, setTitle, handleSubmit, handleKeyDown, startEditing, cancelEditing } =
    useInlineEditor(onAdd);

  if (!isEditing) {
    return (
      <button
        onClick={startEditing}
        className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-sm text-neutral-500 transition-colors hover:bg-neutral-200/80 hover:text-neutral-700"
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
          className="shrink-0"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        카드 추가
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="카드 제목 입력..."
        aria-label="카드 제목"
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
          onClick={cancelEditing}
          className="flex-1 rounded-lg bg-neutral-200 py-1.5 text-sm font-medium text-gray-700 hover:bg-neutral-300"
        >
          취소
        </button>
      </div>
    </div>
  );
}
