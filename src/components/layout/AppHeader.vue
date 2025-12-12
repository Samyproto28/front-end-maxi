<template>
  <header class="sticky top-0 bg-primary text-white shadow-md z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Título -->
        <div class="flex-shrink-0 flex items-center">
          <h1 class="text-xl font-bold text-white">
            Sistema de Comicios Argentina 2025
          </h1>
        </div>

        <!-- Navegación principal (desktop) -->
        <nav class="hidden md:flex space-x-4" aria-label="Navegación principal">
          <RouterLink
            to="/"
            class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            active-class="bg-primary-dark"
            exact-active-class="underline decoration-2"
          >
            Dashboard
          </RouterLink>
          <RouterLink
            to="/cargar-telegrama"
            class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            active-class="bg-primary-dark"
            exact-active-class="underline decoration-2"
          >
            Cargar Telegrama
          </RouterLink>
          <RouterLink
            to="/resultados/provincial"
            class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            active-class="bg-primary-dark"
            exact-active-class="underline decoration-2"
          >
            Resultados Provincial
          </RouterLink>
          <RouterLink
            to="/resultados/nacional"
            class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            active-class="bg-primary-dark"
            exact-active-class="underline decoration-2"
          >
            Resultados Nacional
          </RouterLink>
          <RouterLink
            to="/configuracion"
            class="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-dark transition-colors"
            active-class="bg-primary-dark"
            exact-active-class="underline decoration-2"
          >
            Configuración
          </RouterLink>
        </nav>

        <!-- Menú de usuario -->
        <div class="flex items-center">
          <!-- Desktop: Menu dropdown -->
          <Menu as="div" class="relative hidden md:block">
            <MenuButton class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary transition-colors">
              <span>{{ userName }}</span>
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
              <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div class="p-1">
                  <MenuItem v-slot="{ active }">
                    <RouterLink
                      to="/configuracion"
                      :class="[
                        active ? 'bg-blue-500 text-white' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2'
                      ]"
                    >
                      <Cog6ToothIcon class="h-5 w-5" />
                      Configuración
                    </RouterLink>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <!-- Mobile: Hamburger menu button -->
          <Disclosure v-slot="{ open }" as="div" class="md:hidden">
            <DisclosureButton class="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary transition-colors">
              <span class="sr-only">Abrir menú principal</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>

            <DisclosurePanel class="mt-2 space-y-1 pb-3">
              <RouterLink
                to="/"
                class="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-dark"
                active-class="bg-primary-dark"
                exact-active-class="underline decoration-2"
                @click="closeMenu"
              >
                Dashboard
              </RouterLink>
              <RouterLink
                to="/cargar-telegrama"
                class="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-dark"
                active-class="bg-primary-dark"
                exact-active-class="underline decoration-2"
                @click="closeMenu"
              >
                Cargar Telegrama
              </RouterLink>
              <RouterLink
                to="/resultados/provincial"
                class="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-dark"
                active-class="bg-primary-dark"
                exact-active-class="underline decoration-2"
                @click="closeMenu"
              >
                Resultados Provincial
              </RouterLink>
              <RouterLink
                to="/resultados/nacional"
                class="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-dark"
                active-class="bg-primary-dark"
                exact-active-class="underline decoration-2"
                @click="closeMenu"
              >
                Resultados Nacional
              </RouterLink>
              <RouterLink
                to="/configuracion"
                class="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-dark"
                active-class="bg-primary-dark"
                exact-active-class="underline decoration-2"
                @click="closeMenu"
              >
                Configuración
              </RouterLink>

              <!-- User menu item in mobile -->
              <div class="pt-3 mt-3 border-t border-primary-dark">
                <RouterLink
                  to="/configuracion"
                  class="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-dark"
                  @click="closeMenu"
                >
                  <div class="flex items-center gap-2">
                    <Cog6ToothIcon class="h-5 w-5" />
                    Configuración
                  </div>
                </RouterLink>
              </div>
            </DisclosurePanel>
          </Disclosure>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// HeadlessUI Components
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from '@headlessui/vue'

// Icons
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

// Router
import { RouterLink } from 'vue-router'

// User name state (could be connected to a store later)
const userName = ref('Usuario Admin')

// Function to close menu on mobile (can be used for other actions)
const closeMenu = () => {
  // This will be automatically handled by RouterLink navigation
  // but we can add additional logic here if needed
}
</script>
