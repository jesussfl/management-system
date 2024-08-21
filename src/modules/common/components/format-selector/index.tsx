'use client'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/modules/common/components/radio-group'
import { Label } from '@/modules/common/components/label/label'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Button } from '@/modules/common/components/button'
import { useToast } from '@/modules/common/components/toast/use-toast'

export default function FormatSelector({
  data,
  type,
}: {
  data: any
  type: 'despacho' | 'recepcion' | 'solicitud' | 'devolucion' | 'prestamo'
}) {
  const { toast } = useToast()
  const [format, setFormat] = useState<string>('PDF')
  const [loading, setLoading] = useState(false)
  const handleExport = async () => {
    setLoading(true)
    try {
      const apiUrl = format === 'PDF' ? '/api/export-pdf' : '/api/export-word'

      const body = {
        data,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/guia-${type}-template.docx`,
        name: type,
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
      a.download = `guia-de-${type}-${data.codigo}.${
        format === 'PDF' ? 'pdf' : 'docx'
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
  return (
    <Card className="min-w-[300px]">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">
          Selecciona el formato
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-8">
        <RadioGroup
          disabled={loading}
          defaultValue="comfortable"
          onValueChange={(value) => setFormat(value)}
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
        <Button
          disabled={loading}
          variant="default"
          onClick={() => handleExport()}
        >
          Exportar
        </Button>
      </CardContent>
    </Card>
  )
}
