import type { Board, Card, Column } from '@/types';

export const cards: Record<string, Card> = {
  'card-1': {
    id: 'card-1',
    title: 'Design system setup',
    description: 'Define color tokens, typography, and spacing scale',
  },
  'card-2': {
    id: 'card-2',
    title: 'Auth flow wireframe',
    description: 'Sign in / sign up UX flow diagram',
  },
  'card-3': {
    id: 'card-3',
    title: 'API schema review',
    description: 'Review REST endpoints with backend team',
  },
  'card-4': {
    id: 'card-4',
    title: 'Component library',
    description: 'Build reusable button, input, and modal components',
  },
  'card-5': {
    id: 'card-5',
    title: 'Board drag-and-drop',
    description: 'Integrate dnd-kit for card reordering',
  },
  'card-6': {
    id: 'card-6',
    title: 'CI/CD pipeline',
    description: 'Set up GitHub Actions for lint and build checks',
  },
  'card-7': {
    id: 'card-7',
    title: 'Deployed to Vercel',
    description: 'Production environment live and smoke-tested',
  },
};

export const columns: Record<string, Column> = {
  'col-1': { id: 'col-1', title: 'To Do', cardIds: ['card-1', 'card-2', 'card-3'] },
  'col-2': { id: 'col-2', title: 'In Progress', cardIds: ['card-4', 'card-5'] },
  'col-3': { id: 'col-3', title: 'Done', cardIds: ['card-6', 'card-7'] },
};

export const board: Board = {
  id: 'board-1',
  title: 'My Board',
  columnIds: ['col-1', 'col-2', 'col-3'],
};
