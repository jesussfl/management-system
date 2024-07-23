'use client'
import * as React from 'react'

import { useForm, SubmitHandler } from 'react-hook-form'
import { Form } from '@/modules/common/components/form'
import { Rol } from '@prisma/client'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/modules/common/components/card/card'
import { PermissionsList } from './permissions-table-form'

type FormValues = Rol & { permisos: string[] }
interface Props {
  defaultValues?: FormValues
}

export default function ViewPermissionsForm({ defaultValues }: Props) {
  const form = useForm<FormValues>({
    defaultValues,
  })

  const onSubmit: SubmitHandler<FormValues> = async (values) => {}

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="relative flex flex-row overflow-y-auto px-8 gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card className="flex-1 h-full">
          <CardHeader>
            {/* <CardTitle className="text-md">
              Seleccione los permisos del rol
            </CardTitle> */}
          </CardHeader>
          <CardContent className="h-full">
            <PermissionsList onCheckedChange={() => {}} isOnlyView={true} />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
