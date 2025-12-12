/**
 * Composable para centralizar los imports de iconos más frecuentes de Heroicons
 * Facilita la reutilización y organización de iconos en la aplicación
 */

// Iconos Solid (24x24) - Para elementos interactivos y énfasis
import {
  CheckIcon as CheckIconSolid,
  XMarkIcon as XMarkIconSolid,
  ChevronDownIcon as ChevronDownIconSolid,
  ChevronUpIcon as ChevronUpIconSolid,
  ChevronLeftIcon as ChevronLeftIconSolid,
  ChevronRightIcon as ChevronRightIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  UserIcon as UserIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  ArrowPathIcon as ArrowPathIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
  InformationCircleIcon as InformationCircleIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  XCircleIcon as XCircleIconSolid,
  PlusIcon as PlusIconSolid,
  MinusIcon as MinusIconSolid,
  TrashIcon as TrashIconSolid,
  PencilIcon as PencilIconSolid,
  EyeIcon as EyeIconSolid,
  EyeSlashIcon as EyeSlashIconSolid,
  HomeIcon as HomeIconSolid,
  ArrowRightOnRectangleIcon as ArrowRightOnRectangleIconSolid,
  ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconSolid,
  Bars3Icon as Bars3IconSolid,
  BellIcon as BellIconSolid
} from '@heroicons/vue/24/solid'

// Iconos Outline (24x24) - Para navegación y elementos secundarios
import {
  CheckIcon as CheckIconOutline,
  XMarkIcon as XMarkIconOutline,
  ChevronDownIcon as ChevronDownIconOutline,
  ChevronUpIcon as ChevronUpIconOutline,
  ChevronLeftIcon as ChevronLeftIconOutline,
  ChevronRightIcon as ChevronRightIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
  UserIcon as UserIconOutline,
  Cog6ToothIcon as Cog6ToothIconOutline,
  ArrowPathIcon as ArrowPathIconOutline,
  ExclamationTriangleIcon as ExclamationTriangleIconOutline,
  ExclamationCircleIcon as ExclamationCircleIconOutline,
  InformationCircleIcon as InformationCircleIconOutline,
  CheckCircleIcon as CheckCircleIconOutline,
  XCircleIcon as XCircleIconOutline,
  PlusIcon as PlusIconOutline,
  MinusIcon as MinusIconOutline,
  TrashIcon as TrashIconOutline,
  PencilIcon as PencilIconOutline,
  EyeIcon as EyeIconOutline,
  EyeSlashIcon as EyeSlashIconOutline,
  HomeIcon as HomeIconOutline,
  ArrowRightOnRectangleIcon as ArrowRightOnRectangleIconOutline,
  ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleIconOutline,
  Bars3Icon as Bars3IconOutline,
  BellIcon as BellIconOutline
} from '@heroicons/vue/24/outline'

/**
 * Composable que retorna iconos organizados por tipo (solid/outline)
 * @returns {Object} Objeto con iconos solid y outline
 */
export function useIcons() {
  const solid = {
    Check: CheckIconSolid,
    XMark: XMarkIconSolid,
    ChevronDown: ChevronDownIconSolid,
    ChevronUp: ChevronUpIconSolid,
    ChevronLeft: ChevronLeftIconSolid,
    ChevronRight: ChevronRightIconSolid,
    MagnifyingGlass: MagnifyingGlassIconSolid,
    User: UserIconSolid,
    Cog6Tooth: Cog6ToothIconSolid,
    ArrowPath: ArrowPathIconSolid,
    ExclamationTriangle: ExclamationTriangleIconSolid,
    ExclamationCircle: ExclamationCircleIconSolid,
    InformationCircle: InformationCircleIconSolid,
    CheckCircle: CheckCircleIconSolid,
    XCircle: XCircleIconSolid,
    Plus: PlusIconSolid,
    Minus: MinusIconSolid,
    Trash: TrashIconSolid,
    Pencil: PencilIconSolid,
    Eye: EyeIconSolid,
    EyeSlash: EyeSlashIconSolid,
    Home: HomeIconSolid,
    ArrowRightOnRectangle: ArrowRightOnRectangleIconSolid,
    ArrowLeftOnRectangle: ArrowLeftOnRectangleIconSolid,
    Bars3: Bars3IconSolid,
    Bell: BellIconSolid
  }

  const outline = {
    Check: CheckIconOutline,
    XMark: XMarkIconOutline,
    ChevronDown: ChevronDownIconOutline,
    ChevronUp: ChevronUpIconOutline,
    ChevronLeft: ChevronLeftIconOutline,
    ChevronRight: ChevronRightIconOutline,
    MagnifyingGlass: MagnifyingGlassIconOutline,
    User: UserIconOutline,
    Cog6Tooth: Cog6ToothIconOutline,
    ArrowPath: ArrowPathIconOutline,
    ExclamationTriangle: ExclamationTriangleIconOutline,
    ExclamationCircle: ExclamationCircleIconOutline,
    InformationCircle: InformationCircleIconOutline,
    CheckCircle: CheckCircleIconOutline,
    XCircle: XCircleIconOutline,
    Plus: PlusIconOutline,
    Minus: MinusIconOutline,
    Trash: TrashIconOutline,
    Pencil: PencilIconOutline,
    Eye: EyeIconOutline,
    EyeSlash: EyeSlashIconOutline,
    Home: HomeIconOutline,
    ArrowRightOnRectangle: ArrowRightOnRectangleIconOutline,
    ArrowLeftOnRectangle: ArrowLeftOnRectangleIconOutline,
    Bars3: Bars3IconOutline,
    Bell: BellIconOutline
  }

  return {
    solid,
    outline
  }
}

// Exportaciones directas para imports más simples cuando se necesita un icono específico
export {
  // Solid
  CheckIconSolid,
  XMarkIconSolid,
  ChevronDownIconSolid,
  MagnifyingGlassIconSolid,
  UserIconSolid,
  Cog6ToothIconSolid,
  ArrowPathIconSolid,
  ExclamationTriangleIconSolid,
  CheckCircleIconSolid,
  XCircleIconSolid,
  PlusIconSolid,
  TrashIconSolid,
  PencilIconSolid,
  EyeIconSolid,
  EyeSlashIconSolid,
  HomeIconSolid,
  Bars3IconSolid,
  BellIconSolid,
  // Outline
  CheckIconOutline,
  XMarkIconOutline,
  ChevronDownIconOutline,
  MagnifyingGlassIconOutline,
  UserIconOutline,
  Cog6ToothIconOutline,
  ArrowPathIconOutline,
  ExclamationTriangleIconOutline,
  CheckCircleIconOutline,
  XCircleIconOutline,
  PlusIconOutline,
  TrashIconOutline,
  PencilIconOutline,
  EyeIconOutline,
  EyeSlashIconOutline,
  HomeIconOutline,
  Bars3IconOutline,
  BellIconOutline
}
