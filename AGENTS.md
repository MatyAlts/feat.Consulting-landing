# AGENTS.md — feat.Consulting Landing Page

> Guía de contexto para cualquier IA o desarrollador que intervenga en este proyecto.  
> Leer completamente antes de realizar cualquier edición.

---

## 1. Visión general del proyecto

**feat.Consulting Landing Page** es una landing page narrativa de una sola página para una consultora de crecimiento. El diseño es **mobile-first** y la implementación actual es **únicamente la versión mobile**. La versión desktop existe como placeholders vacíos pendientes de diseño Figma.

### Filosofía de diseño

- **Scroll como narración**: cada sección es un "capítulo" de una historia visual. La secuencia de secciones tiene una progresión deliberada y no debe alterarse sin entender el arco narrativo.
- **Minimalismo tipográfico**: el contenido es casi exclusivamente texto. Los elementos visuales son el fondo, la tipografía, el color y el movimiento.
- **Animaciones funcionales**: las animaciones comunican jerarquía y fluidez, no decoración. Jamás deben interrumpir la lectura ni generar lag perceptible.
- **Paleta restringida**: los colores están elegidos con precisión. No reemplazar por equivalentes aproximados.

---

## 2. Stack tecnológico

| Tecnología   | Versión | Rol                                                       |
| ------------ | ------- | --------------------------------------------------------- |
| React        | 19.2    | UI framework                                              |
| TypeScript   | ~5.9    | Tipado estático                                           |
| Vite         | 7.x     | Build tool / dev server                                   |
| Tailwind CSS | v4.2    | Utility CSS (configuración via `@theme` en CSS)           |
| Google Fonts | —       | Fuente tipográfica (cargada via `@import` en `index.css`) |

**No hay** Framer Motion, GSAP, ni librerías de animación externas. Todas las animaciones son CSS puro (`transition`, `@keyframes`) o propiedades calculadas en `style={}` de React.

### Dev server

```bash
pnpm dev -- --host   # Corre en http://localhost:5173/
```

---

## 3. Estructura de archivos

```
src/
├── App.tsx                          # Punto de entrada — detecta viewport y renderiza Mobile o Desktop
├── main.tsx                         # React root mount
├── index.css                        # Design tokens, keyframes, utilidades globales
├── hooks/
│   ├── useViewport.ts               # Breakpoint: < 1024px = mobile / >= 1024px = desktop
│   └── useScrollDirection.ts        # Detecta dirección de scroll en el contenedor main
├── layouts/
│   ├── MobileLayout.tsx             # Wrapper mobile — snap container + orden de secciones
│   └── DesktopLayout.tsx            # Placeholder (pendiente de diseño)
└── components/
    ├── shared/
    │   └── Logo.tsx                 # SVG del logo feat.Consulting (colores fijos)
    ├── mobile/
    │   ├── Navbar.tsx               # Navbar fija + menú hamburguesa overlay
    │   ├── Hero.tsx                 # Primera sección — headline + subtítulo + body + scroll indicator
    │   ├── Services.tsx             # Sección narrativa principal — Step 0 (intro) + Steps 1–20
    │   ├── HighImpact.tsx           # Sección post-narrativa — word painting + servicios + reveal
    │   ├── StickyFooter.tsx         # Footer flotante con barra de progreso
    │   ├── About.tsx                # PLACEHOLDER — pendiente de diseño Figma
    │   ├── Contact.tsx              # PLACEHOLDER — pendiente de diseño Figma
    │   └── Footer.tsx               # PLACEHOLDER — pendiente de diseño Figma
    └── desktop/
        └── [6 archivos placeholder] # Todos pendientes de diseño Figma
```

---

## 4. Sistema de diseño (`src/index.css`)

### 4.1 Colores de marca (`@theme`)

```css
--color-brand-dark: #021b30; /* Texto principal, iconos, bordes */
--color-brand-bg: #fcfaf3; /* Fondo base (crema) */
--color-brand-muted: #8a9dae; /* Texto secundario, labels */
--color-brand-accent: #c6d7f9; /* Punto del logo, acentos sutiles */
```

En Tailwind v4 estos se usan como clases: `text-brand-dark`, `bg-brand-bg`, etc.

### 4.2 Fuentes

Importadas via Google Fonts:

```css
@import url("...Fustat:wght@200;300;400;500;600;700;800&Lato:ital,wght@1,300;1,400...");
```

| Fuente                      | Uso                                                                         |
| --------------------------- | --------------------------------------------------------------------------- |
| **Fustat**                  | Fuente principal del sitio (`--font-sans`) — toda la UI por defecto         |
| **Lato Italic Light (300)** | Uso puntual para énfasis narrativo (e.g., la sección "Validated direction") |
| **Lato Italic Regular (400)** | Disponible para énfasis narrativo |
| **Lato Italic Medium (500)** | Uso en "response." de la sección HighImpact |

**Regla crítica**: la familia `Fustat` se aplica globalmente via `body { font-family: var(--font-sans) }`. Lato solo se aplica inline con `fontFamily: '"Lato", sans-serif'` cuando el diseño lo requiere explícitamente.

### 4.3 Tamaños de texto tipográficos (`@theme`)

```css
--text-hero-title: 53.18px;
--text-hero-subtitle: 25.21px;
--text-hero-body: 22.05px;
--text-narrative-title: 50.18px;
--text-narrative-small: 28.13px;
--text-narrative-medium: 41.21px;
```

Se usan como clases de Tailwind v4: `text-hero-title`, `text-narrative-title`, etc.

Las secciones dentro de `Services.tsx` usan `fontSize` inline con valores exactos que deben mantenerse pixel-perfect.

---

## 5. Layout y scroll-snap

### 5.1 Contenedor principal (`MobileLayout.tsx`)

```tsx
<div className="flex flex-col h-screen overflow-hidden snap-container bg-[#FCFAF3]">
  <MobileNavbar /> {/* Fija, fuera del flujo de scroll */}
  <main className="flex-1 overflow-y-auto snap-y snap-proximity scroll-smooth h-full">
    {/* secciones aquí */}
  </main>
  <StickyFooter /> {/* Fija en bottom, fuera del flujo de scroll */}
</div>
```

- El scroll ocurre en el `<main>`, **no en `window`**.
- `snap-container` = `scroll-snap-type: y mandatory` (definido en `index.css`).
- Cada sección hija debe tener `snap-start snap-always` para el snapping correcto.

### 5.2 Orden de secciones en el scroll

1. Hero (`Hero.tsx`) — fondo `#FCFAF3`
2. MobileServices (`Services.tsx`) — contenedor con 20 sub-secciones que cambian el fondo
3. About (`About.tsx`) — placeholder (sin snap visible actualmente)
4. Contact (`Contact.tsx`) — placeholder
5. Footer (`Footer.tsx`) — placeholder

---

## 6. Componente `Services.tsx` — El corazón de la narrativa

Este es el componente más complejo. Gestiona **21 secciones** en total: un **Step 0** de introducción/transición (que no cuenta como parte de los 20 steps narrativos) y los **Steps 1–20** que conforman la narrativa principal. El fondo cambia dinámicamente mediante `IntersectionObserver`.

### 6.1 Mecanismo de fondo dinámico

- Cada sección `<section>` tiene atributos `data-step={N}` y `data-color="..."`.
- Un `IntersectionObserver` detecta qué sección está activa (threshold 40%) y actualiza `activeColor`.
- El `<div>` contenedor aplica `backgroundColor: activeColor` con `transition-colors duration-500`.
- Los colores en `data-color` pueden ser hex (`#010D17`) o rgba (`rgba(13, 17, 31, 0.86)`).

### 6.2 Animaciones de texto por sección (`getStepStyle`)

```typescript
const getStepStyle = (step: number, delay: number = 0) => ({
  opacity: isActive ? 1 : 0,
  filter: isActive ? "blur(0px)" : "blur(20px)",
  transform: isActive
    ? "translateY(0px)"
    : isPast
      ? "translateY(-60px)"
      : "translateY(40px)",
  transition: `all 600ms cubic-bezier(0, 0, 0.2, 1) ${delay}ms`,
});
```

- **Elemento activo**: aparece desde abajo (si viene de abajo) o desde arriba (si se regresa).
- **Delay escalonado**: se pasa `delay` en ms para animar elementos del mismo slide en cascada (0, 100, 200ms).
- El `step` que se pasa a `getStepStyle` determina si ese elemento debe estar visible.

### 6.3 Tabla de secciones dentro de `Services.tsx`

| Step | Tipo            | Texto                                                                  | Fondo (`data-color`)  |
| ---- | --------------- | ---------------------------------------------------------------------- | --------------------- |
| 0    | Frase izquierda | "But the strain doesn't appear overnight."                             | `#FCFAF3`             |
| 1    | Frase derecha   | "It builds gradually."                                                 | `#010D17`             |
| 2–3  | Combo sticky    | "Growth is visible / But it's fragile."                                | `#010D17`             |
| 4–5  | Combo sticky    | "You're getting wins / But they're inconsistent."                      | `#010D17`             |
| 6–7  | Combo sticky    | "Your team is moving / But not always on the same page."               | `#010D17`             |
| 8–9  | Combo sticky    | "Making progress... / But only when you're involved."                  | `#010D17`             |
| 10   | Outcome         | "We'll help you / Move from effort to structure. / So that you can..." | `#D2D2FF`             |
| 11   | Strategy        | "So you can... / Operate from strategy"                                | `#DBE9EE`             |
| 12   | Urgency         | "not urgency."                                                         | `#010D17`             |
| 13   | Evidence        | "So you can... / Invest from evidence"                                 | `#C6D7F9`             |
| 14   | Instinct        | "not instinct."                                                        | `#010D17`             |
| 15   | Scale           | "So you can... / Scale what's proven"                                  | `#DBE9EE`             |
| 16   | Feeling         | "not what _feels_ right."                                              | `rgba(1,13,23,0.7)`   |
| 17   | Lead            | "And, finally, / Lead your company"                                    | `#FCFAF3`             |
| 18   | Carry           | "not "carry" it."                                                      | `#312E3C`             |
| 19   | How?            | "How?"                                                                 | `rgba(21,19,36,0.97)` |
| 20   | Decade          | "After a decade... / _Validated direction_ / becomes structure."       | `rgba(13,17,31,0.86)` |

### 6.4 Secciones Combo (sticky)

Los steps 2–9 usan un patrón especial: una `<section>` de `height: 200vh` con un `<div sticky>` dentro. Esto crea el efecto de que el texto "se queda" mientras el fondo avanza. Los dos `<div data-step>` son invisibles y solo sirven de trigger para el observer.

---

## 7. Componente `HighImpact.tsx` — Transición a servicios

Esta sección actúa como puente entre la narrativa de "problemas" y la oferta concreta. No usa snap-scroll (`snap-start`) para permitir una lectura fluida y continua.

### 7.1 Word Painting (Bloque A)
- **Mecanismo**: usa un scroll listener en el `<main>` para calcular el progreso del componente en el viewport.
- **Efecto**: las palabras cambian de color de `#CECCCA` a `#171425` secuencialmente según el scroll.

### 7.2 Servicios con entrada lateral (Bloque B)
- Bloque con fondo `#8B8CFB` y `blur(18px)`.
- 4 items entran alternando izquierda/derecha mediante `IntersectionObserver`.
- Delays escalonados (0, 150, 300, 450ms).

### 7.3 Reveal final (Bloque C)
- Texto "Grounded in response. Not theory." con efecto de blur a foco y opacidad.
- Usa Lato Italic Medium para "response.".

---

## 8. Animaciones globales (`index.css`)

### 8.1 Keyframes disponibles

| Keyframe               | Clase Tailwind                 | Uso                                |
| ---------------------- | ------------------------------ | ---------------------------------- |
| `fade-in-up`           | `animate-fade-in-up`           | Hero — aparición inicial del texto |
| `bounce-slow`          | `animate-bounce-slow`          | Hero — indicador de scroll         |
| `teleport-in`          | `animate-teleport-in`          | Disponible pero no activo          |
| `teleport-out`         | `animate-teleport-out`         | Disponible pero no activo          |
| `teleport-in-reverse`  | `animate-teleport-in-reverse`  | Disponible pero no activo          |
| `teleport-out-reverse` | `animate-teleport-out-reverse` | Disponible pero no activo          |

### 7.2 Hero — animaciones de entrada

```tsx
<h1 className="opacity-0 animate-fade-in-up">
<p className="opacity-0 animate-fade-in-up [animation-delay:300ms]">
<p className="opacity-0 animate-fade-in-up [animation-delay:600ms]">
```

- `opacity-0` inicial para evitar flash antes de que cargue la animación.
- Delays: 0ms → 300ms → 600ms en cascada.

### 7.3 `.animate-blur-focus`

Clase especial que usa `animation-timeline: view()` (scroll-driven animations de CSS nativo). **No usar esta clase en secciones con snap-scroll** — puede causar comportamiento inesperado.

---

## 9. Componentes fijos: Navbar y StickyFooter

### 9.1 Navbar (`Navbar.tsx`)

- **Altura**: 60px, `fixed top-0 z-50`.
- **Comportamiento**: se oculta al hacer scroll hacia abajo (`-translate-y-full`), reaparece al subir. Umbral de 8px (`THRESHOLD` en `useScrollDirection`).
- **Menú**: overlay fullscreen que desliza desde la derecha. Bloquea el scroll del body mientras está abierto.
- **Fondo**: siempre `#FCFAF3`, nunca transparente.
- **No modificar el logo SVG**: sus coordenadas y colores son precisos. El punto azul (`#C6D7F9`) es parte del logotipo.

### 8.2 StickyFooter (`StickyFooter.tsx`)

- **Altura**: 53px, `fixed bottom-0 z-50`.
- **Comportamiento**: aparece al hacer scroll hacia abajo (scrollTop > 50px), desaparece al subir.
- **Barra de progreso**: 3px en el borde inferior, calcula el progreso según el índice de la sección activa / total de secciones.
- **Escucha el scroll del `<main>`**, no de `window`.

---

## 10. Hooks personalizados

### `useViewport`

- Breakpoint: **1024px** separa mobile de desktop.
- Usa `matchMedia` para ser reactivo a resize.
- Retorna: `{ isMobile, isDesktop }`.

### `useScrollDirection`

- Umbral de 8px para evitar falsos positivos.
- Escucha eventos en captura (`capture: true`) para detectar scroll en contenedores hijos (el `<main>`).
- Retorna: `{ scrollDir: 'up' | 'down', isAtTop: boolean }`.

---

## 11. Paleta de colores de secciones narrativas

| Color               | Hex / RGBA            | Secciones donde aparece |
| ------------------- | --------------------- | ----------------------- |
| Crema (fondo base)  | `#FCFAF3`             | Hero, Step 0, Step 17   |
| Azul noche profundo | `#010D17`             | Steps 1, 2–9, 12, 14    |
| Violeta suave       | `#D2D2FF`             | Step 10 (Outcome)       |
| Celeste agua        | `#DBE9EE`             | Steps 11, 15            |
| Azul cielo pálido   | `#C6D7F9`             | Step 13                 |
| Azul noche 70%      | `rgba(1,13,23,0.7)`   | Step 16                 |
| Ciruelo oscuro      | `#312E3C`             | Step 18 (Carry)         |
| Índigo 97%          | `rgba(21,19,36,0.97)` | Step 19 (How?)          |
| Azul medianoche 86% | `rgba(13,17,31,0.86)` | Step 20 (Decade)        |

**Regla**: los steps 18, 19 y 20 usan fondos con matices morados/índigo para diferenciar la sección climática de la narrativa del oscuro neutro (`#010D17`) de la sección de "problemas".

---

## 12. Tipografía específica de secciones (Services.tsx)

Todos los tamaños son **exactos** (pixel-perfect según Figma). No redondear.

| Step         | Elemento | Font                 | Weight  | Size                             | Color                   |
| ------------ | -------- | -------------------- | ------- | -------------------------------- | ----------------------- |
| 0            | h2       | Fustat               | 500     | `text-narrative-title` (50.18px) | `text-brand-dark`       |
| 1            | h2       | Fustat               | 500     | `text-narrative-title` (50.18px) | white                   |
| 2–9 (t1)     | p        | Fustat               | 400     | 28.13px                          | `#D6D6F0`               |
| 2–9 (t2)     | h2       | Fustat               | 500     | 41.21px                          | white                   |
| 10           | span     | Fustat               | 300     | 17.05px                          | brand-dark              |
| 10           | h2       | Fustat               | 500     | 53.18px                          | brand-dark              |
| 10           | p        | Fustat               | 300     | 22.05px                          | brand-dark              |
| 11,13,15,17  | span     | Fustat               | 300     | 17.05px                          | brand-dark              |
| 11,13,15,17  | h2       | Fustat               | 500     | 56.18px                          | brand-dark              |
| 12,14        | h2       | Fustat               | 300     | 42.18px                          | `#FCFAF3`               |
| 16           | h2       | Fustat + Lato italic | 400/400 | 42.18px                          | `#FCFAF3`               |
| 18           | h2       | Fustat               | 300     | 42.18px                          | `#FCFAF3`               |
| 19           | h2       | Fustat               | 500     | 74.18px                          | `#FCFAF3`               |
| 20 (línea 1) | p        | Fustat               | 300     | 23.18px                          | `#FCFAF3`               |
| 20 (línea 2) | h2       | **Lato** italic      | **300** | 40.5px                           | `#B1B2FF`               |
| 20 (línea 3) | p        | Fustat               | 300     | 35.5px                           | `rgba(252,250,243,0.3)` |

---

## 13. Reglas editoriales — lo que NO debe cambiar

1. **El arco narrativo**: la secuencia problema → consecuencias → solución → llamada a la acción es intencional. No reordenar ni eliminar steps sin aprobación.
2. **Los valores numéricos de tipografía**: son pixel-perfect desde Figma. No redondear a valores "amigables".
3. **El color del logo**: el punto inferior del logo es `#C6D7F9`. El cuerpo es `#021B30`. Nunca cambiarlos.
4. **La lógica del observer en Services**: el `IntersectionObserver` con threshold 40% y `rootMargin: '-10%'` está calibrado para el snap-scroll. Cambiar estos valores rompe la sincronización entre el texto y el fondo.
5. **Los fondos con opacidad de los steps 19 y 20**: la opacidad parcial es intencional para crear una transición visual suave en esa franja final. No convertir a hex sólido.
6. **La ausencia de librerías de animación externas**: no agregar Framer Motion u otras librerías. Las animaciones se hacen con CSS y `transition` inline.

---

## 14. Cómo agregar una nueva sección a `Services.tsx`

1. **Incrementar el step más alto** (actualmente 20 → el nuevo sería 21).
2. Agregar `ref={(el) => { sectionRefs.current[21] = el; }}` en la nueva section.
3. Definir `data-step={21}` y `data-color="..."` con el color de fondo deseado.
4. Agregar `snap-start snap-always` a la sección.
5. Usar `getStepStyle(21, 0)` para el primer elemento, `getStepStyle(21, 100)` para el segundo, etc.
6. Para steps "combo" (sticky de 200vh), crear la estructura con `<section className="relative h-[200vh]">` y el div sticky interno, con dos divs fantasma para los dos sub-steps.

---

## 15. Estado del proyecto (Feb 2026)

| Sección                            | Estado                       |
| ---------------------------------- | ---------------------------- |
| Mobile Hero                        | ✅ Completo                  |
| Mobile Navbar                      | ✅ Completo                  |
| Mobile Services (narrativa scroll) | ✅ Completo — 20 steps       |
| Mobile StickyFooter                | ✅ Completo                  |
| Mobile HighImpact                  | ✅ Completo                  |
| Mobile About                       | ⏳ Placeholder               |
| Mobile Contact                     | ⏳ Placeholder               |
| Mobile Footer                      | ⏳ Placeholder               |
| Desktop (toda la versión)          | ⏳ Pendiente de diseño Figma |

---

## 16. Comandos útiles

```bash
# Levantar el servidor de desarrollo (accesible en red local)
pnpm dev -- --host

# Build de producción
pnpm build

# Lint
pnpm lint
```

El servidor corre normalmente en `http://localhost:5173/`. Vite tiene HMR activo, los cambios se reflejan en tiempo real.
