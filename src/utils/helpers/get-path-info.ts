import { SideMenuItem } from '@/types/types'
import { SECTION_NAMES, SIDE_MENU_ITEMS } from '../constants/sidebar-constants'

type SECTION_PROPERTIES = SideMenuItem

export default function getSectionInfo({
  sectionName,
  property,
}: {
  sectionName: SECTION_NAMES
  property: keyof SECTION_PROPERTIES // Indica que la propiedad puede ser cualquier clave de SideMenuItem
}) {
  function findItem(item: SideMenuItem): SideMenuItem | undefined {
    if (item.identifier === sectionName) {
      return item
    }

    if (item.submenu && item.submenuItems) {
      const foundItem = item.submenuItems.find((subItem) => {
        return subItem.identifier === sectionName
      })

      if (foundItem) {
        return foundItem
      }

      return undefined
    }

    return undefined
  }
  let sectionData
  SIDE_MENU_ITEMS.forEach((item) => {
    const foundItem = findItem(item)

    if (foundItem) {
      sectionData = foundItem
    }
  })

  return sectionData ? sectionData[property] : undefined
}
