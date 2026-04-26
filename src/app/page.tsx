'use client';

import Column from '@/components/board/Column';
import { useBoardStore } from '@/store/boardStore';

export default function BoardPage() {
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const boards = useBoardStore((state) => state.boards);
  const columns = useBoardStore((state) => state.columns);
  const cards = useBoardStore((state) => state.cards);
  const activeBoard = activeBoardId ? boards[activeBoardId] : null;

  if (!activeBoard) return null;

  return (
    <main className="flex h-full flex-col p-4">
      <h1 className="mb-4 text-xl font-bold text-white">{activeBoard.title}</h1>
      <div className="flex items-start gap-3 overflow-x-auto pb-4">
        {activeBoard.columnIds.map((columnId) => {
          const column = columns[columnId];
          const columnCards = column.cardIds.map((cardId) => cards[cardId]);
          return <Column key={columnId} column={column} cards={columnCards} />;
        })}
      </div>
    </main>
  );
}
