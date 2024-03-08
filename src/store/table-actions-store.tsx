import { create } from 'zustand'

type TableActionsState = {
  id: number
  data: {}
  setId: (id: number) => void
  setData: (data: {}) => void
  reset: () => void
}

const initialState = {
  id: 0,
  data: {},
} as TableActionsState

export const useTableActionsStore = create<TableActionsState>((set) => ({
  ...initialState,
  setId: (id) => set({ id }),
  setData: (data) => set({ data }),
  reset: () => set(initialState),
}))
