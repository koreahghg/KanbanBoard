'use client';

import { useState } from 'react';
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
  const activeBoard = activeBoardId ? boards[activeBoardId] : null;

  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  if (!activeBoard || !activeBoardId) return null;

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveCardId(active.id as string);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCardId(null);
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
              />
            );
          })}
          <AddColumn onAdd={(title) => addColumn(activeBoardId, title)} />
        </div>
        <DragOverlay>
          {activeCard ? (
            <div className="w-64 rotate-1 cursor-grabbing rounded-md bg-white px-3 py-2 shadow-xl ring-2 ring-sky-400">
              <CardContent card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}
