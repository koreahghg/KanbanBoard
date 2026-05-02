'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import AddColumn from '@/components/board/AddColumn';
import CardContent from '@/components/board/CardContent';
import CardDetailModal from '@/components/board/CardDetailModal';
import Column from '@/components/board/Column';
import { useBoardStore } from '@/store/boardStore';

export default function BoardPage() {
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const boards = useBoardStore((state) => state.boards);
  const columns = useBoardStore((state) => state.columns);
  const cards = useBoardStore((state) => state.cards);
  const addColumn = useBoardStore((state) => state.addColumn);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);
  const moveCard = useBoardStore((state) => state.moveCard);
  const updateCard = useBoardStore((state) => state.updateCard);
  const activeBoard = activeBoardId ? boards[activeBoardId] : null;

  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const didDragRef = useRef(false);

  useEffect(() => {
    useBoardStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  const handleOpenModal = useCallback((cardId: string) => {
    if (didDragRef.current) return;
    setSelectedCardId(cardId);
  }, []);

  const handleCloseModal = useCallback(() => setSelectedCardId(null), []);

  if (!isHydrated) return null;
  if (!activeBoard || !activeBoardId) return null;

  const handleDragStart = ({ active }: DragStartEvent) => {
    didDragRef.current = true;
    setActiveCardId(active.id as string);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCardId(null);
    // rAF 이후 리셋: click 이벤트가 먼저 처리된 뒤 플래그를 해제
    requestAnimationFrame(() => {
      didDragRef.current = false;
    });

    if (!over || active.id === over.id) return;

    const cardId = active.id as string;
    const overId = over.id as string;
    const sourceColumnId = active.data.current?.columnId as string | undefined;
    if (!sourceColumnId) return;

    let destColumnId: string;
    let destIndex: number;

    if (overId in columns) {
      destColumnId = overId;
      destIndex = columns[overId].cardIds.length;
    } else {
      const destColId = over.data.current?.columnId as string | undefined;
      if (!destColId) return;
      destColumnId = destColId;
      destIndex = columns[destColumnId].cardIds.indexOf(overId);
      if (destIndex === -1) return;
    }

    moveCard(cardId, sourceColumnId, destColumnId, destIndex);
  };

  const activeCard = activeCardId ? cards[activeCardId] : null;
  const selectedCard = selectedCardId ? cards[selectedCardId] : null;

  return (
    <main className="flex h-full flex-col p-4">
      <h1 className="mb-4 text-xl font-bold text-white">{activeBoard.title}</h1>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex items-start gap-3 overflow-x-auto pb-4">
          {activeBoard.columnIds.map((columnId) => {
            const column = columns[columnId];
            const columnCards = column.cardIds.map((cardId) => cards[cardId]);
            return (
              <Column
                key={columnId}
                column={column}
                cards={columnCards}
                onDelete={() => deleteColumn(activeBoardId, columnId)}
                onOpenModal={handleOpenModal}
              />
            );
          })}
          <AddColumn onAdd={(title) => addColumn(activeBoardId, title)} />
        </div>
        <DragOverlay>
          {activeCard ? (
            <div className="animate-card-pickup w-64 cursor-grabbing rounded-md bg-white px-3 py-2 shadow-xl ring-2 ring-sky-400">
              <CardContent card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={handleCloseModal}
          onSave={(title, description) => updateCard(selectedCard.id, { title, description })}
        />
      )}
    </main>
  );
}
