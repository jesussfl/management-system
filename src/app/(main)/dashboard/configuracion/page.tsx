import { PackagePlus } from 'lucide-react'
import { Metadata } from 'next'

import {
  HeaderLeftSide,
  HeaderRightSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import BackupButton from '@/modules/maintenance/components/backup'
import { Upload } from './upload'
import { DataTable } from '@/modules/common/components/table/data-table'
import { imageColumns } from './columns'
import { getAllImages } from '.'

export const metadata: Metadata = {
  title: 'Configuraciones',
  description: 'Desde aquí puedes gestionar la configuración de tu sistema',
}

export default async function Page() {
  // const images = await getAllImages()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <PackagePlus size={24} />
            Configuración
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona la configuración de tu sistema
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide></HeaderRightSide>
      </PageHeader>

      <PageContent>
        <BackupButton />
        {/* <Upload /> */}
        {/* <DataTable columns={imageColumns} data={images} /> */}
      </PageContent>
    </>
  )
}
