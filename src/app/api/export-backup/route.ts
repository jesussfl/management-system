import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execAsync = promisify(exec)

export async function POST() {
  try {
    const fileName = 'database-backup-' + new Date().valueOf() + '.tar'
    const backupFilePath = path.resolve('/tmp', fileName)

    // Ejecutar el comando pg_dump
    await execAsync(
      `docker exec -e PGPASSWORD=${process.env.PGPASSWORD} postgres_container pg_dump -h ${process.env.PGHOST} -U ${process.env.PGUSER} -p ${process.env.PGPORT} ${process.env.PGDATABASE} -F t > ${backupFilePath}`
    )

    // Leer el archivo de backup
    const fileBuffer = fs.readFileSync(backupFilePath)

    // Eliminar el archivo temporal después de leerlo
    fs.unlinkSync(backupFilePath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/x-tar',
        'Content-Disposition': `attachment; filename=${fileName}`,
      },
    })
  } catch (error) {
    console.error('Error during backup:', error)
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
