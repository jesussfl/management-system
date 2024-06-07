import { columns } from './columns'
import { DataTable } from '@/modules/common/components/table/data-table'

import { Metadata } from 'next'

import {
  PageContent,
  PageHeaderDescription,
} from '@/modules/layout/templates/page'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/modules/common/components/tabs/tabs'

import {
  HeaderLeftSide,
  HeaderRightSide,
  PageHeader,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/card/card'
import { Bomb, Boxes, PackageMinus, PackagePlus, Plus } from 'lucide-react'
import { buttonVariants } from '@/modules/common/components/button'
import Link from 'next/link'

import { getAllGuns } from './lib/actions/guns'
import { getAllGunTypes } from './lib/actions/type'
import { getAllGunModels } from './lib/actions/model-actions'
import { getAllGunBrands } from './lib/actions/brand'
import { getAllGunParts } from './lib/actions/parts'
import { getAllAccesories } from './lib/actions/accesories'
import { getAllGunComponents } from './lib/actions/component-actions'
import { gunModelColumns } from './components/columns/gun-model-columns'
import { gunTypeColumns } from './components/columns/gun-type-columns'
import { gunBrandColumns } from './components/columns/gun-brand-columns'
import { gunCaliberColumns } from './components/columns/gun-caliber-columns'
import { gunPartColumns } from './components/columns/gun-part-columns'
import { gunAccessoryColumns } from './components/columns/gun-accessory-columns'
import { getAllGunCalibers } from './lib/actions/calibre'
import StatisticCard from '@/modules/common/components/statistic-card'

export const metadata: Metadata = {
  title: 'Armas',
  description: 'Desde aquí puedes ver todas las armas',
}

export default async function Page() {
  const guns = await getAllGuns()
  const gunModels = await getAllGunModels()
  const gunBrands = await getAllGunBrands()
  const gunParts = await getAllGunParts()
  const gunAccessories = await getAllAccesories()
  const gunCalibers = await getAllGunCalibers()
  const gunTypes = await getAllGunTypes()
  return (
    <>
      <PageHeader>
        <HeaderLeftSide>
          <PageHeaderTitle>
            <Bomb size={24} />
            Armas
          </PageHeaderTitle>
          <PageHeaderDescription>
            Gestiona todas las armas del servicio de armamento
          </PageHeaderDescription>
        </HeaderLeftSide>
        <HeaderRightSide>
          <Link
            href="/dashboard/armamento/armas/agregar"
            className={buttonVariants({ variant: 'default' })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Arma
          </Link>
        </HeaderRightSide>
      </PageHeader>
      <Tabs defaultValue="guns">
        <TabsList className="mx-5">
          <TabsTrigger value="guns">Armas</TabsTrigger>
          <TabsTrigger value="models">Modelos y Tipos</TabsTrigger>
          <TabsTrigger value="components">Marcas y Calibres</TabsTrigger>
          <TabsTrigger value="parts">Partes y Accesorios</TabsTrigger>
        </TabsList>
        <TabsContent value="guns">
          <PageContent>
            <Card>
              <CardHeader className="flex flex-row items-center gap-8 ">
                <StatisticCard
                  className="flex-1 h-[116px]"
                  title="Armas Totales"
                  number={guns.length}
                  Icon={<Bomb size={24} />}
                />
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={guns} />
              </CardContent>
            </Card>
          </PageContent>
        </TabsContent>
        <TabsContent value="models">
          <PageContent>
            <div className="flex w-full gap-8">
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">Lista de Modelos</CardTitle>
                  <Link
                    href="/dashboard/armamento/armas/modelo"
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Modelo
                  </Link>
                </CardHeader>
                <CardContent>
                  <DataTable columns={gunModelColumns} data={gunModels} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">
                    Lista de Tipos de Armas
                  </CardTitle>
                  <Link
                    href="/dashboard/armamento/armas/tipo"
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Tipo
                  </Link>
                </CardHeader>
                <CardContent>
                  <DataTable columns={gunTypeColumns} data={gunTypes} />
                </CardContent>
              </Card>
            </div>
          </PageContent>
        </TabsContent>
        <TabsContent value="components">
          <PageContent>
            <div className="flex w-full gap-8">
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">Lista de Marcas</CardTitle>
                  <Link
                    href="/dashboard/armamento/armas/marca"
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Marca
                  </Link>
                </CardHeader>
                <CardContent>
                  <DataTable columns={gunBrandColumns} data={gunBrands} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">Lista de Calibres</CardTitle>
                  <Link
                    href="/dashboard/armamento/armas/calibre"
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Calibre
                  </Link>
                </CardHeader>
                <CardContent>
                  <DataTable columns={gunCaliberColumns} data={gunCalibers} />
                </CardContent>
              </Card>
            </div>
          </PageContent>
        </TabsContent>

        <TabsContent value="parts">
          <PageContent>
            <div className="flex w-full gap-8">
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">Lista de Partes</CardTitle>
                  <Link
                    href="/dashboard/armamento/armas/parte"
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Parte
                  </Link>
                </CardHeader>
                <CardContent>
                  <DataTable columns={gunPartColumns} data={gunParts} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xl">Lista de Accesorios</CardTitle>
                  <Link
                    href="/dashboard/armamento/armas/accesorio"
                    className={buttonVariants({ variant: 'secondary' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Accesorio
                  </Link>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={gunAccessoryColumns}
                    data={gunAccessories}
                  />
                </CardContent>
              </Card>
            </div>
          </PageContent>
        </TabsContent>
      </Tabs>
    </>
  )
}
