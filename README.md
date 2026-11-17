# InvoiceCraft 🧾✨

> **Generador Local-First de Facturas y Cotizaciones con Precisión Financiera (Estándar Stripe)**  
> Aplicación web B2B de arquitectura cliente-servidor cero (100% Client-Side) para diseñar, previsualizar y exportar comprobantes comerciales vectoriales en formato A4 con sincronización reactiva a 60 FPS.

---

## 🎯 Problema y Enfoque de Solución

La generación de facturas y cotizaciones directamente en el navegador suele enfrentarse a retos técnicos concretos: imprecisiones en los montos debido al manejo de números decimales en JavaScript, pérdida de calidad tipográfica al exportar documentos rasterizados en Canvas, y la dependencia innecesaria de servidores externos para tareas que pueden procesarse de forma segura en el cliente.

**InvoiceCraft** aborda estos desafíos mediante las siguientes soluciones arquitectónicas:

1. **Precisión Aritmética (Estándar de Enteros y Puntos Básicos):**
   - El estándar de punto flotante de JavaScript (IEEE 754) introduce discrepancias en operaciones con decimales (por ejemplo, `0.1 + 0.2 === 0.30000000000000004`).
   - Para garantizar exactitud contable, los valores se manejan internamente como enteros en su unidad mínima (centavos, ej. `$19.99` $\rightarrow$ `1999`) y las tasas en puntos básicos ($1\% = 100\text{ bps}$). La conversión a decimal ocurre únicamente en la entrada de datos y en la presentación visual.
2. **Consistencia de Datos (Estado Puramente Derivado):**
   - Almacenar subtotales, impuestos y totales finales en el estado persistido puede provocar desincronizaciones si se modifica una línea de ítem.
   - Los valores calculados nunca se guardan en el store; se calculan en tiempo real como estado derivado mediante funciones puras y hooks memoizados (`useMemo`), manteniendo una única fuente de verdad.
3. **Calidad de Salida (Impresión Vectorial Nativa):**
   - La rasterización de documentos mediante Canvas suele generar archivos PDF de gran tamaño y textos pixelados que no permiten seleccionar texto.
   - Se utiliza el motor de renderizado del navegador a través de `react-to-print` y reglas CSS `@media print` (`break-inside: avoid`), produciendo documentos vectoriales nítidos, compactos y con texto seleccionable.
4. **Privacidad y Arquitectura Local-First:**
   - La información comercial y los logos corporativos se procesan y conservan localmente en el navegador (`localStorage` y Web API `FileReader`), permitiendo trabajar sin conexión y sin enviar datos fiscales a servidores de terceros.
5. **Rendimiento y Control de Recursos:**
   - Se implementa un límite preventivo en la subida de logos (hasta 1.5 MB) para proteger el almacenamiento local contra desbordamientos de cuota, junto con un debounce de 350 ms en la persistencia para mantener la interfaz a 60 FPS sin saturar el hilo principal.

---

## 🏗️ Pila Tecnológica

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Core** | React 18 + TypeScript (Strict) | SPA declarativa |
| **Empaquetador** | Vite | Compilación ultrarrápida y Hot Module Replacement (HMR) |
| **Estilos & UI** | Tailwind CSS + Lucide Icons | Diseño responsive, tokens de color corporativos y reglas físicas de impresión |
| **Estado Global** | Zustand (`persist`) | Store liviano y desacoplado sincronizado con `localStorage` |
| **Formularios** | React Hook Form + Zod | Validación de esquemas en tiempo real y listas dinámicas con `useFieldArray` |
| **Impresión / PDF** | `react-to-print` + CSS `@page` | Renderizado nativo del navegador a PDF vectorial nítido con texto seleccionable |
| **Contexto / AST** | Graphify (`scripts/graphify.sh`) | Grafo de conocimiento del código fuente para trazabilidad de arquitectura |

---

## 📐 Estructura del Proyecto

```text
Generador-De-Facturas/
├── .agents/
│   └── rules/
│       └── graphify.md           # Reglas de contexto de arquitectura para IA
├── graphify-out/                 # Grafo de conocimiento AST generado
├── scripts/
│   ├── graphify.sh               # Extractor local AST de Graphify (portable)
│   └── verificar-precision.ts    # Suite de pruebas unitarias financieras
├── src/
│   ├── components/
│   │   ├── form/                 # Formulario modularizado
│   │   │   ├── FormularioFactura.tsx
│   │   │   ├── SeccionConfiguracion.tsx
│   │   │   ├── SeccionEmisor.tsx
│   │   │   ├── SeccionItems.tsx
│   │   │   ├── SeccionPago.tsx
│   │   │   └── SeccionReceptor.tsx
│   │   ├── preview/              # Visor A4 proporcional
│   │   │   └── ContenedorA4.tsx
│   │   ├── templates/            # Plantillas de presentación desacopladas
│   │   │   ├── PlantillaModerna.tsx      # Estilo SaaS B2B moderno
│   │   │   ├── PlantillaMinimalista.tsx  # Estilo editorial y liviano
│   │   │   └── PlantillaClasica.tsx      # Estilo corporativo tradicional
│   │   └── ui/                   # Primitivas de interfaz accesibles
│   │       ├── AreaTexto.tsx
│   │       ├── Boton.tsx
│   │       ├── EntradaAutocompletado.tsx # Selector inteligente con búsqueda diacrítica
│   │       ├── EntradaTelefono.tsx       # Selector telefónico internacional con prefijos
│   │       └── EntradaTexto.tsx
│   ├── hooks/
│   │   └── usarCalculosFactura.ts # Hook contable puramente derivado
│   ├── store/
│   │   └── usarAlmacenFactura.ts  # Zustand persistido en LocalStorage
│   ├── styles/
│   │   └── global.css             # Reglas globales y reglas de impresión A4
│   ├── types/
│   │   ├── divisa.ts              # Diccionario de monedas y factores
│   │   └── factura.ts             # Esquemas Zod e interfaces en español
│   ├── utils/
│   │   ├── archivo.ts             # FileReader, Blob JSON y gestión de cuota (1.5 MB)
│   │   ├── conversionDivisa.ts    # Re-escalado seguro USD <-> COP
│   │   ├── datosIniciales.ts      # Estado base por defecto (Lienzo en blanco)
│   │   ├── datosPrueba.ts         # Facturas de ejemplo listas para cargar
│   │   ├── moneda.ts              # Motor contable de precisión Stripe
│   │   └── paises.ts              # Dataset ligero de países, códigos y ciudades (~25 KB)
│   ├── Aplicacion.tsx             # Workspace Split-Screen orquestador
│   └── principal.tsx              # Punto de entrada de la aplicación
├── index.html
├── package.json
├── pnpm-workspace.yaml            # Configuración para compatibilidad CI/CD
├── vite.config.ts
└── wrangler.json                  # Configuración de despliegue Cloudflare Workers
```

---

## 🎨 Sistema de Plantillas Desacoplado

La aplicación incluye tres plantillas de renderizado visual 100% independientes de la lógica de negocio:

* **Moderna (B2B Tech):** Encabezado con acento de color, tarjetas de emisor/receptor, tabla de ítems con totales en vivo y bloque financiero destacado.
* **Minimalista (Editorial):** Diseño sobrio de alta gama con líneas tenues, espacio negativo generoso y tipografía refinada; ideal para consultores y estudios creativos.
* **Clásica (Corporativa):** Estructura formal con celdas delimitadas, cuadros paralelos de identificación tributaria y total con doble subrayado; idónea para firmas legales y empresas tradicionales.

---

## 🚀 Puesta en Marcha

### Prerrequisitos
* **Node.js** v18+ o superior
* **pnpm** (recomendado) o npm

### Instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd Generador-De-Facturas

# Instalar dependencias
pnpm install
```

### Ejecución en Desarrollo
```bash
pnpm dev
```
Abre en tu navegador: `http://localhost:5173`

### Pruebas de Precisión Financiera
Ejecuta la suite de pruebas que valida la eliminación del error IEEE 754, cálculo en puntos básicos, redondeo determinista y re-escalado de divisas:
```bash
pnpm test:precision
```

### Construcción para Producción
```bash
pnpm build
```
Genera los artefactos optimizados en la carpeta `dist/`.

### Despliegue en la Nube (Cloudflare)
El proyecto está configurado para despliegue automatizado en la red global de Cloudflare mediante la arquitectura de **Workers Static Assets**:
```bash
# Despliegue directo por línea de comandos
npx wrangler deploy
```
* **Instancia en producción:** [https://generador-de-facturas.jc-solutions.workers.dev](https://generador-de-facturas.jc-solutions.workers.dev)

### Actualización del Grafo de Conocimiento (Graphify)
```bash
./scripts/graphify.sh
```
Indexa el AST completo del código fuente en `graphify-out/` y actualiza el visor interactivo `graphify-out/graph.html`.

---

## 💡 Características Clave de Experiencia de Usuario (UX)

* **Lienzo en Blanco por Defecto:** Inicio limpio sin datos residuales, con botón para limpiar o iniciar nuevos borradores en un clic.
* **Selectores Inteligentes de Ubicación:** Entrada con autocompletado y normalización de acentos para países y ciudades con un dataset ligero local (~25 KB).
* **Marcación Telefónica Internacional:** Selector desplegable de prefijo de país con banderas para evitar digitar códigos manualmente.
* **Portabilidad de Datos:** Exportación e importación en formato `.json` mediante descarga de blobs en el navegador.
* **Previsualización Reactiva y Zoom:** Control de zoom visual proporcional al tamaño físico de una hoja A4 (210mm × 297mm).

---

