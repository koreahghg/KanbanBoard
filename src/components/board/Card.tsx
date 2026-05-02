'use client';

import { memo, useCallback } from 'react';
import type { Card as CardType } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CardContent from './CardContent';

interface Props {
  card: CardType;
  columnId: string;
  onDelete: (cardId: string) => void;
  onOpenModal: (cardId: string) => void;
}

export default memo(function Card({ card, columnId, onDelete, onOpenModal }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: { columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = useCallback(() => onOpenModal(card.id), [onOpenModal, card.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpenModal(card.id);
      }
    },
    [onOpenModal, card.id],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(card.id);
    },
    [onDelete, card.id],
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group relative cursor-grab rounded-md px-3 py-2 transition-shadow active:cursor-grabbing ${
        isDragging
          ? 'border-2 border-dashed border-sky-200 bg-sky-50/40 shadow-none'
          : 'bg-white shadow-sm hover:shadow-md'
      }`}
    >
      <div
        className={`transition-transform duration-150 ${isDragging ? 'opacity-0' : 'group-hover:-translate-y-0.5'}`}
      >
        <CardContent card={card} />
      </div>
      <button
        onClick={handleDelete}
        className={`absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 ${
          isDragging ? 'hidden' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
        }`}
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
});
