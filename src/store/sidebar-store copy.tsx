import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
export type PasswordState = {
  passwordTries: number
}

export type PasswordActions = {
  sumPasswordTries: () => void
}

export type PasswordStore = PasswordState & PasswordActions

export const defaultInitState: PasswordState = {
  passwordTries: 0,
}

export const usePasswordStore = create(
  persist<PasswordStore>(
    (set, get) => ({
      ...defaultInitState,

      sumPasswordTries: () => {
        set((state) => ({ ...state, passwordTries: state.passwordTries + 1 }))
      },
    }),
    {
      name: 'password-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
