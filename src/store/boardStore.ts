import { create } from 'zustand';
import type { BoardState, Card, CardId, ColumnId, BoardId } from '@/types';
import { generateId } from '@/lib/utils';
import { board, cards, columns } from '@/lib/dummyData';

interface BoardActions {
  addCard: (columnId: ColumnId, title: string, description?: string) => void;
  updateCard: (cardId: CardId, updates: Partial<Pick<Card, 'title' | 'description'>>) => void;
  deleteCard: (columnId: ColumnId, cardId: CardId) => void;
  addColumn: (boardId: BoardId, title: string) => void;
  deleteColumn: (boardId: BoardId, columnId: ColumnId) => void;
  moveCard: (cardId: CardId, sourceColumnId: ColumnId, destColumnId: ColumnId, destIndex: number) => void;
}

const initialState: BoardState = {
  boards: { [board.id]: board },
  columns,
  cards,
  activeBoardId: board.id,
};

export const useBoardStore = create<BoardState & BoardActions>((set) => ({
  ...initialState,

  addCard: (columnId, title, description = '') =>
    set((state) => {
      const id = generateId();
      return {
        cards: { ...state.cards, [id]: { id, title, description } },
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            cardIds: [...state.columns[columnId].cardIds, id],
          },
        },
      };
    }),

  updateCard: (cardId, updates) =>
    set((state) => ({
      cards: { ...state.cards, [cardId]: { ...state.cards[cardId], ...updates } },
    })),

  deleteCard: (columnId, cardId) =>
    set((state) => ({
      cards: Object.fromEntries(Object.entries(state.cards).filter(([id]) => id !== cardId)),
      columns: {
        ...state.columns,
        [columnId]: {
          ...state.columns[columnId],
          cardIds: state.columns[columnId].cardIds.filter((id) => id !== cardId),
        },
      },
    })),

  addColumn: (boardId, title) =>
    set((state) => {
      const id = generateId();
      return {
        columns: { ...state.columns, [id]: { id, title, cardIds: [] } },
        boards: {
          ...state.boards,
          [boardId]: {
            ...state.boards[boardId],
            columnIds: [...state.boards[boardId].columnIds, id],
          },
        },
      };
    }),

  deleteColumn: (boardId, columnId) =>
    set((state) => {
      const { cardIds } = state.columns[columnId];
      const cardIdsSet = new Set(cardIds);
      return {
        cards: Object.fromEntries(Object.entries(state.cards).filter(([id]) => !cardIdsSet.has(id))),
        columns: Object.fromEntries(Object.entries(state.columns).filter(([id]) => id !== columnId)),
        boards: {
          ...state.boards,
          [boardId]: {
            ...state.boards[boardId],
            columnIds: state.boards[boardId].columnIds.filter((id) => id !== columnId),
          },
        },
      };
    }),

  moveCard: (cardId, sourceColumnId, destColumnId, destIndex) =>
    set((state) => {
      const source = state.columns[sourceColumnId];
      const filteredIds = source.cardIds.filter((id) => id !== cardId);

      if (sourceColumnId === destColumnId) {
        filteredIds.splice(destIndex, 0, cardId);
        return {
          columns: { ...state.columns, [sourceColumnId]: { ...source, cardIds: filteredIds } },
        };
      }

      const dest = state.columns[destColumnId];
      const newDestIds = [...dest.cardIds];
      newDestIds.splice(destIndex, 0, cardId);

      return {
        columns: {
          ...state.columns,
          [sourceColumnId]: { ...source, cardIds: filteredIds },
          [destColumnId]: { ...dest, cardIds: newDestIds },
        },
      };
    }),
}));
