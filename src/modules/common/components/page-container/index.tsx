export default function PageContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 max-h-full m-3 mx-0 overflow-hidden overflow-y-auto bg-background border border-border rounded-sm">
      {children}
    </div>
  )
}
