import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="relative flex flex-1 bg-gray-50 border-solid border-[20px] border-gray-50 rounded-md">
        <Image
          fill={true}
          src="https://images.unsplash.com/photo-1500252185289-40ca85eb23a7?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="background"
          className="rounded-lg"
        />
      </div>
      <div className="flex flex-1">{children}</div>
    </div>
  )
}
