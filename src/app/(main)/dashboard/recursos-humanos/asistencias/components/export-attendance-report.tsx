'use client'
import * as React from 'react'

import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'

import { useRouter } from 'next/navigation'

import { Usuario } from '@prisma/client'
import { DownloadIcon, Loader2, TrashIcon } from 'lucide-react'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)
import 'react-datepicker/dist/react-datepicker.css'
import { UserWithAttendances } from './attendance-table'
import { generateAttendanceReport } from '../lib/actions'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/modules/common/components/radio-group'
import { Label } from '@/modules/common/components/label/label'
type FormValues = {
  attendanceMonth: Date
}
interface Props {
  users: UserWithAttendances[]
}

export default function ExportAttendanceReport({ users }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const comboboxUsers = users.map((user) => ({
    value: user.id,
    label: `${user.tipo_cedula}-${user.cedula} ${user.nombre}`,
  }))
  //   console.log('users', comboboxUsers)
  const form = useForm<FormValues>({})
  const [isPending, startTransition] = React.useTransition()
  const [loading, setLoading] = React.useState(false)
  const [documentFormat, setDocumentFormat] = React.useState<string>('PDF')
  const handleExport = async (data: any) => {
    setLoading(true)
    try {
      const apiUrl =
        documentFormat === 'PDF'
          ? '/api/export-report-pdf'
          : '/api/export-report-word'

      const body = {
        data,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/reporte-asistencias-template.docx`,
        name: 'reporte-asistencias',
      }
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        toast({
          title: 'Parece que hubo un problema',
          description: 'No se pudo generar el archivo',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-asistencias.${
        documentFormat === 'PDF' ? 'pdf' : 'docx'
      }`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      toast({
        title: 'Parece que hubo un problema',
        description: 'No se pudo generar el archivo: ' + error,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(async () => {
      console.log('values', values)
      const data = await generateAttendanceReport(values.attendanceMonth)
      //   await generateAuditReportData(
      //   )
      //   console.log('data', data)
      handleExport(data)
    })
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-hidden gap-8 mb-36"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-xl text-center font-semibold">
              Exportar Reporte de Asistencias
            </h1>
            <p className="text-center font-normal text-sm text-slate-600">
              Selecciona el mes
            </p>
          </div>
          <FormField
            control={form.control}
            name={`attendanceMonth`}
            rules={{
              required: true,
              validate: (value) => {
                if (value > new Date())
                  return 'La fecha no puede ser mayor a la actual'
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selecciona el mes de las asistencias</FormLabel>
                <div className="flex flex-1 gap-4">
                  <DatePicker
                    placeholderText="Seleccionar mes"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    locale={es}
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    showFullMonthYearPicker
                    showTwoColumnMonthYearPicker
                  />
                  <Button
                    variant={'secondary'}
                    onClick={(e) => {
                      e.preventDefault()
                      field.onChange(null)
                    }}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          <RadioGroup
            disabled={loading}
            defaultValue="comfortable"
            onValueChange={(value) => setDocumentFormat(value)}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PDF" id="r1" />
              <Label htmlFor="r1">{`PDF (Recomendado)`}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="WORD" id="r2" />
              <Label htmlFor="r2">WORD</Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-4">
          <Button variant="default" type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <DownloadIcon className="mr-2 h-4 w-4" />
            )}
            {isPending ? 'Exportando...' : 'Exportar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
