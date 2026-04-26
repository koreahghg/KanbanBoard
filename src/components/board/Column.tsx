import type { Card as CardType, List } from '@/types';
import Card from './Card';

interface Props {
  list: List;
  cards: CardType[];
}

export default function Column({ list, cards }: Props) {
  return (
    <div className="flex w-72 flex-shrink-0 flex-col rounded-xl bg-neutral-100/90 p-2">
      <div className="mb-2 flex items-center gap-2 px-1">
        <h2 className="text-sm font-semibold text-gray-700">{list.title}</h2>
        <span className="rounded-full bg-neutral-300 px-1.5 py-0.5 text-xs font-medium text-gray-600">
          {cards.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
