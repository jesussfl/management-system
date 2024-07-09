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

export const backup = async () => {
  try {
    const fileName = 'database-backup-' + new Date().valueOf() + '.tar'
    const backupFilePath = path.resolve('./public/backups', fileName)

    const execAsync = promisify(exec)

    await execAsync(
      `pg_dump -F t -h ${process.env.PGHOST} -U ${process.env.PGUSER} -p ${process.env.PGPORT} ${process.env.PGDATABASE} > ` +
        backupFilePath
    )
    // if password in pgpass.conf is not recognized you should change the pg_hba configuration to IPv4 local connections:
    //host all all 127.0.0.1/32 md5
    //host all all ::1/128 trust

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
      `pg_restore -c -x -O -h ${process.env.PGHOST} -p ${process.env.PGPORT} -U ${process.env.PGUSER} -d ${process.env.PGDATABASE} < ` +
        `./public/backups/${fileNameToRestore}`
    )

    console.log('Restore Completed!', fileNameToRestore)
    return true
  } catch (error) {
    console.error('Error during restore:', error)

    throw error
  }
}
