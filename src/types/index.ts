export type CardId = string;
export type ColumnId = string;
export type BoardId = string;

export interface Card {
  id: CardId;
  title: string;
  description: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  cardIds: CardId[];
}

export interface Board {
  id: BoardId;
  title: string;
  columnIds: ColumnId[];
}

export interface BoardState {
  boards: Record<BoardId, Board>;
  columns: Record<ColumnId, Column>;
  cards: Record<CardId, Card>;
  activeBoardId: BoardId | null;
}
