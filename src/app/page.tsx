import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/ui/sidebar'

export default async function Home() {
  const user = await prisma.user.findFirst({
    where: {
      email: 'test@test.com',
    },
  })

  return (
    <main>
      {/* <div className="border-t">
        <div className="bg-background">
          <div className="grid lg:grid-cols-5">
            <Sidebar className="hidden lg:block" />
          </div>
        </div>
      </div> */}
    </main>
  )
}
