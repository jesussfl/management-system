import { Switch } from '@/modules/common/components/switch/switch'
import { cn } from '@/utils/utils'

type PermissionToogleProps = {
  icon: React.ReactNode
  title: string
  description?: string
  checked: boolean
  onCheckedChange: (value: boolean) => void
  isOnlyView?: boolean
  className?: string
}

export const PermissionToggle = ({
  icon,
  title,
  description,
  checked,
  isOnlyView,
  className,
  onCheckedChange,
}: PermissionToogleProps) => {
  return (
    <div
      className={cn(
        'flex flex-1 flex-row items-center justify-between rounded-lg border p-3 shadow-sm max-w-[250px]',
        className
      )}
    >
      <div className="flex flex-row items-center gap-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-50">
          {icon}
        </div>
        <div className="flex flex-col gap-0">
          <h6 className="text-sm font-medium">{title}</h6>
          <p className="text-sm text-foreground">{description}</p>
        </div>
      </div>
      <Switch
        disabled={isOnlyView}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  )
}
