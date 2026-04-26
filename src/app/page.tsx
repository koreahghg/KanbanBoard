import Column from '@/components/board/Column';
import { board, cards, lists } from '@/lib/dummyData';

export default function BoardPage() {
  return (
    <main className="flex h-full flex-col p-4">
      <h1 className="mb-4 text-xl font-bold text-white">My Board</h1>
      <div className="flex items-start gap-3 overflow-x-auto pb-4">
        {board.listIds.map((listId) => {
          const list = lists[listId];
          const listCards = list.cardIds.map((cardId) => cards[cardId]);
          return <Column key={listId} list={list} cards={listCards} />;
        })}
      </div>
    </main>
  );
}
