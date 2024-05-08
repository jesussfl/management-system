export default async function Layout({
  modal,
  children,
}: {
  modal: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
