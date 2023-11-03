import { ReactNode } from 'react'

export default function MarginWidthWrapper({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex flex-col md:ml-[256px] 2xl:ml-[324px]  min-h-screen">
      {children}
    </div>
  )
}
