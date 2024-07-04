'use client'

export default function ButtonExport() {
  return (
    <a
      href="http://localhost:3000/manual.pdf"
      download={'manual-de-usuario.pdf'}
    >
      Descargar
    </a>
  )
}
