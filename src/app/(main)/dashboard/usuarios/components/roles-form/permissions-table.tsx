import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/common/components/table/table'
import { Section, SECTION_NAMES_FOR_ROLES } from './section-names'
import { useFormContext } from 'react-hook-form'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
import { PermissionToggle } from './permissions-toggle-form'
import {
  DatabaseBackup,
  EyeIcon,
  FileEdit,
  FileMinus,
  FilePlus,
  FileSearch2,
} from 'lucide-react'
interface GroupedSections {
  [key: string]: Section[]
}

const groupSections = (sections: Section[]): GroupedSections => {
  const grouped: GroupedSections = {
    Abastecimiento: [],
    Armamento: [],
    Otros: [],
    Especiales: [],
  }

  sections.forEach((section) => {
    if (section.nombreSeccion.includes('ABASTECIMIENTO')) {
      grouped.Abastecimiento.push(section)
    } else if (section.nombreSeccion.includes('ARMAMENTO')) {
      grouped.Armamento.push(section)
    } else if (
      ['USUARIOS', 'AUDITORIA', 'RESPALDO', 'ASISTENCIAS'].includes(
        section.nombreSeccion
      )
    ) {
      grouped.Especiales.push(section)
    } else {
      grouped.Otros.push(section)
    }
  })

  return grouped
}

const groupedSections = groupSections(SECTION_NAMES_FOR_ROLES)

interface PermissionsTableProps {
  group: string
  onCheckedChange: (key: string, value: boolean) => void
}
export const PermissionsTable = ({
  group,
  onCheckedChange,
}: PermissionsTableProps) => {
  const form = useFormContext()
  const permisos = form.watch('permisos')
  return (
    <>
      <p className="text-sm text-foreground">{group}</p>
      <div className="border-b border-base-300 mb-4" />
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50 w-full">
          <TableRow>
            <TableHead className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sección
            </TableHead>
            <TableHead className=" py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Crear
            </TableHead>
            <TableHead className=" py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Eliminar
            </TableHead>
            <TableHead className=" py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actualizar
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {groupedSections[group].map((section) => (
            <TableRow key={section.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {section.titulo}
              </TableCell>
              <TableCell className=" py-4 whitespace-nowrap text-center">
                {section.permisos.includes('CREAR') && (
                  <Checkbox
                    checked={permisos?.includes(
                      `${section.nombreSeccion}:CREAR`
                    )}
                    onCheckedChange={(value) =>
                      onCheckedChange(
                        `${section.nombreSeccion}:CREAR`,
                        value as boolean
                      )
                    }
                  />
                )}
              </TableCell>

              <TableCell className=" py-4 whitespace-nowrap text-center">
                {section.permisos.includes('ELIMINAR') && (
                  <Checkbox
                    checked={permisos?.includes(
                      `${section.nombreSeccion}:ELIMINAR`
                    )}
                    onCheckedChange={(value) =>
                      onCheckedChange(
                        `${section.nombreSeccion}:ELIMINAR`,
                        value as boolean
                      )
                    }
                  />
                )}
              </TableCell>
              <TableCell className=" py-4 whitespace-nowrap text-center">
                {section.permisos.includes('ACTUALIZAR') && (
                  <Checkbox
                    checked={permisos?.includes(
                      `${section.nombreSeccion}:ACTUALIZAR`
                    )}
                    onCheckedChange={(value) =>
                      onCheckedChange(
                        `${section.nombreSeccion}:ACTUALIZAR`,
                        value as boolean
                      )
                    }
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
interface PermissionsListProps {
  onCheckedChange: (key: string, value: boolean) => void
}
