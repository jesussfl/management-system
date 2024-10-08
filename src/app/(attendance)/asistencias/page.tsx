import { CardWrapper } from '@/app/(auth)/components/card-wrapper'
import Ceserlodai from '@public/ceserlodai.jpg'

import Image from 'next/image'
import ValidationForm from './components/verification-form'
import { Metadata } from 'next'
import ModalForm from '@/modules/common/components/modal-form'
import { ArrowBigDown, ArrowBigUp, Clock } from 'lucide-react'
import { checkIfShowCredentialsEnabled } from './lib/actions'

export const metadata: Metadata = {
  title: 'Asistencias',
  description: 'Ingresa tu hora de entrada o salida',
}
export default async function Page() {
  const isCredentialsEnabled = await checkIfShowCredentialsEnabled()
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
      <div className="flex lg:flex-1 items-center">
        <CardWrapper
          headerTitle="Control de Asistencias"
          headerLabel="Ingresa tu hora de entrada o salida"
        >
          <div className="flex flex-col gap-24">
            <ModalForm
              triggerName="Registrar Hora de Entrada"
              triggerVariant="default"
              triggerSize="xl"
              triggerIcon={<ArrowBigUp className="h-8 w-8" />}
              closeWarning={false}
              className="w-[400px] p-8"
            >
              <ValidationForm
                type="entrada"
                isCredentialsEnabled={isCredentialsEnabled}
              />
            </ModalForm>
            <ModalForm
              triggerName="Registrar Hora de Salida"
              triggerIcon={<ArrowBigDown className="h-8 w-8" />}
              triggerVariant="destructive"
              closeWarning={false}
              triggerSize="xl"
              className="w-[400px] p-8"
            >
              <ValidationForm
                type="salida"
                isCredentialsEnabled={isCredentialsEnabled}
              />
            </ModalForm>
          </div>
        </CardWrapper>
      </div>
    </div>
  )
}
