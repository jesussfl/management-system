import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black/60">
      <Loader2 className="animate-spin" size={88} color="white" />
    </div>
  )
}
