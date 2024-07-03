import React from 'react';
import { Filter } from './task-filter';

export interface HistoryCtx {
  selected: number[];
  selectMode: boolean;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  selectAll: () => void;
  unselectAll: () => void;
  removeTasks: () => void;
  toggleSelectMode: () => void;
  toggleSelected: (id: number) => void;
}

export const HistoryContext = React.createContext<HistoryCtx | null>(null);
