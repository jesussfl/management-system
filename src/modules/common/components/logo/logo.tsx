import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

function Logo({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  return (
    <div
      className={`flex flex-row-reverse ${
        isOpen ? 'justify-between' : 'justify-center'
      } gap-0 mb-4`}
    >
      <div className="flex flex-wrap-reverse items-center justify-between gap-3 mb-4">
        {/* <Link href="/dashboard" className="flex flex-col gap-4 ">
          <span
            className={`${
              isOpen ? 'h-8 w-8' : 'h-[56px] w-[56px]'
            }  bg-border rounded-lg`}
          />
        </Link> */}
        {isOpen ? (
          <PanelLeftClose
            className="cursor-pointer text-white"
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <PanelLeftOpen
            className="cursor-pointer text-white"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
      </div>
      <div className={`flex flex-col gap-0 mb-4 ${isOpen ? '' : 'hidden'}`}>
        <p className="text-dark-muted font-regular text-xs">
          {' '}
          Sistema de Gestión{' '}
        </p>
        <span className="text-white font-medium text-sm">CESERLODAI</span>
      </div>
    </div>
  )
}

export default Logo
