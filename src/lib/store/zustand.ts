import { create } from 'zustand'


type Store = {
    rowSelection: {}
    setRowSelection: (fn: (prev: PrevState) => PrevState) => void
}

export const useTransactionsRenglon = create<Store>((set) => ({
    rowSelection: {},
    setRowSelection: (fn: (prev: PrevState) => PrevState) => {
      return set((state) => ({ rowSelection: fn(state.rowSelection) }));
    },
    }));