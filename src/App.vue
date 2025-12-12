<script setup>
import ToastContainer from '@/components/common/ToastContainer.vue'
</script>

<template>
  <div id="app">
    <nav class="bg-primary text-white p-4">
      <ul class="flex gap-4">
        <li><router-link to="/" class="hover:underline">Dashboard</router-link></li>
        <li><router-link to="/cargar-telegrama" class="hover:underline">Cargar Telegrama</router-link></li>
        <li><router-link to="/resultados/provincial" class="hover:underline">Resultados Provinciales</router-link></li>
        <li><router-link to="/resultados/nacional" class="hover:underline">Resultados Nacionales</router-link></li>
        <li><router-link to="/configuracion" class="hover:underline">Configuración</router-link></li>
      </ul>
    </nav>
    <router-view />
    <ToastContainer />
  </div>
</template>
