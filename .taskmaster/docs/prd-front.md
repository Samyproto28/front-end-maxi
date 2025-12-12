# PRD - Frontend Application
## Sistema de Carga y Conteo de Comicios Argentina 2025
### (Diputados y Senadores)

---

| Campo | Valor |
|-------|-------|
| **Versión del Documento** | 1.0 |
| **Fecha** | Diciembre 2025 |
| **Autores** | Ignacio González, Candela Ybañez Barrios, Silvina Torales, Samuel Angarita |
| **Estado** | En Desarrollo |
| **Stack Tecnológico** | Vue.js 3 + Vite + TailwindCSS + Axios |
| **Backend API** | Laravel 11 REST API (ver PRD Backend) |
| **Metodología** | Component-Based Development + Unit Testing |

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Análisis de Usuario](#2-análisis-de-usuario)
3. [Objetivos del Frontend](#3-objetivos-del-frontend)
4. [Arquitectura del Frontend](#4-arquitectura-del-frontend)
5. [Diseño de Interfaz (UI/UX)](#5-diseño-de-interfaz-uiux)
6. [Componentes del Sistema](#6-componentes-del-sistema)
7. [Integración con Backend API](#7-integración-con-backend-api)
8. [Gestión de Estado](#8-gestión-de-estado)
9. [Requerimientos Técnicos](#9-requerimientos-técnicos)
10. [Estrategia de Testing](#10-estrategia-de-testing)
11. [Plan de Implementación](#11-plan-de-implementación)
12. [Análisis de Riesgos](#12-análisis-de-riesgos)
13. [Dependencias](#13-dependencias)
14. [Métricas de Éxito](#14-métricas-de-éxito)
15. [Anexos](#15-anexos)

---

## 1. Resumen Ejecutivo

### 1.1 Visión General

Este documento define los requerimientos técnicos para el desarrollo del Frontend del Sistema de Carga y Conteo de Comicios Argentina 2025. La aplicación web proporcionará una interfaz intuitiva para que los operadores del centro de cómputos puedan cargar telegramas electorales, consultar resultados y exportar reportes, consumiendo la API REST del backend Laravel.

### 1.2 Impacto Técnico

- Aplicación SPA (Single Page Application) con Vue.js 3
- Interfaz responsive y accesible (3-5 pantallas máximo)
- Integración completa con API REST del backend
- Validaciones en tiempo real antes de enviar datos al servidor
- Visualización de resultados con tablas y estadísticas
- Exportación de reportes desde la interfaz

### 1.3 Valor de Negocio

El frontend proporcionará una experiencia de usuario fluida y eficiente que permitirá a los operadores del centro de cómputos realizar su trabajo con mayor rapidez y precisión. La interfaz clara reducirá errores de carga y facilitará la consulta de resultados en tiempo real.

### 1.4 Fecha Objetivo

Finalización estimada: 20 horas de desarrollo distribuidas en 4 semanas (en paralelo o posterior al backend).

---

## 2. Análisis de Usuario

### 2.1 Persona Principal: Operador Electoral

| Atributo | Descripción |
|----------|-------------|
| **Rol** | Operador del Centro de Cómputos |
| **Perfil** | Técnico/Administrativo con experiencia en carga de datos |
| **Objetivo** | Cargar telegramas rápidamente y sin errores |
| **Frustraciones** | Interfaces confusas, errores no explicados, procesos lentos |
| **Necesidades** | Claridad visual, validación inmediata, feedback constante |

### 2.2 Jobs to Be Done (JTBD)

1. **Cargar telegramas**: "Quiero ingresar los votos de cada mesa de forma rápida y que el sistema me avise si algo está mal antes de guardar"

2. **Consultar resultados**: "Quiero ver los totales por provincia y por lista para informar el avance del escrutinio"

3. **Verificar datos**: "Quiero poder filtrar y buscar mesas específicas para corregir errores si los hay"

4. **Exportar reportes**: "Quiero generar archivos CSV con los resultados para enviar a las autoridades"

### 2.3 User Journey: Carga de Telegrama

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Inicio    │───▶│  Selección  │───▶│   Carga de  │───▶│ Confirmación│
│   Sesión    │    │   de Mesa   │    │    Votos    │    │   y Guardado│
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                  │                  │                  │
      ▼                  ▼                  ▼                  ▼
  Dashboard         Búsqueda/          Formulario        Mensaje de
  Principal         Filtros            con validación    éxito + siguiente
```

---

## 3. Objetivos del Frontend

### 3.1 Objetivos Primarios

1. Desarrollar una SPA con Vue.js 3 que consuma la API REST del backend
2. Implementar máximo 5 pantallas con navegación clara e intuitiva
3. Proveer validación en tiempo real de datos antes de enviar al servidor
4. Mostrar resultados agregados con tablas ordenables y filtrables
5. Permitir importación de archivos CSV desde la interfaz
6. Habilitar exportación de reportes en formato CSV

### 3.2 No-Objetivos (Fuera de Alcance)

- Autenticación avanzada (login básico o sin autenticación para demo)
- Aplicación móvil nativa
- Modo offline / PWA
- Gráficos avanzados (charts) - extensión opcional
- Internacionalización (solo español)

---

## 4. Arquitectura del Frontend

### 4.1 Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                     │
│                 Vue.js 3 + Vue Router                       │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE ESTILOS                          │
│              TailwindCSS + HeadlessUI                       │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE ESTADO                           │
│                   Pinia (State Store)                       │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE SERVICIOS                        │
│              Axios (HTTP Client) + API Services             │
├─────────────────────────────────────────────────────────────┤
│                    BACKEND API                              │
│                 Laravel 11 REST API                         │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Estructura de Proyecto

```
src/
├── assets/                 # Imágenes, iconos, estilos globales
├── components/             # Componentes reutilizables
│   ├── common/            # Botones, inputs, modales, alertas
│   ├── forms/             # Formularios específicos
│   ├── tables/            # Tablas y listas
│   └── layout/            # Header, Sidebar, Footer
├── composables/           # Lógica reutilizable (hooks)
├── layouts/               # Layouts de página
├── pages/                 # Vistas/Páginas principales
│   ├── DashboardPage.vue
│   ├── CargaTelegramaPage.vue
│   ├── ResultadosProvincialPage.vue
│   ├── ResultadosNacionalPage.vue
│   └── ConfiguracionPage.vue
├── router/                # Configuración de rutas
├── services/              # Servicios de API
│   ├── api.js            # Configuración base de Axios
│   ├── provinciaService.js
│   ├── listaService.js
│   ├── mesaService.js
│   ├── telegramaService.js
│   └── resultadoService.js
├── stores/                # Pinia stores
│   ├── provinciaStore.js
│   ├── mesaStore.js
│   ├── telegramaStore.js
│   └── resultadoStore.js
├── utils/                 # Utilidades y helpers
│   ├── validators.js
│   ├── formatters.js
│   └── constants.js
├── App.vue
└── main.js
```

### 4.3 Diagrama de Flujo de Datos

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vue        │     │    Pinia     │     │   Axios      │
│  Components  │◄───▶│    Store     │◄───▶│   Service    │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │   Laravel    │
                                          │   REST API   │
                                          └──────────────┘
```

---

## 5. Diseño de Interfaz (UI/UX)

### 5.1 Principios de Diseño

- **Claridad**: Información jerárquica, acciones principales visibles
- **Eficiencia**: Mínimos clics para completar tareas frecuentes
- **Feedback**: Respuesta inmediata a cada acción del usuario
- **Consistencia**: Patrones visuales uniformes en toda la aplicación
- **Accesibilidad**: Contraste adecuado, navegación por teclado

### 5.2 Sistema de Diseño

#### Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Primary | `#1a365d` | Headers, botones principales |
| Secondary | `#2c5282` | Acentos, links |
| Success | `#38a169` | Confirmaciones, votos válidos |
| Warning | `#d69e2e` | Alertas, inconsistencias |
| Danger | `#e53e3e` | Errores, eliminación |
| Neutral | `#718096` | Texto secundario, bordes |
| Background | `#f7fafc` | Fondo de página |

#### Tipografía

| Elemento | Font | Tamaño | Peso |
|----------|------|--------|------|
| H1 (Títulos de página) | Inter | 24px | Bold |
| H2 (Secciones) | Inter | 20px | Semibold |
| H3 (Subsecciones) | Inter | 16px | Semibold |
| Body | Inter | 14px | Regular |
| Labels | Inter | 12px | Medium |
| Datos numéricos | JetBrains Mono | 14px | Regular |

### 5.3 Wireframes de Pantallas

#### 5.3.1 Dashboard Principal

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ Sistema de Comicios Argentina 2025          [Usuario] [⚙️] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  📊 Mesas       │  │  📝 Telegramas  │  │  ✅ Participación│ │
│  │  Cargadas       │  │  Pendientes     │  │  Nacional       │ │
│  │    45/120       │  │      75         │  │    67.5%        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Acciones Rápidas                                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │ + Cargar    │  │ 📈 Resultados│  │ 📤 Exportar │      │   │
│  │  │  Telegrama  │  │  Provincial │  │  Reportes   │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Últimos Telegramas Cargados                             │   │
│  │  ┌──────┬──────────────┬────────┬──────────┬──────────┐ │   │
│  │  │ Mesa │ Provincia    │ Cargo  │ Usuario  │ Hora     │ │   │
│  │  ├──────┼──────────────┼────────┼──────────┼──────────┤ │   │
│  │  │ 1001 │ Buenos Aires │ DIP/SEN│ operador1│ 14:32:15 │ │   │
│  │  │ 1002 │ Buenos Aires │ DIP/SEN│ operador2│ 14:30:22 │ │   │
│  │  └──────┴──────────────┴────────┴──────────┴──────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.3.2 Carga de Telegrama

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ Sistema de Comicios Argentina 2025          [Usuario] [⚙️] │
├─────────────────────────────────────────────────────────────────┤
│  ← Volver │ Carga de Telegrama                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Selección de Mesa                                       │   │
│  │  Provincia: [Buenos Aires        ▼]                      │   │
│  │  Mesa:      [_______________] [🔍 Buscar]               │   │
│  │                                                          │   │
│  │  ✓ Mesa 1001 - Escuela 12, Circuito 0101                │   │
│  │    Electores habilitados: 350                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Votos por Lista                        DIPUTADOS  SENADORES│
│  │  ┌────────────────────────────────────┬─────────┬─────────┐│
│  │  │ Lista A (Frente X)                 │ [  120] │ [   90] ││
│  │  │ Lista B (Frente Y)                 │ [  100] │ [  110] ││
│  │  │ Lista C (Frente Z)                 │ [   60] │ [   40] ││
│  │  └────────────────────────────────────┴─────────┴─────────┘│
│  │                                                          │   │
│  │  Otros Votos                                             │   │
│  │  Blancos: [    8]   Nulos: [    5]   Recurridos: [    1]│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Validación                                              │   │
│  │  Total votos ingresados: 294 / 350 electores    ✅ OK   │   │
│  │  Diferencia: 56 (abstenciones)                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Cancelar]                              [💾 Guardar Telegrama] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.3.3 Resultados Provinciales

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ Sistema de Comicios Argentina 2025          [Usuario] [⚙️] │
├─────────────────────────────────────────────────────────────────┤
│  ← Volver │ Resultados Provinciales                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Provincia: [Buenos Aires        ▼]   Cargo: [DIPUTADOS ▼]    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Resumen                                                 │   │
│  │  Mesas escrutadas: 45/120 (37.5%)                       │   │
│  │  Participación: 67.5%                                    │   │
│  │  Votos válidos: 12,450                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Resultados por Lista                     [📤 Exportar CSV] │
│  │  ┌────────────────────────┬────────┬─────────┬─────────┐│   │
│  │  │ Lista                  │ Votos  │    %    │ Estado  ││   │
│  │  ├────────────────────────┼────────┼─────────┼─────────┤│   │
│  │  │ 🥇 Lista A (Frente X)  │  5,200 │  41.8%  │ 1° Lugar││   │
│  │  │ 🥈 Lista B (Frente Y)  │  4,100 │  32.9%  │ 2° Lugar││   │
│  │  │ 🥉 Lista C (Frente Z)  │  3,150 │  25.3%  │ 3° Lugar││   │
│  │  └────────────────────────┴────────┴─────────┴─────────┘│   │
│  │                                                          │   │
│  │  Votos en blanco: 320 (2.5%)                            │   │
│  │  Votos nulos: 180 (1.4%)                                │   │
│  │  Votos recurridos: 45 (0.4%)                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.3.4 Resultados Nacionales

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ Sistema de Comicios Argentina 2025          [Usuario] [⚙️] │
├─────────────────────────────────────────────────────────────────┤
│  ← Volver │ Resumen Nacional                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Cargo: [DIPUTADOS ▼]                      [📤 Exportar CSV]   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Ranking Nacional de Listas                              │   │
│  │  ┌────┬─────────────────────┬──────────┬────────┬──────┐│   │
│  │  │ #  │ Lista               │  Votos   │   %    │ Prov.││   │
│  │  ├────┼─────────────────────┼──────────┼────────┼──────┤│   │
│  │  │ 1  │ Lista A (Frente X)  │  125,400 │ 38.2%  │  24  ││   │
│  │  │ 2  │ Lista B (Frente Y)  │  108,200 │ 33.0%  │  24  ││   │
│  │  │ 3  │ Lista C (Frente Z)  │   94,500 │ 28.8%  │  24  ││   │
│  │  └────┴─────────────────────┴──────────┴────────┴──────┘│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Participación por Provincia                             │   │
│  │  ┌─────────────────────┬─────────┬───────────┬─────────┐│   │
│  │  │ Provincia           │ Mesas   │ Escrutadas│ Partic. ││   │
│  │  ├─────────────────────┼─────────┼───────────┼─────────┤│   │
│  │  │ Buenos Aires        │  120    │  45 (37%) │  67.5%  ││   │
│  │  │ Córdoba             │   80    │  32 (40%) │  71.2%  ││   │
│  │  │ Santa Fe            │   60    │  28 (47%) │  69.8%  ││   │
│  │  └─────────────────────┴─────────┴───────────┴─────────┘│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.3.5 Configuración / Importación

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ Sistema de Comicios Argentina 2025          [Usuario] [⚙️] │
├─────────────────────────────────────────────────────────────────┤
│  ← Volver │ Configuración y Datos                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Importar Datos desde CSV                                │   │
│  │                                                          │   │
│  │  Tipo de datos: [Telegramas           ▼]                │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │                                                 │    │   │
│  │  │     📁 Arrastre un archivo CSV aquí            │    │   │
│  │  │           o haga clic para seleccionar          │    │   │
│  │  │                                                 │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  [Ver formato esperado]                                  │   │
│  │                                                          │   │
│  │  [📤 Importar Archivo]                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Gestión de Catálogos                                    │   │
│  │                                                          │   │
│  │  [📍 Provincias]  [📋 Listas]  [👤 Candidatos]  [🗳️ Mesas] │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Componentes del Sistema

### 6.1 Componentes Comunes (common/)

| Componente | Descripción | Props |
|------------|-------------|-------|
| `AppButton` | Botón con variantes (primary, secondary, danger) | `variant`, `size`, `disabled`, `loading` |
| `AppInput` | Input con label, validación y error | `label`, `type`, `error`, `modelValue` |
| `AppSelect` | Dropdown con búsqueda | `options`, `label`, `placeholder` |
| `AppModal` | Modal/Dialog reutilizable | `isOpen`, `title`, `size` |
| `AppAlert` | Alertas de feedback | `type`, `message`, `dismissible` |
| `AppCard` | Contenedor con sombra y padding | `title`, `subtitle` |
| `AppTable` | Tabla con ordenamiento y paginación | `columns`, `data`, `sortable` |
| `AppBadge` | Etiqueta de estado | `variant`, `text` |
| `AppSpinner` | Indicador de carga | `size` |
| `AppToast` | Notificaciones temporales | `type`, `message`, `duration` |

### 6.2 Componentes de Formulario (forms/)

| Componente | Descripción |
|------------|-------------|
| `TelegramaForm` | Formulario completo de carga de telegrama |
| `MesaSelector` | Selector de mesa con búsqueda y filtros |
| `VotosInput` | Input especializado para votos (solo números positivos) |
| `ProvinciaFilter` | Filtro de provincia con dropdown |
| `CargoFilter` | Filtro de cargo (Diputados/Senadores) |
| `FileUploader` | Componente para subir archivos CSV |

### 6.3 Componentes de Tablas (tables/)

| Componente | Descripción |
|------------|-------------|
| `TelegramasTable` | Lista de telegramas cargados |
| `ResultadosListaTable` | Resultados por lista con porcentajes |
| `ResultadosProvinciaTable` | Participación por provincia |
| `CandidatosTable` | Lista de candidatos por lista |
| `MesasTable` | Lista de mesas con estado de carga |

### 6.4 Componentes de Layout (layout/)

| Componente | Descripción |
|------------|-------------|
| `AppHeader` | Header con logo, navegación y usuario |
| `AppSidebar` | Navegación lateral (opcional) |
| `AppFooter` | Footer con información del sistema |
| `PageTitle` | Título de página con breadcrumbs |
| `StatsCard` | Tarjeta de estadística para dashboard |

---

## 7. Integración con Backend API

### 7.1 Configuración de Axios

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 422) {
      // Errores de validación
      return Promise.reject(error.response.data);
    }
    if (error.response?.status === 500) {
      // Error del servidor
      console.error('Error del servidor:', error);
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 7.2 Servicios de API

#### provinciaService.js

```javascript
// src/services/provinciaService.js
import api from './api';

export const provinciaService = {
  getAll: () => api.get('/provincias'),
  getById: (id) => api.get(`/provincias/${id}`),
  create: (data) => api.post('/provincias', data),
  update: (id, data) => api.put(`/provincias/${id}`, data),
  delete: (id) => api.delete(`/provincias/${id}`),
  getListas: (id) => api.get(`/provincias/${id}/listas`),
  getMesas: (id) => api.get(`/provincias/${id}/mesas`)
};
```

#### telegramaService.js

```javascript
// src/services/telegramaService.js
import api from './api';

export const telegramaService = {
  getAll: (params) => api.get('/telegramas', { params }),
  getById: (id) => api.get(`/telegramas/${id}`),
  getByMesa: (mesaId) => api.get(`/mesas/${mesaId}/telegramas`),
  create: (data) => api.post('/telegramas', data),
  update: (id, data) => api.put(`/telegramas/${id}`, data),
  delete: (id) => api.delete(`/telegramas/${id}`)
};
```

#### resultadoService.js

```javascript
// src/services/resultadoService.js
import api from './api';

export const resultadoService = {
  getProvincial: (provinciaId, params) => 
    api.get(`/resultados/provincial/${provinciaId}`, { params }),
  getNacional: (params) => 
    api.get('/resultados/nacional', { params }),
  getByCandidato: (candidatoId) => 
    api.get(`/resultados/candidato/${candidatoId}`),
  getByLista: (listaId) => 
    api.get(`/resultados/lista/${listaId}`)
};
```

#### importExportService.js

```javascript
// src/services/importExportService.js
import api from './api';

export const importExportService = {
  importProvincias: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/import/provincias', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  importTelegramas: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/import/telegramas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  exportProvincial: (provinciaId) => 
    api.get(`/export/provincial/${provinciaId}`, { responseType: 'blob' }),
  exportNacional: () => 
    api.get('/export/nacional', { responseType: 'blob' })
};
```

### 7.3 Mapeo de Endpoints Frontend → Backend

| Acción Frontend | Método | Endpoint Backend | Servicio |
|-----------------|--------|------------------|----------|
| Listar provincias | GET | `/api/v1/provincias` | provinciaService.getAll() |
| Obtener listas de provincia | GET | `/api/v1/provincias/{id}/listas` | provinciaService.getListas() |
| Obtener mesas de provincia | GET | `/api/v1/provincias/{id}/mesas` | mesaService.getByProvincia() |
| Buscar mesa por ID | GET | `/api/v1/mesas/{id}` | mesaService.getById() |
| Guardar telegrama | POST | `/api/v1/telegramas` | telegramaService.create() |
| Actualizar telegrama | PUT | `/api/v1/telegramas/{id}` | telegramaService.update() |
| Resultados provinciales | GET | `/api/v1/resultados/provincial/{id}` | resultadoService.getProvincial() |
| Resultados nacionales | GET | `/api/v1/resultados/nacional` | resultadoService.getNacional() |
| Importar CSV | POST | `/api/v1/import/{tipo}` | importExportService.import*() |
| Exportar CSV | GET | `/api/v1/export/{tipo}` | importExportService.export*() |

### 7.4 Manejo de Errores de API

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Error de respuesta del servidor
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return { type: 'warning', message: 'Solicitud inválida' };
      case 404:
        return { type: 'warning', message: 'Recurso no encontrado' };
      case 422:
        // Errores de validación
        return { 
          type: 'error', 
          message: 'Error de validación',
          errors: data.errors 
        };
      case 500:
        return { type: 'error', message: 'Error interno del servidor' };
      default:
        return { type: 'error', message: 'Error desconocido' };
    }
  }
  
  if (error.request) {
    // No se recibió respuesta
    return { type: 'error', message: 'No se pudo conectar con el servidor' };
  }
  
  return { type: 'error', message: error.message };
};
```

---

## 8. Gestión de Estado

### 8.1 Stores con Pinia

#### provinciaStore.js

```javascript
// src/stores/provinciaStore.js
import { defineStore } from 'pinia';
import { provinciaService } from '@/services/provinciaService';

export const useProvinciaStore = defineStore('provincia', {
  state: () => ({
    provincias: [],
    provinciaActual: null,
    loading: false,
    error: null
  }),
  
  getters: {
    provinciaById: (state) => (id) => 
      state.provincias.find(p => p.id === id),
    provinciasOrdenadas: (state) => 
      [...state.provincias].sort((a, b) => a.nombre.localeCompare(b.nombre))
  },
  
  actions: {
    async fetchProvincias() {
      this.loading = true;
      try {
        const { data } = await provinciaService.getAll();
        this.provincias = data.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchProvincia(id) {
      this.loading = true;
      try {
        const { data } = await provinciaService.getById(id);
        this.provinciaActual = data.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    }
  }
});
```

#### telegramaStore.js

```javascript
// src/stores/telegramaStore.js
import { defineStore } from 'pinia';
import { telegramaService } from '@/services/telegramaService';

export const useTelegramaStore = defineStore('telegrama', {
  state: () => ({
    telegramas: [],
    telegramaActual: null,
    mesaSeleccionada: null,
    loading: false,
    saving: false,
    error: null,
    validationErrors: {}
  }),
  
  getters: {
    telegramasPorMesa: (state) => (mesaId) =>
      state.telegramas.filter(t => t.mesa_id === mesaId),
    totalVotos: (state) => {
      if (!state.telegramaActual) return 0;
      const t = state.telegramaActual;
      return t.votos_diputados + t.votos_senadores + 
             t.blancos + t.nulos + t.recurridos;
    }
  },
  
  actions: {
    async guardarTelegrama(telegramaData) {
      this.saving = true;
      this.validationErrors = {};
      try {
        const { data } = await telegramaService.create(telegramaData);
        this.telegramas.push(data.data);
        return { success: true, data: data.data };
      } catch (error) {
        if (error.errors) {
          this.validationErrors = error.errors;
        }
        return { success: false, error };
      } finally {
        this.saving = false;
      }
    },
    
    setMesaSeleccionada(mesa) {
      this.mesaSeleccionada = mesa;
    },
    
    limpiarFormulario() {
      this.telegramaActual = null;
      this.mesaSeleccionada = null;
      this.validationErrors = {};
    }
  }
});
```

#### resultadoStore.js

```javascript
// src/stores/resultadoStore.js
import { defineStore } from 'pinia';
import { resultadoService } from '@/services/resultadoService';

export const useResultadoStore = defineStore('resultado', {
  state: () => ({
    resultadoProvincial: null,
    resultadoNacional: null,
    cargoSeleccionado: 'DIPUTADOS',
    loading: false,
    error: null
  }),
  
  getters: {
    listasMasVotadas: (state) => {
      if (!state.resultadoProvincial?.listas) return [];
      return [...state.resultadoProvincial.listas]
        .sort((a, b) => b.votos - a.votos);
    },
    participacionPorcentaje: (state) => {
      if (!state.resultadoProvincial) return 0;
      const { votos_emitidos, electores } = state.resultadoProvincial;
      return ((votos_emitidos / electores) * 100).toFixed(1);
    }
  },
  
  actions: {
    async fetchResultadoProvincial(provinciaId) {
      this.loading = true;
      try {
        const { data } = await resultadoService.getProvincial(provinciaId, {
          cargo: this.cargoSeleccionado
        });
        this.resultadoProvincial = data.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchResultadoNacional() {
      this.loading = true;
      try {
        const { data } = await resultadoService.getNacional({
          cargo: this.cargoSeleccionado
        });
        this.resultadoNacional = data.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    
    setCargo(cargo) {
      this.cargoSeleccionado = cargo;
    }
  }
});
```

---

## 9. Requerimientos Técnicos

### 9.1 Requerimientos Funcionales

#### RFF-001: Dashboard con Estadísticas

El sistema **SHALL** mostrar un dashboard con métricas clave: mesas cargadas, telegramas pendientes y participación.

**Criterio de Aceptación:**
- DADO que el usuario accede al dashboard, CUANDO se carga la página, ENTONCES muestra las estadísticas actualizadas del backend.

#### RFF-002: Carga de Telegramas con Validación

El sistema **SHALL** permitir cargar telegramas con validación en tiempo real antes de enviar al servidor.

**Criterio de Aceptación:**
- DADO que el usuario ingresa votos, CUANDO la suma excede los electores, ENTONCES muestra un error visual inmediatamente sin enviar al servidor.

#### RFF-003: Búsqueda y Selección de Mesa

El sistema **SHALL** permitir buscar mesas por ID o filtrar por provincia.

**Criterio de Aceptación:**
- DADO que el usuario escribe un ID de mesa, CUANDO encuentra coincidencia, ENTONCES muestra los datos de la mesa y permite continuar con la carga.

#### RFF-004: Visualización de Resultados Provinciales

El sistema **SHALL** mostrar resultados agregados por lista con votos, porcentajes y ranking.

**Criterio de Aceptación:**
- DADO que existen telegramas cargados para una provincia, CUANDO el usuario consulta resultados, ENTONCES muestra tabla con listas ordenadas por votos.

#### RFF-005: Visualización de Resultados Nacionales

El sistema **SHALL** mostrar un resumen nacional con ranking de listas y participación por provincia.

**Criterio de Aceptación:**
- DADO que existen telegramas de múltiples provincias, CUANDO el usuario consulta el resumen nacional, ENTONCES muestra agregación correcta de todas las provincias.

#### RFF-006: Importación de Archivos CSV

El sistema **SHALL** permitir importar datos desde archivos CSV mediante drag & drop o selección de archivo.

**Criterio de Aceptación:**
- DADO un archivo CSV válido, CUANDO el usuario lo sube, ENTONCES el sistema envía al backend y muestra resultado de importación.

#### RFF-007: Exportación de Resultados

El sistema **SHALL** permitir descargar resultados en formato CSV.

**Criterio de Aceptación:**
- DADO que el usuario solicita exportación, CUANDO hace clic en "Exportar CSV", ENTONCES se descarga un archivo con los datos actuales.

#### RFF-008: Feedback Visual de Operaciones

El sistema **SHALL** mostrar indicadores de carga, éxito y error para cada operación.

**Criterio de Aceptación:**
- DADO que el usuario realiza una acción, CUANDO está procesando, ENTONCES muestra spinner; CUANDO termina, ENTONCES muestra toast de éxito o error.

### 9.2 Requerimientos No Funcionales

#### RNFF-001: Rendimiento

- **PERF-F01**: La aplicación **SHALL** cargar inicialmente en menos de 3 segundos
- **PERF-F02**: Las transiciones entre páginas **SHALL** ser menores a 500ms
- **PERF-F03**: La validación de formularios **SHALL** ser instantánea (<100ms)

#### RNFF-002: Compatibilidad

- **COMPAT-F01**: El sistema **SHALL** funcionar en Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **COMPAT-F02**: El sistema **SHALL** ser responsive para pantallas ≥1024px
- **COMPAT-F03**: El sistema **SHOULD** funcionar en tablets (≥768px) en modo lectura

#### RNFF-003: Usabilidad

- **USE-F01**: Cada tarea principal **SHALL** completarse en máximo 3 clics
- **USE-F02**: Los formularios **SHALL** ser navegables por teclado (Tab)
- **USE-F03**: Los errores **SHALL** indicar claramente el campo y cómo corregirlo

#### RNFF-004: Accesibilidad

- **ACC-F01**: El contraste de colores **SHALL** cumplir WCAG AA (4.5:1)
- **ACC-F02**: Los elementos interactivos **SHALL** tener focus visible
- **ACC-F03**: Las imágenes **SHALL** tener atributo alt descriptivo

#### RNFF-005: Mantenibilidad

- **MAINT-F01**: Los componentes **SHALL** seguir principios de Single Responsibility
- **MAINT-F02**: El código **SHALL** seguir las guías de estilo de Vue.js
- **MAINT-F03**: La cobertura de tests de componentes **SHALL** ser ≥70%

---

## 10. Estrategia de Testing

### 10.1 Tipos de Tests

#### 10.1.1 Tests Unitarios de Componentes

- **Herramienta**: Vitest + Vue Test Utils
- **Cobertura objetivo**: ≥70%
- **Enfoque**: Probar lógica de componentes en aislamiento

#### 10.1.2 Tests de Integración

- **Herramienta**: Vitest + MSW (Mock Service Worker)
- **Enfoque**: Probar flujos completos con API mockeada

#### 10.1.3 Tests E2E (Opcional)

- **Herramienta**: Cypress o Playwright
- **Enfoque**: Probar flujos críticos en navegador real

### 10.2 Casos de Test Críticos

| Caso de Test | Tipo | Descripción |
|--------------|------|-------------|
| `TelegramaForm.spec.js` | Unit | Validación de campos, cálculo de totales |
| `MesaSelector.spec.js` | Unit | Búsqueda y selección de mesa |
| `ResultadosTable.spec.js` | Unit | Ordenamiento y renderizado de datos |
| `telegramaStore.spec.js` | Unit | Acciones del store, manejo de errores |
| `cargaTelegrama.integration.js` | Integration | Flujo completo de carga |
| `exportacion.integration.js` | Integration | Descarga de archivos CSV |

### 10.3 Ejemplo de Test

```javascript
// src/components/forms/__tests__/TelegramaForm.spec.js
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TelegramaForm from '../TelegramaForm.vue';

describe('TelegramaForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('muestra error cuando suma de votos excede electores', async () => {
    const wrapper = mount(TelegramaForm, {
      props: {
        mesa: { id: 1, electores: 100 }
      }
    });
    
    // Ingresar votos que exceden electores
    await wrapper.find('[data-test="votos-lista-a"]').setValue(80);
    await wrapper.find('[data-test="votos-lista-b"]').setValue(30);
    
    // Verificar que se muestra error
    expect(wrapper.find('[data-test="error-total"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="btn-guardar"]').attributes('disabled')).toBeDefined();
  });

  it('habilita guardar cuando datos son válidos', async () => {
    const wrapper = mount(TelegramaForm, {
      props: {
        mesa: { id: 1, electores: 100 }
      }
    });
    
    await wrapper.find('[data-test="votos-lista-a"]').setValue(40);
    await wrapper.find('[data-test="votos-lista-b"]').setValue(30);
    
    expect(wrapper.find('[data-test="error-total"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="btn-guardar"]').attributes('disabled')).toBeUndefined();
  });
});
```

---

## 11. Plan de Implementación

### 11.1 Cronograma (20 horas totales)

#### Semana 1: Fundamentos (5 horas)

1. Configuración del proyecto Vue.js 3 + Vite + TailwindCSS
2. Configuración de estructura de carpetas y routing
3. Implementación de componentes base (common/)
4. Configuración de Axios y servicios de API
5. Configuración de Pinia stores básicos

#### Semana 2: Funcionalidades Core (5 horas)

1. Implementación de Dashboard con estadísticas
2. Implementación de formulario de carga de telegrama
3. Implementación de selector de mesa con búsqueda
4. Validaciones en tiempo real
5. Tests de componentes principales

#### Semana 3: Resultados y Reportes (5 horas)

1. Implementación de página de resultados provinciales
2. Implementación de página de resumen nacional
3. Implementación de exportación CSV
4. Implementación de importación CSV
5. Tests de integración

#### Semana 4: Finalización (5 horas)

1. Pulido de UI/UX y responsive
2. Manejo de estados de error y carga
3. Pruebas finales con backend real
4. Documentación (README, componentes)
5. Build de producción y preparación de demo

---

## 12. Análisis de Riesgos

### 12.1 Matriz de Riesgos

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| CORS al conectar con backend | Alto | Alta | Configurar CORS en Laravel desde el inicio |
| Incompatibilidad de navegadores | Medio | Baja | Usar TailwindCSS y evitar APIs experimentales |
| Datos de API en formato inesperado | Alto | Media | Definir contratos de API con backend, validar respuestas |
| Performance con muchos datos | Medio | Media | Paginación, virtualización de listas si es necesario |
| Errores de validación no claros | Medio | Media | Mapear errores del backend a mensajes amigables |

### 12.2 Configuración CORS (Backend Laravel)

```php
// config/cors.php (Laravel)
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173', // Vite dev server
        'http://localhost:3000',
    ],
    'allowed_headers' => ['*'],
    'supports_credentials' => false,
];
```

### 12.3 Variables de Entorno

```env
# .env (Frontend)
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME="Sistema de Comicios Argentina 2025"
```

---

## 13. Dependencias

### 13.1 Dependencias de Producción

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| vue | 3.4+ | Framework principal |
| vue-router | 4.x | Enrutamiento SPA |
| pinia | 2.x | Gestión de estado |
| axios | 1.x | Cliente HTTP |
| tailwindcss | 3.x | Framework CSS |
| @headlessui/vue | 1.x | Componentes accesibles |
| @heroicons/vue | 2.x | Iconos |

### 13.2 Dependencias de Desarrollo

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| vite | 5.x | Build tool |
| vitest | 1.x | Testing |
| @vue/test-utils | 2.x | Testing de componentes |
| msw | 2.x | Mock de API |
| eslint | 8.x | Linting |
| prettier | 3.x | Formateo de código |

### 13.3 Dependencias de Backend

- Backend Laravel funcionando en `http://localhost:8000`
- Endpoints de API según especificación del PRD Backend
- CORS configurado para aceptar requests del frontend

---

## 14. Métricas de Éxito

### 14.1 Métricas Técnicas

| Métrica | Objetivo | Herramienta |
|---------|----------|-------------|
| Cobertura de tests | ≥ 70% | Vitest --coverage |
| Lighthouse Performance | ≥ 80 | Chrome DevTools |
| Lighthouse Accessibility | ≥ 90 | Chrome DevTools |
| Bundle size (gzipped) | < 200KB | vite-bundle-analyzer |
| First Contentful Paint | < 1.5s | Lighthouse |

### 14.2 Criterios de Aceptación del Proyecto

- ✅ Dashboard carga y muestra estadísticas del backend
- ✅ Formulario de carga valida datos antes de enviar
- ✅ Selector de mesa permite búsqueda y muestra datos
- ✅ Resultados provinciales muestran tabla ordenada por votos
- ✅ Resumen nacional agrega datos de todas las provincias
- ✅ Importación CSV funciona y muestra resultado
- ✅ Exportación CSV descarga archivo correctamente
- ✅ Mensajes de error son claros y accionables

---

## 15. Anexos

### 15.1 Configuración de Rutas (Vue Router)

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/DashboardPage.vue')
  },
  {
    path: '/cargar-telegrama',
    name: 'CargaTelegrama',
    component: () => import('@/pages/CargaTelegramaPage.vue')
  },
  {
    path: '/resultados/provincial',
    name: 'ResultadosProvincial',
    component: () => import('@/pages/ResultadosProvincialPage.vue')
  },
  {
    path: '/resultados/nacional',
    name: 'ResultadosNacional',
    component: () => import('@/pages/ResultadosNacionalPage.vue')
  },
  {
    path: '/configuracion',
    name: 'Configuracion',
    component: () => import('@/pages/ConfiguracionPage.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

### 15.2 Estructura de Respuestas de API Esperadas

#### GET /api/v1/provincias
```json
{
  "data": [
    { "id": 1, "nombre": "Buenos Aires", "codigo": "BA" },
    { "id": 2, "nombre": "Córdoba", "codigo": "CBA" }
  ],
  "meta": { "total": 24 }
}
```

#### GET /api/v1/resultados/provincial/{id}
```json
{
  "data": {
    "provincia": { "id": 1, "nombre": "Buenos Aires" },
    "cargo": "DIPUTADOS",
    "mesas_totales": 120,
    "mesas_escrutadas": 45,
    "electores": 42000,
    "votos_emitidos": 28350,
    "participacion": 67.5,
    "listas": [
      { "id": 1, "nombre": "Lista A", "alianza": "Frente X", "votos": 5200, "porcentaje": 41.8 },
      { "id": 2, "nombre": "Lista B", "alianza": "Frente Y", "votos": 4100, "porcentaje": 32.9 }
    ],
    "blancos": { "votos": 320, "porcentaje": 2.5 },
    "nulos": { "votos": 180, "porcentaje": 1.4 },
    "recurridos": { "votos": 45, "porcentaje": 0.4 }
  }
}
```

#### POST /api/v1/telegramas (Request)
```json
{
  "mesa_id": 1,
  "usuario": "operador1",
  "votos": [
    { "lista_id": 1, "votos_diputados": 120, "votos_senadores": 90 },
    { "lista_id": 2, "votos_diputados": 100, "votos_senadores": 110 }
  ],
  "blancos": 8,
  "nulos": 5,
  "recurridos": 1
}
```

#### Error 422 (Validación)
```json
{
  "message": "Los datos proporcionados no son válidos.",
  "errors": {
    "votos": ["La suma de votos (360) excede la cantidad de electores (350)."]
  }
}
```

### 15.3 Comandos de Desarrollo

```bash
# Instalación
npm install

# Desarrollo
npm run dev

# Tests
npm run test
npm run test:coverage

# Build producción
npm run build

# Preview producción
npm run preview

# Linting
npm run lint
npm run lint:fix
```

### 15.4 Historial de Revisiones

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | Diciembre 2025 | Equipo ESET-UNQ | Documento inicial |

---

**Documento generado para el Taller de Análisis y Evaluación de Proyecto - ESET UNQ**