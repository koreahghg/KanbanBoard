import type { Card as CardType } from '@/types';

interface Props {
  card: CardType;
}

export default function CardContent({ card }: Props) {
  return (
    <>
      <p className="select-none pr-5 text-sm font-medium text-gray-800">{card.title}</p>
      {card.description && (
        <p className="mt-1 select-none text-xs text-gray-500">{card.description}</p>
      )}
    </>
  );
}
