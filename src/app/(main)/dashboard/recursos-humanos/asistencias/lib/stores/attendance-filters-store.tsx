import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
export type AttendanceFilterState = {
  currentMonth: Date
  selectedYear: number
  searchText: string
}

export type AttendanceFilterActions = {
  handleMonthChange: (value: string) => void
  handleYearChange: (value: string) => void
  handleSearchTextChange: (value: string) => void
}

export type AttendanceFilterStore = AttendanceFilterState &
  AttendanceFilterActions

export const defaultInitState: AttendanceFilterState = {
  currentMonth: new Date(),
  selectedYear: new Date().getFullYear(),
  searchText: '',
}

const useAttendanceFilterStore = create(
  persist<AttendanceFilterStore>(
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
      name: 'attendance-filter-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export const useAllAttendanceFilterStore = useAttendanceFilterStore
export const useAttendanceByUserFilterStore = useAttendanceFilterStore
