'use server'

import { currentRole } from '@/lib/auth'

import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

export const admin = async () => {
  const role = await currentRole()

  if (role === 'admin') {
    return { success: 'Allowed Server Action!' }
  }

  return { error: 'Forbidden Server Action!' }
}

// export const backup = async () => {
//   const fileName = 'database-backup-' + new Date().valueOf() + '.tar'
//   // const publicFolderPath = path.resolve(__dirname, 'public') // Ruta de la carpeta public
//   const backupFilePath = path.join('./public/backups', fileName) // Ruta completa del archivo de respaldo

//   console.log(backupFilePath)
//   // Usamos promisify para convertir fs.writeFile en una función asíncrona
//   const writeFileAsync = promisify(fs.writeFile)

//   try {
//     await writeFileAsync(backupFilePath, 'This is my text')
//     console.log('Results Received')
//   } catch (err) {
//     console.error('Error writing file:', err)
//     throw err
//   }

//   exec(
//     `docker exec -e PGPASSWORD=${process.env.PGPASSWORD} postgres_container pg_dump -h ${process.env.PGHOST}  -U ${process.env.PGUSER} -p ${process.env.PGPORT} ${process.env.PGDATABASE} > ` +
//       backupFilePath +
//       ' -F t',
//     (err, stdout, stderr) => {
//       console.log('Backup Created!', fileName)
//       if (err) {
//         console.error('Error during backup:', err)
//       }
//     }
//   )

//   console.log('Backup Created!', fileName)
// }

export const backup = async () => {
  try {
    const fileName = 'database-backup-' + new Date().valueOf() + '.tar'
    const backupFilePath = path.resolve('./public/backups', fileName)

    const execAsync = promisify(exec)

    await execAsync(
      `docker exec -e PGPASSWORD=${process.env.PGPASSWORD} postgres_container pg_dump -h ${process.env.PGHOST}  -U ${process.env.PGUSER} -p ${process.env.PGPORT} ${process.env.PGDATABASE} > ` +
        backupFilePath +
        ' -F t'
    )

    console.log('Backup Created!', fileName)
    return fileName
  } catch (error) {
    console.error('Error during backup:', error)
    throw error // Re-throw the error to be handled elsewhere if needed
  }
}

export const restore = async (fileNameToRestore: string) => {
  try {
    const execAsync = promisify(exec)
    await execAsync(
      `docker exec -e PGPASSWORD=${process.env.PGPASSWORD} -i postgres_container pg_restore -c -x -O -h ${process.env.PGHOST} -p ${process.env.PGPORT} -U ${process.env.PGUSER} -d ${process.env.PGDATABASE} < ` +
        `./public/backups/${fileNameToRestore}`
    )

    console.log('Restore Completed!', fileNameToRestore)
  } catch (error) {
    console.error('Error during restore:', error)
    throw error
  }
}
