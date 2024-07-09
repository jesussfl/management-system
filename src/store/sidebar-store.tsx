import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
export type SidebarState = {
  isCollapsed: boolean
}

export type SidebarActions = {
  setCollapsed: (isCollapsed: boolean) => void
}

export type SidebarStore = SidebarState & SidebarActions

export const defaultInitState: SidebarState = {
  isCollapsed: false,
}

export const useSidebarStore = create(
  persist<SidebarStore>(
    (set, get) => ({
      ...defaultInitState,
      setCollapsed: (isCollapsed) =>
        set((state) => ({ ...state, isCollapsed })),
    }),
    {
      name: 'sidebar-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
