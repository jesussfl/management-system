import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut } from 'lucide-react'

function SidenavAvatar() {
  return (
    <div className="flex md:px-6 md:pb-4 justify-between items-center mt-0">
      <div className="flex flex-row items-center">
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="w-10 h-10"
          />
          <AvatarFallback />
        </Avatar>
        <div>
          <p className="font-bold text-foreground">Shadcn</p>
          <p className="text-foreground">@shadcn</p>
        </div>
      </div>
      <LogOut size={20} color="gray" />
    </div>
  )
}

export default SidenavAvatar
