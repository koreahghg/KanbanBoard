import type { Card as CardType } from '@/types';

interface Props {
  card: CardType;
}

export default function Card({ card }: Props) {
  return (
    <div className="rounded-md bg-white px-3 py-2 shadow-sm">
      <p className="text-sm font-medium text-gray-800">{card.title}</p>
      {card.description && (
        <p className="mt-1 text-xs text-gray-500">{card.description}</p>
      )}
    </div>
  );
}
