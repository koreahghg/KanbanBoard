'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Card as CardType, Column as ColumnType } from '@/types';
import { useBoardStore } from '@/store/boardStore';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AddCard from './AddCard';
import Card from './Card';

interface Props {
  column: ColumnType;
  cards: CardType[];
  onOpenModal: (cardId: string) => void;
}

export default memo(function Column({ column, cards, onOpenModal }: Props) {
  const addCard = useBoardStore((state) => state.addCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);
  const updateColumn = useBoardStore((state) => state.updateColumn);
  const activeBoardId = useBoardStore((state) => state.activeBoardId);

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  // 컬럼 제목 인라인 편집
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle) titleInputRef.current?.focus();
  }, [isEditingTitle]);

  const handleTitleDoubleClick = useCallback(() => {
    setEditTitle(column.title);
    setIsEditingTitle(true);
  }, [column.title]);

  const handleTitleSave = useCallback(() => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== column.title) updateColumn(column.id, trimmed);
    setIsEditingTitle(false);
  }, [editTitle, column.title, column.id, updateColumn]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleTitleSave();
      if (e.key === 'Escape') {
        setEditTitle(column.title);
        setIsEditingTitle(false);
      }
    },
    [handleTitleSave, column.title],
  );

  // 컬럼 삭제 확인 (3초 후 자동 취소)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!isConfirmingDelete) return;
    const timer = setTimeout(() => setIsConfirmingDelete(false), 3000);
    return () => clearTimeout(timer);
  }, [isConfirmingDelete]);

  const handleDeleteColumnClick = useCallback(() => setIsConfirmingDelete(true), []);

  const handleConfirmDelete = useCallback(() => {
    if (activeBoardId) deleteColumn(activeBoardId, column.id);
  }, [activeBoardId, deleteColumn, column.id]);

  const handleDeleteCard = useCallback(
    (cardId: string) => deleteCard(column.id, cardId),
    [deleteCard, column.id],
  );

  const handleAddCard = useCallback(
    (title: string) => addCard(column.id, title),
    [addCard, column.id],
  );

  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);

  return (
    <div className="group flex w-72 shrink-0 flex-col rounded-xl bg-neutral-100/90 p-2">
      <div className="mb-2 flex items-center gap-2 px-1">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleTitleSave}
            className="flex-1 rounded bg-white px-1.5 py-0.5 text-sm font-semibold text-gray-700 outline-none ring-2 ring-sky-300"
            aria-label="컬럼 제목 편집"
          />
        ) : (
          <h2
            className="flex-1 cursor-text select-none text-sm font-semibold text-gray-700"
            onDoubleClick={handleTitleDoubleClick}
            title="더블클릭으로 편집"
          >
            {column.title}
          </h2>
        )}
        <span className="rounded-full bg-neutral-300 px-1.5 py-0.5 text-xs font-medium text-gray-600">
          {cards.length}
        </span>
        {isConfirmingDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleConfirmDelete}
              className="rounded bg-red-500 px-1.5 py-0.5 text-xs font-medium text-white hover:bg-red-600"
              aria-label="삭제 확인"
            >
              삭제
            </button>
            <button
              onClick={() => setIsConfirmingDelete(false)}
              className="rounded px-1.5 py-0.5 text-xs font-medium text-gray-500 hover:bg-neutral-200"
              aria-label="취소"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={handleDeleteColumnClick}
            className="ml-1 rounded p-0.5 text-gray-400 opacity-0 transition-all group-hover:opacity-100 focus-visible:opacity-100 hover:bg-neutral-200 hover:text-red-500"
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
      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex min-h-25 flex-1 flex-col gap-2 rounded-lg transition-colors ${
            isOver ? 'bg-sky-100/60 ring-2 ring-dashed ring-sky-300' : ''
          }`}
        >
          {cards.length === 0 && (
            <div className="flex items-center justify-center py-3 text-xs text-neutral-400 select-none">
              {isOver ? '여기에 놓기' : '카드를 드래그해서 이동'}
            </div>
          )}
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              columnId={column.id}
              onDelete={handleDeleteCard}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>
      </SortableContext>
      <div className="mt-2">
        <AddCard onAdd={handleAddCard} />
      </div>
    </div>
  );
});
