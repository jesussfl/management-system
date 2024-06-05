import { CardWrapper } from '@/app/(auth)/components/card-wrapper'
import Ceserlodai from '@public/ceserlodai.jpg'

import Image from 'next/image'
import ValidationForm from './components/verification-form'
import { Metadata } from 'next'
import ModalForm from '@/modules/common/components/modal-form'

export const metadata: Metadata = {
  title: 'Asistencias',
  description: 'Ingresa tu hora de entrada o salida',
}
export default function Page() {
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
      </div>
      <div className="flex lg:flex-1">
        <CardWrapper
          headerTitle="Control de Asistencias"
          headerLabel="Ingresa tu hora de entrada o salida"
        >
          <div className="flex justify-between gap-4">
            <ModalForm
              triggerName="Registrar Hora de Entrada"
              triggerVariant="default"
              closeWarning={false}
              className="w-[400px] p-8"
            >
              <ValidationForm type="entrada" />
            </ModalForm>
            <ModalForm
              triggerName="Registrar Hora de Salida"
              triggerVariant="destructive"
              closeWarning={false}
              className="w-[400px] p-8"
            >
              <ValidationForm type="salida" />
            </ModalForm>
          </div>
        </CardWrapper>
      </div>
    </div>
  )
}
