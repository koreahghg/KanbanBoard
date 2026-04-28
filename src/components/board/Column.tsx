'use client';

import type { Card as CardType, Column as ColumnType } from '@/types';
import { useBoardStore } from '@/store/boardStore';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AddCard from './AddCard';
import Card from './Card';

interface Props {
  column: ColumnType;
  cards: CardType[];
  onDelete?: () => void;
}

export default function Column({ column, cards, onDelete }: Props) {
  const addCard = useBoardStore((state) => state.addCard);
  const updateCard = useBoardStore((state) => state.updateCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);

  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl bg-neutral-100/90 p-2">
      <div className="mb-2 flex items-center gap-2 px-1">
        <h2 className="flex-1 text-sm font-semibold text-gray-700">{column.title}</h2>
        <span className="rounded-full bg-neutral-300 px-1.5 py-0.5 text-xs font-medium text-gray-600">
          {cards.length}
        </span>
        {onDelete && (
          <button
            onClick={onDelete}
            className="ml-1 rounded p-0.5 text-gray-400 hover:bg-neutral-200 hover:text-red-500"
            aria-label="컬럼 삭제"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
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
        )}
      </div>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex min-h-2 flex-col gap-2">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              columnId={column.id}
              onDelete={() => deleteCard(column.id, card.id)}
              onEdit={(title, description) => updateCard(card.id, { title, description })}
            />
          ))}
        </div>
      </SortableContext>
      <div className="mt-2">
        <AddCard onAdd={(title) => addCard(column.id, title)} />
      </div>
    </div>
  );
}
