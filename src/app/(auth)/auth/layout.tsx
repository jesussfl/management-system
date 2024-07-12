import Image from 'next/image'
import Ceserlodai from '@public/imagen_principal.jpg'
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col-reverse p-4 h-full lg:min-h-screen lg:max-h-screen lg:flex-row lg:p-8 md:p-5 bg-gray-50">
      <div className="relative flex flex-1 w-[100px] rounded-md">
        <Image
          fill={true}
          style={{ objectFit: 'cover' }}
          src={Ceserlodai}
          alt="background"
          className="rounded-lg"
        />
        <div className="p-3 absolute top-4 left-4 bg-white rounded-lg">
          <span className="self-center font-extrabold whitespace-nowrap px-3 text-blue-700 tex-sm md:text-2xl dark:text-blue-700">
            CeserNET
          </span>
        </div>
      </div>
      <div className="flex lg:flex-1">{children}</div>
    </div>
  )
}
