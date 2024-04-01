'use server'

import { currentRole } from '@/lib/auth'

import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

export const admin = async () => {
  const role = await currentRole()

  if (role === 'admin') {
    return { success: 'Allowed Server Action!' }
  }

  return { error: 'Forbidden Server Action!' }
}

export const backup = async () => {
  const fileName = 'database-backup-' + new Date().valueOf() + '.tar'
  // const publicFolderPath = path.resolve(__dirname, 'public') // Ruta de la carpeta public
  const backupFilePath = path.join('./public/backups', fileName) // Ruta completa del archivo de respaldo

  console.log(backupFilePath)
  // Usamos promisify para convertir fs.writeFile en una función asíncrona
  const writeFileAsync = promisify(fs.writeFile)

  try {
    await writeFileAsync(backupFilePath, 'This is my text')
    console.log('Results Received')
  } catch (err) {
    console.error('Error writing file:', err)
    throw err
  }

  exec(
    'docker exec -e PGPASSWORD=LrsjtYLTDKd1wP53i3AC9BPs5epm4Tih postgres_container pg_dump -h dpg-cmh9aimn7f5s739q8ui0-a.oregon-postgres.render.com -U ceserlodai_user ceserlodai > ' +
      backupFilePath +
      ' -F t',
    (err, stdout, stderr) => {
      console.log('Backup Created!', fileName)
      if (err) {
        console.error('Error during backup:', err)
      }
    }
  )

  console.log('Backup Created!', fileName)
}

export const restore = async () => {
  const dir = './public/backup'

  // Sort the backup files according to when they were created
  // const files = fs
  //   .readdirSync(dir)
  //   .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
  //   .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
  //   .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())

  // if (!files.length) {
  //   return { message: 'No backups available to restore from' }
  // }

  // const fileName = files[0].file
  exec(
    'docker exec -e PGPASSWORD=LrsjtYLTDKd1wP53i3AC9BPs5epm4Tih -i postgres_container pg_restore -c -x -O -h dpg-cmh9aimn7f5s739q8ui0-a.oregon-postgres.render.com -U ceserlodai_user -d ceserlodai < ' +
      './public/backups/database-backup-1709308222537.tar',
    (err, stdout, stderr) => {
      if (err) {
        console.error('Error during restore:', err)
      } else {
        console.log('Backup Restored!')
      }
    }
  )
}
