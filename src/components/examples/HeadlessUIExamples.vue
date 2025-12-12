<template>
  <div class="p-8 max-w-4xl mx-auto space-y-12">
    <h1 class="text-2xl font-bold text-gray-800">HeadlessUI + Heroicons Examples</h1>

    <!-- Dialog Example -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-700">Dialog (Modal)</h2>
      <p class="text-gray-600 text-sm">Componente de diálogo accesible con navegación por teclado (Escape para cerrar)</p>

      <button
        @click="isDialogOpen = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <InformationCircleIcon class="h-5 w-5" />
        Abrir Dialog
      </button>

      <TransitionRoot appear :show="isDialogOpen" as="template">
        <Dialog as="div" @close="isDialogOpen = false" class="relative z-50">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                  <DialogTitle class="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <CheckCircleIcon class="h-6 w-6 text-green-500" />
                    Operación Exitosa
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Este es un ejemplo de Dialog con HeadlessUI. Tiene accesibilidad ARIA automática y se puede cerrar con Escape.
                    </p>
                  </div>
                  <div class="mt-4">
                    <button
                      @click="isDialogOpen = false"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Entendido
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </section>

    <!-- Listbox Example -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-700">Listbox (Select)</h2>
      <p class="text-gray-600 text-sm">Selector accesible con navegación por flechas y búsqueda por teclas</p>

      <Listbox v-model="selectedPerson">
        <div class="relative mt-1 w-72">
          <ListboxButton class="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span class="flex items-center gap-2">
              <UserIcon class="h-5 w-5 text-gray-400" />
              {{ selectedPerson.name }}
            </span>
            <span class="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon class="h-5 w-5 text-gray-400" />
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <ListboxOption
                v-for="person in people"
                :key="person.id"
                :value="person"
                v-slot="{ active, selected }"
              >
                <li
                  :class="[
                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900',
                    'relative cursor-pointer select-none py-2 pl-10 pr-4'
                  ]"
                >
                  <span :class="[selected ? 'font-medium' : 'font-normal']">
                    {{ person.name }}
                  </span>
                  <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                    <CheckIcon class="h-5 w-5" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
    </section>

    <!-- Switch Example -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-700">Switch (Toggle)</h2>
      <p class="text-gray-600 text-sm">Toggle accesible con soporte para Space/Enter y lectores de pantalla</p>

      <div class="flex items-center gap-4">
        <Switch
          v-model="enabled"
          :class="enabled ? 'bg-blue-600' : 'bg-gray-200'"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span class="sr-only">Activar notificaciones</span>
          <span
            :class="enabled ? 'translate-x-6' : 'translate-x-1'"
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          />
        </Switch>
        <span class="text-gray-700 flex items-center gap-2">
          <BellIcon class="h-5 w-5" :class="enabled ? 'text-blue-600' : 'text-gray-400'" />
          Notificaciones {{ enabled ? 'activadas' : 'desactivadas' }}
        </span>
      </div>
    </section>

    <!-- Menu Example -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-700">Menu (Dropdown)</h2>
      <p class="text-gray-600 text-sm">Menú desplegable con navegación por flechas y Enter para seleccionar</p>

      <Menu as="div" class="relative inline-block text-left">
        <MenuButton class="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Cog6ToothIcon class="h-5 w-5" />
          Opciones
          <ChevronDownIcon class="h-4 w-4" />
        </MenuButton>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <MenuItems class="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div class="p-1">
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-blue-500 text-white' : 'text-gray-900',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2'
                  ]"
                >
                  <PencilIcon class="h-5 w-5" />
                  Editar
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-blue-500 text-white' : 'text-gray-900',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2'
                  ]"
                >
                  <EyeIcon class="h-5 w-5" />
                  Ver detalles
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-red-500 text-white' : 'text-red-600',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2'
                  ]"
                >
                  <TrashIcon class="h-5 w-5" />
                  Eliminar
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </section>

    <!-- Icons Showcase -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-700">Heroicons Showcase</h2>
      <p class="text-gray-600 text-sm">Ejemplos de iconos Solid y Outline desde el composable useIcons</p>

      <div class="grid grid-cols-2 gap-8">
        <div>
          <h3 class="font-medium text-gray-800 mb-3">Solid Icons</h3>
          <div class="flex flex-wrap gap-3">
            <component
              v-for="(icon, name) in solidIconsPreview"
              :key="name"
              :is="icon"
              class="h-6 w-6 text-blue-600"
              :title="name"
            />
          </div>
        </div>
        <div>
          <h3 class="font-medium text-gray-800 mb-3">Outline Icons</h3>
          <div class="flex flex-wrap gap-3">
            <component
              v-for="(icon, name) in outlineIconsPreview"
              :key="name"
              :is="icon"
              class="h-6 w-6 text-gray-600"
              :title="name"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
/**
 * Componente de ejemplos que demuestra el uso de HeadlessUI con TailwindCSS
 * y la integración con Heroicons a través del composable useIcons
 *
 * Componentes demostrados:
 * - Dialog: Modal accesible con Transition
 * - Listbox: Select/dropdown accesible
 * - Switch: Toggle accesible
 * - Menu: Dropdown menu accesible
 *
 * Todas las interacciones son completamente accesibles con:
 * - Navegación por teclado (Tab, Enter, Escape, flechas)
 * - Atributos ARIA automáticos
 * - Focus management
 */
import { ref, computed } from 'vue'

// HeadlessUI Components
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Switch,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/vue'

// Icons from composable
import { useIcons } from '@/composables/useIcons'

// Direct icon imports for template usage
import {
  CheckIcon,
  ChevronDownIcon,
  UserIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  BellIcon,
  Cog6ToothIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/vue/24/solid'

// Get icons from composable
const { solid, outline } = useIcons()

// Reactive state for examples
const isDialogOpen = ref(false)
const enabled = ref(false)

// Listbox data
const people = [
  { id: 1, name: 'Juan García' },
  { id: 2, name: 'María López' },
  { id: 3, name: 'Carlos Rodríguez' },
  { id: 4, name: 'Ana Martínez' },
  { id: 5, name: 'Pedro Sánchez' }
]
const selectedPerson = ref(people[0])

// Icons preview (subset for showcase)
const solidIconsPreview = computed(() => ({
  Check: solid.Check,
  XMark: solid.XMark,
  Plus: solid.Plus,
  Trash: solid.Trash,
  User: solid.User,
  Home: solid.Home,
  Bell: solid.Bell,
  Cog: solid.Cog6Tooth
}))

const outlineIconsPreview = computed(() => ({
  Check: outline.Check,
  XMark: outline.XMark,
  Plus: outline.Plus,
  Trash: outline.Trash,
  User: outline.User,
  Home: outline.Home,
  Bell: outline.Bell,
  Cog: outline.Cog6Tooth
}))
</script>
