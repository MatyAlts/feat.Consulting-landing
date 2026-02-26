# Plan de ejecución: nueva sección "HighImpact"

---

## Visión general de los cambios

Se necesitan **4 cambios** en orden de dependencia:

```
1. Refactorizar arquitectura de scroll (MobileLayout.tsx)
        ↓
2. Crear HighImpact.tsx (componente nuevo)
        ↓
3. Registrar el componente en MobileLayout.tsx
        ↓
4. Actualizar AGENTS.md
```

---

## Cambio 1 — Arquitectura de scroll híbrida (`MobileLayout.tsx`)

**Problema:** `<main>` tiene `snap-y snap-mandatory`, lo que obliga a que TODOS los hijos sean puntos de snap. Sin modificar esto, cualquier sección nueva quedará atrapada en el snap.

**Solución:** Cambiar `snap-y snap-mandatory` → `snap-y snap-proximity` en `<main>`.

Con `snap-proximity`, las secciones que mantienen `snap-start snap-always` (Hero + todos los steps de Services) siguen snapeando exactamente igual. Las secciones sin `snap-start` (HighImpact, About, Contact, Footer) tienen scroll libre.

**Impacto colateral — StickyFooter:** La barra de progreso busca elementos `.snap-start` en el DOM. Después de pasar Services, el progreso quedará fijo en el último step (no avanzará con el scroll libre de HighImpact en adelante). Esto es aceptable para el estado actual del proyecto, ya que About/Contact/Footer son placeholders.

**Riesgo principal:** Cambiar de `mandatory` a `proximity` puede alterar el "feel" del snap de Hero y Services. Mitigación: cada sección hijo mantiene `snap-always`, que fuerza el snap al pasar por ese punto independientemente del tipo del contenedor.

---

## Cambio 2 — Crear `src/components/mobile/HighImpact.tsx`

El componente tiene 3 bloques visuales:

### Bloque A — Título con word painting

**Texto:** `"That's how high-impact assets get built:"`
**Tipografía:** Fustat Medium 44.18px, centrado
**Colores:** pintado `#171425` / sin pintar `#CECCCA`

**Implementación:**
- Dividir el texto en spans por palabra (`That's`, `how`, `high-impact`, `assets`, `get`, `built:`)
- Crear un ref al `<main>` container (igual que StickyFooter — escuchando scroll en captura)
- En cada evento scroll, calcular `scrollProgress` = qué fracción del componente ha pasado por el viewport
- Mapear ese progress a cuántas palabras están "pintadas"
- Cada `<span>` tiene `transition: color 200ms ease` para la transición suave
- No usar `animation-timeline: view()` — usar JS + scroll listener para consistencia con el resto del proyecto

### Bloque B — Rectángulo #8B8CFB con 4 servicios

**Gap con Bloque A:** 21.78px

**El rectángulo:** Para tener blur en el fondo sin que el texto también se blur, estructura de dos capas:
```tsx
<div className="relative px-5 py-[...]">
  {/* Capa de fondo con blur — no afecta al texto */}
  <div className="absolute inset-0 bg-[#8B8CFB]"
       style={{ filter: 'blur(18px)' }} />
  {/* Texto encima, sin blur */}
  <div className="relative z-10 flex flex-col gap-[19px]">
    {items}
  </div>
</div>
```

**Los 4 textos:**
- Fustat Light 41.18px, color `#4C4A76`, gap 19px entre items
- `"Landing ecosystems."` → entra de izquierda a derecha
- `"Conversion architecture."` → entra de derecha a izquierda
- `"Narrative alignment."` → entra de izquierda a derecha
- `"Acquisition systems."` → entra de derecha a izquierda

**Implementación de la entrada:**
- IntersectionObserver (mismo patrón que Services) con threshold 20%
- Estado inicial: `opacity: 0, transform: translateX(±80px)`
- Estado activo: `opacity: 1, transform: translateX(0)`, `transition: all 600ms cubic-bezier(0, 0, 0.2, 1)`
- Delay escalonado por item: 0ms, 150ms, 300ms, 450ms para que entren secuencialmente

### Bloque C — "Grounded in response." + "Not theory."

**Gap con Bloque B:** 35px

```tsx
<p>
  <span style={{ fontFamily: '"Fustat"', fontWeight: 400, fontSize: '48.18px', color: '#171425' }}>
    Grounded in{' '}
  </span>
  <span style={{ fontFamily: '"Lato", sans-serif', fontWeight: 500, fontSize: '48.18px',
                 color: '#8B8CFB', fontStyle: 'italic' }}>
    response.
  </span>
</p>
<p style={{ marginTop: '12px', fontWeight: 200, fontSize: '22.18px', color: '#171425' }}>
  Not theory.
</p>
```

**Animación:** Entrada con blur + opacity via IntersectionObserver:
- `filter: blur(20px) → blur(0px)`, `opacity: 0 → 1`
- Misma curva `600ms cubic-bezier(0, 0, 0.2, 1)` del resto del proyecto
- "Not theory." con delay de 200ms

---

## Cambio 3 — Registrar en `MobileLayout.tsx`

```tsx
import MobileHighImpact from '../components/mobile/HighImpact'

// Dentro de <main>, después de <MobileServices />:
<MobileHighImpact />   {/* Sin snap-start — scroll libre desde aquí */}
```

Las secciones About, Contact y Footer pierden también el `snap-start snap-always` de sus wrappers.

---

## Cambio 4 — Actualizar `AGENTS.md`

- Agregar `HighImpact.tsx` al árbol de archivos con descripción
- Documentar el cambio de `snap-mandatory` → `snap-proximity`
- Actualizar la sección de "Orden de secciones en el scroll" (sección 5.2)
- Actualizar tabla de estado del proyecto (sección 14)

---

## Riesgos ordenados por severidad

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|-------------|---------|-----------|
| 1 | `snap-proximity` cambia el feel del snap en Hero/Services | Media | Alto | Testear en dispositivo real; si falla, evaluar wrapper snap interno |
| 2 | Word painting no se sincroniza bien con el scroll del `<main>` | Baja | Medio | Mismo patrón que StickyFooter — ref al `<main>` vía `e.target` |
| 3 | El blur del fondo #8B8CFB se ve diferente en Safari vs Chrome | Media | Bajo | Testear; ajustar radio de blur |
| 4 | Items de servicio entran todos a la vez en lugar de secuencial | Baja | Bajo | Observer individual por item con delay escalonado |

---

## Criterios de aceptación

- [ ] Hero y Services mantienen comportamiento snap idéntico al actual
- [ ] Al hacer scroll desde Step 20, el usuario continúa sin interrupción hacia HighImpact
- [ ] El título se "pinta" palabra a palabra de forma suave al scrollear (sin saltos bruscos)
- [ ] Los 4 servicios entran en secuencia con alternancia izquierda/derecha
- [ ] "Grounded in response." aparece con efecto blur suave
- [ ] Ninguna animación causa lag perceptible
- [ ] Funciona en Chrome Mobile, Safari iOS, Firefox Mobile

---

## Especificaciones tipográficas de referencia

| Elemento | Fuente | Peso | Tamaño | Color |
|---|---|---|---|---|
| Título (pintado) | Fustat | 500 | 44.18px | `#171425` |
| Título (sin pintar) | Fustat | 500 | 44.18px | `#CECCCA` |
| Servicios | Fustat | 300 | 41.18px | `#4C4A76` |
| "Grounded in" | Fustat | 400 | 48.18px | `#171425` |
| "response." | Lato italic | 500 | 48.18px | `#8B8CFB` |
| "Not theory." | Fustat | 200 | 22.18px | `#171425` |

## Especificaciones de espaciado

| Entre | Distancia |
|---|---|
| Bloque A (título) → Bloque B (servicios) | 21.78px |
| Bloque B (servicios) → Bloque C (grounded) | 35px |
| "Grounded in response." → "Not theory." | 12px |
| Entre items de servicio | 19px |
