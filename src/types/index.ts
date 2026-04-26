export type CardId = string;
export type ListId = string;

export interface Card {
  id: CardId;
  title: string;
  description: string;
}

export interface List {
  id: ListId;
  title: string;
  cardIds: CardId[];
}

export interface Board {
  listIds: ListId[];
}
