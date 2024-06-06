'use client'

import { Button } from '@/modules/common/components/button'
import { FileDown } from 'lucide-react'
import { useState } from 'react'

export default function ButtonExport({ data }: any) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/exportDocument', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        console.error('Failed to generate PDF')
        setLoading(false)
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `despacho_${data.destinatario_cedula}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading}
    >
      <FileDown className="mr-2 h-4 w-4" />
      {loading ? 'Exportando...' : 'Exportar'}
    </Button>
  )
}
