import { ReactNode } from 'react'

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col pt-4 px-8 space-y-2   pb-4 bg-background">
      {children}
    </div>
  )
}
