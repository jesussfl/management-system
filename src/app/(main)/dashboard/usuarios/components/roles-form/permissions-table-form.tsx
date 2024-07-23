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
  LucideShieldBan,
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
  isOnlyView?: boolean
}
export const PermissionsTable = ({
  group,
  onCheckedChange,
  isOnlyView = false,
}: PermissionsTableProps) => {
  const form = useFormContext()
  const permisos = form.watch('permisos')
  return (
    <div className="mb-8">
      <p className="text-md text-foreground mb-4">{`${group}`}</p>
      <Table className="min-w-full ">
        <TableHeader className="bg-gray-50 w-full divide-gray-200">
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
        <TableBody className="bg-white divide-gray-200">
          {groupedSections[group].map((section) => (
            <TableRow key={section.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {section.titulo}
              </TableCell>
              <TableCell className=" py-4 whitespace-nowrap text-center">
                {section.permisos.includes('CREAR') && (
                  <Checkbox
                    disabled={isOnlyView}
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
                    disabled={isOnlyView}
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
                    disabled={isOnlyView}
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
    </div>
  )
}
interface PermissionsListProps {
  onCheckedChange: (key: string, value: boolean) => void
  isOnlyView?: boolean
}
export const PermissionsList = ({
  onCheckedChange,
  isOnlyView = false,
}: PermissionsListProps) => {
  const form = useFormContext()
  const permisos = form.watch('permisos')
  return (
    <div className="mb-36">
      {Object.keys(groupedSections).map((group) =>
        group === 'Especiales' ? (
          <div key={group} className="mb-8">
            <p className="text-sm text-foreground">Permisos Adicionales</p>
            <div className="border-b border-base-300 mb-4" />
            {groupedSections[group].map((section) => (
              <div key={section.id} className="mb-4">
                <h3 className="text-sm font-semibold">{section.titulo}</h3>
                <div className="flex flex-wrap gap-4">
                  {section.permisos.includes('CREAR') && (
                    <PermissionToggle
                      isOnlyView={isOnlyView}
                      icon={<FilePlus className="w-5 h-5" />}
                      title="Crear"
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

                  {section.permisos.includes('ELIMINAR') && (
                    <PermissionToggle
                      icon={<FileMinus className="w-5 h-5" />}
                      title="Eliminar"
                      checked={permisos?.includes(
                        `${section.nombreSeccion}:ELIMINAR`
                      )}
                      onCheckedChange={(value) =>
                        onCheckedChange(
                          `${section.nombreSeccion}:ELIMINAR`,
                          value as boolean
                        )
                      }
                      isOnlyView={isOnlyView}
                    />
                  )}
                  {section.permisos.includes('ACTUALIZAR') && (
                    <PermissionToggle
                      icon={<FileEdit className="w-5 h-5" />}
                      title="Actualizar"
                      checked={permisos?.includes(
                        `${section.nombreSeccion}:ACTUALIZAR`
                      )}
                      onCheckedChange={(value) =>
                        onCheckedChange(
                          `${section.nombreSeccion}:ACTUALIZAR`,
                          value as boolean
                        )
                      }
                      isOnlyView={isOnlyView}
                    />
                  )}
                  {section.permisos.includes('AUDITAR') && (
                    <PermissionToggle
                      icon={<FileSearch2 className="w-5 h-5" />}
                      title="Auditar"
                      checked={permisos?.includes(
                        `${section.nombreSeccion}:AUDITAR`
                      )}
                      onCheckedChange={(value) =>
                        onCheckedChange(
                          `${section.nombreSeccion}:AUDITAR`,
                          value as boolean
                        )
                      }
                    />
                  )}
                  {section.permisos.includes('RESTAURAR') && (
                    <PermissionToggle
                      icon={<DatabaseBackup className="w-5 h-5" />}
                      title="Restaurar"
                      checked={permisos?.includes(
                        `${section.nombreSeccion}:RESTAURAR`
                      )}
                      onCheckedChange={(value) =>
                        onCheckedChange(
                          `${section.nombreSeccion}:RESTAURAR`,
                          value as boolean
                        )
                      }
                      isOnlyView={isOnlyView}
                    />
                  )}
                  {section.permisos.includes('VISUALIZAR') && (
                    <PermissionToggle
                      icon={<EyeIcon className="w-5 h-5" />}
                      title="Visualizar"
                      checked={permisos?.includes(
                        `${section.nombreSeccion}:VISUALIZAR`
                      )}
                      onCheckedChange={(value) =>
                        onCheckedChange(
                          `${section.nombreSeccion}:VISUALIZAR`,
                          value as boolean
                        )
                      }
                      isOnlyView={isOnlyView}
                    />
                  )}
                </div>
              </div>
            ))}
            <PermissionToggle
              className="max-w-full"
              isOnlyView={isOnlyView}
              icon={<LucideShieldBan className="w-5 h-5" />}
              title="Superusuario"
              description="Al activar esta función, el usuario podrá tener todos los permisos."
              checked={permisos?.includes(`TODAS:FULL`)}
              onCheckedChange={(value) =>
                onCheckedChange(`TODAS:FULL`, value as boolean)
              }
            />
          </div>
        ) : (
          <div key={group} className="mb-8">
            <PermissionsTable group={group} onCheckedChange={onCheckedChange} />
          </div>
        )
      )}
    </div>
  )
}
