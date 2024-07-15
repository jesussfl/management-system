import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
export type auditFilterState = {
  currentMonth: Date
  selectedYear: number
  searchText: string
}

export type AuditFilterActions = {
  handleMonthChange: (value: string) => void
  handleYearChange: (value: string) => void
  handleSearchTextChange: (value: string) => void
}

export type AuditFilterStore = auditFilterState & AuditFilterActions

export const defaultInitState: auditFilterState = {
  currentMonth: new Date(),
  selectedYear: new Date().getFullYear(),
  searchText: '',
}

const useAuditFilterStore = create(
  persist<AuditFilterStore>(
    (set, get) => ({
      ...defaultInitState,
      handleMonthChange: (value: string) =>
        set((state) => {
          const currentMonth = new Date(get().currentMonth)
          return {
            currentMonth: new Date(currentMonth.setMonth(parseInt(value))),
          }
        }),

      handleYearChange: (value: string) =>
        set((state) => {
          const newYear = parseInt(value)
          const currentMonth = new Date(get().currentMonth)

          return {
            selectedYear: newYear,
            currentMonth: new Date(currentMonth.setFullYear(parseInt(value))),
          }
        }),

      handleSearchTextChange: (value: string) => set({ searchText: value }),
    }),
    {
      name: 'audit-filter-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export const useAllAuditFilterStore = useAuditFilterStore
export const useAuditByUserFilterStore = useAuditFilterStore
