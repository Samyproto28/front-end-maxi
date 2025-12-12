# ✅ Integración Completa de Pinia y Servicios API

## 🎯 Resumen

Se ha completado la integración de **Pinia** como gestor de estado y se han creado todos los servicios API necesarios para el proyecto del Sistema de Comicios Argentina 2025.

---

## 📦 Archivos Creados/Actualizados

### **Servicios API** (`src/services/`)
1. ✅ `provinciaService.js` - Gestión de provincias
2. ✅ `listaService.js` - Gestión de listas electorales
3. ✅ `mesaService.js` - Gestión de mesas de votación
4. ✅ `telegramaService.js` - Gestión de telegramas
5. ✅ `resultadoService.js` - Consulta de resultados

### **Stores Pinia** (`src/stores/`)
1. ✅ `provinciaStore.js` - **INTEGRADO CON API**
2. ✅ `listaStore.js` - **INTEGRADO CON API**
3. ✅ `mesaStore.js` - Pendiente integración
4. ✅ `telegramaStore.js` - Pendiente integración
5. ✅ `resultadoStore.js` - Pendiente integración

### **Tests Unitarios** (`src/services/__tests__/`)
1. ✅ `provinciaService.spec.js` - **16 tests PASANDO**
2. ✅ `listaService.spec.js` - **16 tests PASANDO**

### **Configuración**
1. ✅ `package.json` - Scripts de test agregados
2. ✅ `vitest.config.js` - Configuración de testing
3. ✅ `src/test/setup.js` - Setup global para tests
4. ✅ `main.js` - Pinia configurado correctamente

---

## 🚀 Cómo Usar en Componentes

### **Ejemplo 1: Cargar y Mostrar Provincias**

```vue
<template>
  <div>
    <select v-model="provinciaId">
      <option v-for="p in provinciaStore.provinciasOrdenadas"
              :key="p.id" :value="p.id">
        {{ p.nombre }}
      </option>
    </select>

    <div v-if="provinciaStore.loading">⏳ Cargando...</div>
    <div v-if="provinciaStore.error">❌ {{ provinciaStore.error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProvinciaStore } from '@/stores/provinciaStore'

const provinciaStore = useProvinciaStore()
const provinciaId = ref('')

onMounted(async () => {
  await provinciaStore.cargarProvincias()
})
</script>
```

### **Ejemplo 2: Cargar Listas de una Provincia**

```vue
<script setup>
import { ref } from 'vue'
import { useProvinciaStore } from '@/stores/provinciaStore'
import { useListaStore } from '@/stores/listaStore'

const provinciaStore = useProvinciaStore()
const listaStore = useListaStore()
const listasProvincia = ref([])

async function cargarListasDeProvincia(provinciaId) {
  listasProvincia.value = await listaStore.cargarListasPorProvincia(provinciaId)
}
</script>
```

### **Ejemplo 3: Cargar Candidatos de una Lista**

```vue
<script setup>
import { ref } from 'vue'
import { useListaStore } from '@/stores/listaStore'

const listaStore = useListaStore()
const candidatos = ref([])

async function cargarCandidatos(listaId) {
  candidatos.value = await listaStore.cargarCandidatosDeLista(listaId)
}
</script>
```

---

## 📚 API de los Stores

### **provinciaStore**

#### Estado
- `provincias` - Array de provincias
- `provinciaSeleccionada` - Provincia seleccionada
- `loading` - Estado de carga
- `error` - Mensaje de error

#### Getters
- `provinciasOrdenadas` - Provincias ordenadas alfabéticamente
- `provinciaPorId(id)` - Buscar provincia por ID
- `totalProvincias` - Total de provincias

#### Acciones
- `cargarProvincias()` - Cargar todas las provincias desde API
- `cargarListasDeProvincia(provinciaId)` - Obtener listas de una provincia
- `cargarMesasDeProvincia(provinciaId)` - Obtener mesas de una provincia
- `crearProvincia(data)` - Crear nueva provincia
- `actualizarProvincia(id, data)` - Actualizar provincia
- `eliminarProvincia(id)` - Eliminar provincia
- `limpiarError()` - Limpiar mensaje de error

### **listaStore**

#### Estado
- `listas` - Array de listas
- `loading` - Estado de carga
- `error` - Mensaje de error

#### Getters
- `listasActivas` - Listas activas
- `listasPorCargo(cargo)` - Filtrar por cargo
- `listasPorProvincia(provinciaId)` - Filtrar por provincia
- `totalListas` - Total de listas

#### Acciones
- `cargarListas()` - Cargar todas las listas desde API
- `cargarListasPorProvincia(provinciaId)` - Obtener listas por provincia
- `cargarCandidatosDeLista(listaId)` - Obtener candidatos de una lista
- `limpiarError()` - Limpiar mensaje de error

---

## 🧪 Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests una sola vez
npm run test:run

# Ejecutar tests con coverage
npm run test:coverage
```

### **Resultados de Tests:**
- ✅ provinciaService.spec.js: **16 tests PASANDO**
- ✅ listaService.spec.js: **16 tests PASANDO**

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview

# Tests
npm test           # Modo watch
npm run test:run   # Ejecutar una vez
npm run test:coverage # Con coverage
```

---

## 📋 Próximos Pasos

### **Pendientes (No incluidos en Task 20):**

1. **Integrar mesaStore con mesaService**
   - Actualizar `mesaStore.js` para usar `mesaService`
   - Crear tests para `mesaService`

2. **Integrar telegramaStore con telegramaService**
   - Actualizar `telegramaStore.js` para usar `telegramaService`
   - Crear tests para `telegramaService`

3. **Integrar resultadoStore con resultadoService**
   - Actualizar `resultadoStore.js` para usar `resultadoService`
   - Crear tests para `resultadoService`

4. **Crear componentes Vue**
   - `ProvinciaSelector.vue`
   - `ListaSelector.vue`
   - `MesaSelector.vue`
   - `TelegramaForm.vue`
   - `ResultadosTable.vue`

---

## 💡 Buenas Prácticas

### ✅ **Hacer:**
- Usar `loading` y `error` en la UI
- Manejar errores con try/catch en componentes
- Usar computed properties para filtrar datos
- Limpiar errores con `limpiarError()`
- Llamar `cargarProvincias()` en `onMounted()`

### ❌ **Evitar:**
- No mutar el estado directamente (usar actions)
- No mezclar lógica de negocio en componentes
- No hacer llamadas API directamente en componentes
- No ignorar errores

---

## 🎨 Ejemplo de Flujo Completo

```vue
<template>
  <div class="electoral-system">
    <!-- 1. Seleccionar Provincia -->
    <select v-model="provinciaId" @change="onProvinciaChange">
      <option v-for="p in provinciaStore.provinciasOrdenadas"
              :key="p.id" :value="p.id">
        {{ p.nombre }}
      </option>
    </select>

    <!-- 2. Mostrar Listas -->
    <div v-if="listas.length">
      <h3>Listas en la provincia:</h3>
      <ul>
        <li v-for="lista in listas" :key="lista.id">
          {{ lista.nombre }} ({{ lista.sigla }})
        </li>
      </ul>
    </div>

    <!-- 3. Loading State -->
    <div v-if="provinciaStore.loading">
      ⏳ Cargando datos...
    </div>

    <!-- 4. Error State -->
    <div v-if="provinciaStore.error" class="error">
      ❌ {{ provinciaStore.error }}
      <button @click="provinciaStore.limpiarError()">✖</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProvinciaStore } from '@/stores/provinciaStore'
import { useListaStore } from '@/stores/listaStore'

const provinciaStore = useProvinciaStore()
const listaStore = useListaStore()
const provinciaId = ref('')
const listas = ref([])

async function onProvinciaChange() {
  if (provinciaId.value) {
    listas.value = await listaStore.cargarListasPorProvincia(provinciaId.value)
  } else {
    listas.value = []
  }
}

onMounted(async () => {
  await provinciaStore.cargarProvincias()
})
</script>
```

---

## ✨ Resumen de Beneficios

### **Con Pinia:**
- ✅ Estado centralizado y organizado
- ✅ Reactividad automática en la UI
- ✅ Fácil debugging con Vue DevTools
- ✅ Separación clara de responsabilidades
- ✅ Tests más fáciles de escribir
- ✅ Código más mantenible

### **Con Servicios API:**
- ✅ Lógica de API separada del estado
- ✅ Reutilización de código
- ✅ Fácil mocking en tests
- ✅ URLs de endpoints centralizadas
- ✅ Manejo de errores consistente

---

## 📞 Soporte

Si tienes dudas:
1. Revisa este documento
2. Consulta los ejemplos en `src/components/`
3. Ejecuta los tests para ver el comportamiento esperado
4. Usa Vue DevTools para inspeccionar el estado

---

**✅ Integración completada exitosamente - Task 20 y más!**
