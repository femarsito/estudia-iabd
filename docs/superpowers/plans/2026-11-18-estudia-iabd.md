# Estudia IABD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PWA offline-first para estudiar el curso de IA y Big Data con lecciones cortas, preguntas, repaso espaciado y gamificación, con el contenido de SAA UD1 y UD2.

**Architecture:** App Angular standalone (signals, sin SSR) servida como PWA desde GitHub Pages. El contenido son JSON estáticos en `public/content/` que el service worker guarda para usarlos sin conexión. El progreso es un registro de respuestas en `localStorage`. Todo lo demás (cajas de Leitner, puntos, racha, dominio) se calcula con funciones puras a partir de ese registro, así que fusionar dos dispositivos es unir sus registros.

**Tech Stack:** Angular 22 (`@angular/cli` 22.2.x), TypeScript, SCSS, `@angular/pwa`. Tests con el runner que traiga `ng new` (en Angular 21+ es Vitest; *comprobar en la Task 1*). El validador de contenido usa Node 24 (`node --test`). GitHub Actions publica en Pages.

**Spec:** `docs/superpowers/specs/2026-11-18-app-estudio-design.md`

## Global Constraints

- Funciona sin conexión una vez instalada. Ninguna función depende de internet ni de Claude.
- Textos de la interfaz en español de España, tuteando. Nada de jerga sin explicar.
- Sin vidas ni bloqueos: fallar solo devuelve la pregunta al repaso. Las lecciones están «bloqueadas suave» (se recomienda seguir el orden, pero se puede saltar).
- Repaso de hoy: como mucho 15 preguntas, primero las falladas.
- Leitner de 5 cajas, con intervalos de 1, 2, 4, 8 y 16 días. Acierto: sube una caja (máximo 5). Fallo: vuelve a la caja 1.
- Puntos: 10 por acierto y 20 por lección terminada.
- Meta diaria de 5, 10 o 15 minutos. Por defecto, 10.
- Dominio de una unidad = % de sus preguntas en las cajas 4 o 5.
- Examen de unidad: 10 preguntas. Simulacro de módulo: 25 preguntas (o todas, si hay menos), nota sobre 10 y tiempo opcional de 30 minutos.
- Cada pregunta tiene `id` estable, `explanation`, `source` («SAA UD2, apartado 3.1») y `difficulty` 1-3.
- Créditos: «Materiales desarrollados inicialmente por el Ministerio de Educación, Cultura y Deporte y actualizados por el profesorado de la Junta de Andalucía bajo licencia Creative Commons BY-NC-SA», con enlace a https://www.juntadeandalucia.es/educacion/gestionafp/documentacion/aviso_legal/aviso_legal_mjda/index.html. El contenido derivado va bajo CC BY-NC-SA 4.0 (`LICENSE-CONTENIDO`) y el código bajo MIT (`LICENSE`).
- Nunca se suben al repo los PDF ni datos personales.
- Diseño pensado primero para el móvil, con modo claro y oscuro, `prefers-reduced-motion`, contraste AA y botones de al menos 44 px. Identidad propia: no copia el aspecto de Duolingo.
- Calidad SonarQube: nada de métodos enormes, duplicados, `catch` vacíos ni variables sin usar.
- Commits con el pie `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **`localStorage` corrupto, vacío o lleno** (JSON roto, versión desconocida, cuota superada): la app arranca con progreso vacío sin perder el dato roto (lo guarda como `estudia-iabd:progress:roto:<fecha>`) y avisa. Si la cuota se llena, avisa y no se cuelga. → Task 3.
2. **Importar un archivo que no es un progreso, o el mismo dos veces**: si no vale, se rechaza con un mensaje y no toca nada. Si se importa dos veces, no se duplican respuestas. → Task 3.
3. **Unidad sin contenido, JSON de unidad que falla al cargar o se queda a medias sin conexión**: sale «próximamente» o «no disponible sin conexión», nunca una pantalla en blanco. → Task 5.
4. **Cambio de día y de zona horaria**: la racha y el «hoy» usan la fecha local. Responder a las 23:59 y a las 00:01 cuenta en dos días distintos. → Task 2.
5. **Pregunta borrada o cambiada de unidad** (su `id` sigue en el progreso): se ignora al calcular y no rompe el repaso. → Task 2.

---

## File Structure

```
estudia-iabd/
  LICENSE, LICENSE-CONTENIDO, README.md
  docs/superpowers/{specs,plans}/
  docs/contenido/GUIA-CONTENIDO.md        # estilo y reglas de preguntas y resúmenes
  docs/contenido/agente-escritor.md       # instrucciones del agente que escribe una unidad
  docs/contenido/agente-revisor.md        # instrucciones del agente que comprueba contra los apuntes
  scripts/validate-content.mjs            # validador (CLI + funciones exportadas)
  scripts/validate-content.test.mjs
  public/content/index.json               # módulos y unidades (las que no tienen `file` = próximamente)
  public/content/saa/ud01.json, ud02.json
  public/content/img/saa-ud01-mapa.png
  .github/workflows/deploy.yml
  src/styles.scss, src/styles/_tokens.scss
  DESIGN.md
  src/app/core/models.ts                  # tipos de contenido y progreso
  src/app/core/dates.ts                   # fecha local YYYY-MM-DD y suma de días
  src/app/core/leitner.ts (+ .spec.ts)    # cajas y cola de repaso
  src/app/core/stats.ts (+ .spec.ts)      # puntos, minutos, racha, dominio
  src/app/core/progress-codec.ts (+ .spec.ts) # parsear, validar, fusionar y serializar el progreso
  src/app/core/progress.service.ts (+ .spec.ts)
  src/app/core/content.service.ts (+ .spec.ts)
  src/app/core/quiz-builder.ts (+ .spec.ts) # elegir preguntas por modo
  src/app/shared/rich-text.ts             # pipe: **negrita**, `código`, listas con "- "
  src/app/features/home/ modules/ unit-path/ lesson-read/ lesson-pc/ quiz/ result/ progress/ settings/
  src/app/features/quiz/questions/ choice-question, match-question, order-question
```

---

### Task 1: Proyecto, PWA y modelos

**Files:**
- Create: el proyecto con `ng new` en `C:\Users\ferma\Desktop\Claude_Code\estudia-iabd` (la carpeta ya tiene `docs/`)
- Create: `src/app/core/models.ts`, `src/app/core/dates.ts`, `src/app/core/dates.spec.ts`, `LICENSE`, `LICENSE-CONTENIDO`, `README.md`, `.gitignore` (añadir `*.pdf`)

**Interfaces:**
- Produces (`models.ts`):
```ts
export type ModuleId = 'bda' | 'mia' | 'pia' | 'saa' | 'sbd';
export interface ContentIndex { modules: ModuleInfo[] }
export interface ModuleInfo { id: ModuleId; code: string; name: string; color: string; units: UnitRef[] }
export interface UnitRef { id: string; number: number; title: string; file?: string } // sin file = próximamente
export interface Unit { id: string; moduleId: ModuleId; number: number; title: string;
  conceptMap?: { src: string; credit: string }; lessons: Lesson[]; questions: Question[] }
export type LessonKind = 'read' | 'practice' | 'pc';
export interface Lesson { id: string; kind: LessonKind; title: string; section: string;
  cards?: Card[]; questionIds?: string[]; steps?: PcStep[] }
export interface Card { title?: string; body: string }
export interface PcStep { where: string; text: string; code?: string; expected?: string }
interface QBase { id: string; prompt: string; code?: string; explanation: string; source: string; difficulty: 1 | 2 | 3 }
export interface ChoiceQ extends QBase { type: 'choice'; options: string[]; answer: number }
export interface TrueFalseQ extends QBase { type: 'truefalse'; answer: boolean }
export interface MatchQ extends QBase { type: 'match'; pairs: [string, string][] }
export interface OrderQ extends QBase { type: 'order'; steps: string[] }
export type Question = ChoiceQ | TrueFalseQ | MatchQ | OrderQ;
export interface AnswerRecord { q: string; ok: boolean; at: number; ms: number }
export interface Settings { goalMinutes: 5 | 10 | 15; theme: 'system' | 'light' | 'dark' }
export interface Progress { version: 1; answers: AnswerRecord[]; lessonsDone: Record<string, number>;
  flags: Record<string, { at: number; note?: string }>; settings: Settings }
export interface QuestionState { box: 1 | 2 | 3 | 4 | 5; due: string; lastAt: number; lastOk: boolean }
```
- Produces (`dates.ts`): `localDay(at: number): string` (YYYY-MM-DD en hora local) y `addDays(day: string, n: number): string`

- [ ] **Step 1:** `npx @angular/cli@22 new estudia-iabd --directory . --style=scss --routing --ssr=false --skip-git=false` dentro de la carpeta. Si pregunta por zoneless o por el runner, acepta lo que venga por defecto. Anota en `README.md` qué runner de tests ha puesto (Vitest o Karma).
- [ ] **Step 2:** `npx ng add @angular/pwa --skip-confirmation=false`. Revisa lo que propone y acéptalo.
- [ ] **Step 3: Test** `dates.spec.ts`: `localDay(new Date(2026,10,18,23,59).getTime())` → `'2026-11-18'`; `localDay(new Date(2026,10,19,0,1).getTime())` → `'2026-11-19'`; `addDays('2026-11-30', 1)` → `'2026-12-01'`; `addDays('2026-03-28', 2)` → `'2026-03-30'` (cruza el cambio de hora).
- [ ] **Step 4:** Ejecuta `npx ng test --watch=false` y comprueba que falla. Implementa `dates.ts` y `models.ts`. Vuelve a ejecutarlo y comprueba que pasa.
- [ ] **Step 5:** Escribe `LICENSE` (MIT, femarsito), `LICENSE-CONTENIDO` (CC BY-NC-SA 4.0 con el texto de créditos de Global Constraints) y `README.md` (qué es, `npm start`, `npm test`, cómo añadir una unidad → `docs/contenido/`).
- [ ] **Step 6:** Commit `chore: proyecto Angular PWA, modelos y fechas`.

### Task 2: Leitner, cola de repaso y estadísticas

**Files:**
- Create: `src/app/core/leitner.ts`, `leitner.spec.ts`, `stats.ts`, `stats.spec.ts`

**Interfaces:**
- Consumes: `models.ts` y `dates.ts`.
- Produces:
  - `INTERVALS = [1, 2, 4, 8, 16]` (índice = caja − 1)
  - `computeStates(answers: AnswerRecord[], validIds: Set<string>): Map<string, QuestionState>`: ordena por `at`, recorre las respuestas, ignora los ids que no están en `validIds` y pone `due = addDays(localDay(at), INTERVALS[box-1])`.
  - `reviewQueue(states: Map<string, QuestionState>, today: string, max = 15): string[]`: las que tienen `due <= today`. Primero las de `lastOk === false` y después por `due` ascendente.
  - `xp(p: Progress): number`: 10 por respuesta acertada y 20 por cada `lessonsDone`.
  - `minutesByDay(answers: AnswerRecord[]): Map<string, number>`: suma `min(ms, 120000)` por `localDay(at)` y lo pasa a minutos.
  - `streak(answers: AnswerRecord[], goalMinutes: number, today: string): number`: días seguidos con la meta cumplida que acaban hoy, o ayer si hoy todavía no se ha cumplido.
  - `mastery(states: Map<string, QuestionState>, questionIds: string[]): number`: 0-100, redondeado.

- [ ] **Step 1: Tests** `leitner.spec.ts`:
  - acierto, acierto, fallo → caja 1 y `due` = día del fallo + 1;
  - cinco aciertos → caja 5 (no pasa de 5);
  - un id fuera de `validIds` no aparece en el mapa;
  - las respuestas desordenadas dan lo mismo que ordenadas;
  - `reviewQueue` con 20 vencidas devuelve 15 y las falladas van primero;
  - una pregunta con `due` mañana no sale.
- [ ] **Step 2: Tests** `stats.spec.ts`:
  - `xp` con 3 aciertos, 1 fallo y 2 lecciones → 70;
  - `minutesByDay` limita una respuesta de 10 min a 2;
  - `streak`: 3 días seguidos de 10 min y hoy 4 min con meta 10 → 3; si hoy hay 10 → 4; con un hueco antes de ayer → 1 (solo ayer); sin nada → 0;
  - `mastery` con 4 preguntas, 2 en caja ≥4 → 50.
- [ ] **Step 3:** Ejecuta `npx ng test --watch=false` y comprueba que fallan. Implementa. Comprueba que pasan.
- [ ] **Step 4:** Commit `feat: repaso espaciado y estadísticas`.

### Task 3: Progreso: guardar, importar, exportar y fusionar

**Files:**
- Create: `src/app/core/progress-codec.ts`, `progress-codec.spec.ts`, `progress.service.ts`, `progress.service.spec.ts`

**Interfaces:**
- Consumes: `models.ts`, `leitner.ts`, `stats.ts`.
- Produces:
  - `emptyProgress(): Progress` (meta 10, tema `'system'`)
  - `parseProgress(text: string): Progress | null`: `null` si no es JSON, si `version !== 1` o si faltan campos o los tipos están mal.
  - `mergeProgress(a: Progress, b: Progress): Progress`: une las respuestas sin duplicar (clave `q|at`); en `lessonsDone` gana el `at` menor; en `flags` gana la más reciente; `settings` las de `a`.
  - `serializeProgress(p: Progress): string`
  - `ProgressService` (providedIn root), clave `estudia-iabd:progress`:
    - `progress: Signal<Progress>`
    - `loadError: Signal<string | null>`
    - `recordAnswer(q: string, ok: boolean, ms: number): void`
    - `completeLesson(lessonId: string): void`
    - `flagQuestion(q: string, note?: string): void`
    - `updateSettings(s: Partial<Settings>): void`
    - `exportFile(): Blob`
    - `importText(text: string): 'ok' | 'invalid'`
    - `states(validIds: Set<string>): Map<string, QuestionState>`

- [ ] **Step 1: Tests** del codec:
  - `parseProgress('{')` → `null`; `parseProgress('{"version":2}')` → `null`;
  - lo que se serializa y se vuelve a parsear queda igual;
  - fusionar un progreso consigo mismo no cambia el número de respuestas;
  - fusionar A (respuestas 1, 2) con B (respuestas 2, 3) → 3 respuestas;
  - en `lessonsDone` se queda el `at` menor.
- [ ] **Step 2: Tests** del servicio, con `localStorage` limpio en cada test:
  - si `localStorage` tiene `'{roto'`, arranca vacío, `loadError()` no es null y el texto roto se copia en una clave que empieza por `estudia-iabd:progress:roto:`;
  - `recordAnswer` guarda en `localStorage`;
  - `importText('hola')` → `'invalid'` y el progreso no cambia;
  - importar el export propio no duplica nada;
  - si `localStorage.setItem` lanza `QuotaExceededError` (con un spy), `loadError()` explica que no queda espacio y la app sigue funcionando en memoria.
- [ ] **Step 3:** Ejecuta los tests y comprueba que fallan. Implementa. Comprueba que pasan.
- [ ] **Step 4:** Commit `feat: progreso local con importar, exportar y fusionar`.

### Task 4: Flujo de contenido: guía, agentes y validador

**Files:**
- Create: `docs/contenido/GUIA-CONTENIDO.md`, `docs/contenido/agente-escritor.md`, `docs/contenido/agente-revisor.md`, `scripts/validate-content.mjs`, `scripts/validate-content.test.mjs`
- Modify: `package.json` (scripts `"validate": "node scripts/validate-content.mjs public/content"` y `"test:content": "node --test scripts/"`)

**Interfaces:**
- Consumes: la forma de `models.ts` (el validador la vuelve a escribir en JS, sin importar TS).
- Produces: `validateIndex(index): string[]` y `validateUnit(unit, indexRef): string[]` (lista de errores; vacía = válida), y una CLI que sale con código 1 si hay errores e imprime `archivo: error` en cada línea.

Qué comprueba `validateUnit`:
- ids únicos en toda la carpeta y con el formato `<unidad>-q###` / `<unidad>-l##`;
- cada `questionIds` de una lección existe;
- `choice`: entre 2 y 4 opciones, sin repetir, y `answer` dentro del rango;
- `match`: de 3 a 5 parejas;
- `order`: de 3 a 6 pasos;
- `explanation`, `source` y `prompt` no vacíos, y `difficulty` entre 1 y 3;
- lecciones `read` con 1 a 6 `cards`; `practice` con 5 a 12 preguntas; `pc` con al menos un `step`;
- `conceptMap.src` existe en `public/content/`;
- que todas las preguntas aparezcan en alguna lección `practice` (avisa, sin ser error).

`GUIA-CONTENIDO.md` fija:
- tarjetas de un máximo de unos 60 palabras;
- un test por idea;
- distractores creíbles, sacados de confusiones reales del tema;
- nada de «todas las anteriores» salvo que lo use el curso;
- la mezcla aproximada de tipos: 60 % `choice` (de ellos un 15 % con código), 20 % `truefalse`, 10 % `match` y 10 % `order`;
- `source` con el apartado de los apuntes;
- el tono de las explicaciones (de tú, en dos o tres frases);
- la cantidad: entre 50 y 100 preguntas según lo larga que sea la unidad;
- el estilo de los exámenes de práctica de Moodle (como modelo, sin copiarlos);
- que la licencia se compruebe en el pie de cada unidad.

`agente-escritor.md` dice cómo leer el PDF:
- con texto: `pdftotext -enc UTF-8`, copiando antes el archivo a una ruta sin tildes;
- si es jsPDF: sacar los JPEG de las páginas con el script de `docs/contenido/` y leerlos.

Además, fija la salida (`public/content/<mod>/udNN.json`) y que no se inventa nada que no esté en los apuntes.

`agente-revisor.md` dice que compruebe cada pregunta contra el texto: que la respuesta sea correcta, que no haya dos opciones válidas y que la fuente exista. Devuelve la lista de ids a corregir o a borrar, con su motivo.

- [ ] **Step 1: Tests** `validate-content.test.mjs`, con fixtures dentro del test:
  - una unidad válida → `[]`;
  - un id repetido → un error que lo menciona;
  - `answer: 4` con 4 opciones → error;
  - una lección con un `questionId` que no existe → error;
  - una `explanation` vacía → error.
- [ ] **Step 2:** Ejecuta `npm run test:content` y comprueba que falla. Implementa. Comprueba que pasa.
- [ ] **Step 3:** Añade `docs/contenido/extraer-paginas.py`, que saca los JPEG de un PDF hecho con jsPDF. Solo usa la biblioteca estándar: busca `/Filter /DCTDecode` y corta de `\xff\xd8` a `\xff\xd9`. Se usa así: `py -I extraer-paginas.py entrada.pdf carpeta_salida`. Escribe los tres `.md`.
- [ ] **Step 4:** Commit `feat: guía de contenido, agentes y validador`.

### Task 5: Carga de contenido e índice de módulos

**Files:**
- Create: `public/content/index.json`, `public/content/saa/ud01.json` (temporal: 1 lección de cada tipo y 6 preguntas de ejemplo; se sustituye en la Task 10), `src/app/core/content.service.ts`, `content.service.spec.ts`
- Modify: `ngsw-config.json` (assetGroup `content`: `installMode: "prefetch"`, `updateMode: "prefetch"`, `files: ["/content/**"]`), `src/app/app.config.ts` (`provideHttpClient(withFetch())`)

**Interfaces:**
- Consumes: `models.ts`.
- Produces: `ContentService`:
  - `index(): Promise<ContentIndex>`
  - `unit(unitId: string): Promise<Unit | 'coming-soon' | 'unavailable'>`
  - `module(id: ModuleId): Promise<ModuleInfo | undefined>`
  - `allQuestionIds(): Promise<Set<string>>` (solo de las unidades cargadas)
  - Guarda en memoria lo que ya ha cargado.

`index.json` lleva los cinco módulos, cada uno con su color provisional (lo cambia la Task 6), y las unidades conocidas:
- BDA: 1 «Introducción a Apache Hadoop», 2 «Almacenamiento y procesamiento en Hadoop»;
- MIA: 1 «Caracterización de sistemas de Inteligencia Artificial», 2 «Utilización de los modelos de Inteligencia Artificial»;
- PIA: 1 «Introducción a la programación de Inteligencia Artificial», 2 «Lenguajes de programación de IA. Lenguaje R»;
- SAA: 1 «Introducción a la IA y a los sistemas de aprendizaje automático» (`file: "saa/ud01.json"`), 2 «Algoritmos y herramientas para el aprendizaje supervisado»;
- SBD: 1 «Introducción a Big Data», 2 «Almacenamiento de datos y MongoDB».

- [ ] **Step 1: Tests** con `HttpTestingController`:
  - una unidad sin `file` → `'coming-soon'`;
  - un 404 o un error de red → `'unavailable'`;
  - una unidad válida → el objeto, y una segunda llamada no vuelve a pedirla.
- [ ] **Step 2:** Ejecuta los tests y comprueba que fallan. Implementa. Comprueba que pasan. Ejecuta `npm run validate` y comprueba que sale 0.
- [ ] **Step 3:** Commit `feat: carga de contenido e índice`.

### Task 6: Dirección visual y estructura de la app

**Files:**
- Create: `DESIGN.md`, `src/styles/_tokens.scss`, `src/app/shared/rich-text.ts` (+ spec), `src/app/layout/shell.component.ts`
- Modify: `src/styles.scss`, `src/app/app.routes.ts`, `src/index.html` (lang `es`, `theme-color`, fuentes)

**Interfaces:**
- Produces:
  - Tokens CSS en `:root`: colores (`--c-bg`, `--c-surface`, `--c-text`, `--c-muted`, `--c-ok`, `--c-ko`, `--c-accent`), con su versión oscura en `prefers-color-scheme` y en `[data-theme]`; un color por módulo (`--mod-bda`… `--mod-sbd`); espaciado, radios, sombras y duraciones.
  - Rutas: `''` (inicio), `modulos`, `modulo/:moduleId`, `unidad/:unitId`, `leccion/:unitId/:lessonId`, `quiz/:mode/:id` (`mode` = `practice | exam | sim | review`), `resultado`, `progreso`, `ajustes`.
  - `ShellComponent` con barra inferior en el móvil y lateral en el PC: Inicio, Módulos, Progreso, Ajustes.
  - Pipe `richText`: convierte `**negrita**`, `` `código` `` y líneas que empiezan por `- ` en HTML escapado y seguro, sin `innerHTML` de texto sin escapar.

- [ ] **Step 1:** Invoca la skill `impeccable:impeccable` para definir la dirección visual (app de estudio, móvil primero, cinco colores de módulo, con momentos de celebración contenidos y modo claro y oscuro). El resultado se guarda en `DESIGN.md` y `_tokens.scss`. Fuentes de Google Fonts guardadas en local (`public/fonts/`) para que funcionen sin conexión.
- [ ] **Step 2: Test** de `richText`: `'**a** <b>'` → contiene `<strong>a</strong>` y `&lt;b&gt;`; `'- uno\n- dos'` → `<ul>` con 2 `<li>`.
- [ ] **Step 3:** Implementa el pipe, el shell y las rutas (componentes vacíos por ahora). `npx ng test --watch=false` en verde y `npx ng build` sin errores.
- [ ] **Step 4:** Commit `feat: dirección visual, tokens y estructura`.

### Task 7: Inicio, módulos y camino de la unidad

**Files:**
- Create: `src/app/features/home/home.component.ts`, `modules/modules.component.ts`, `modules/module.component.ts`, `unit-path/unit-path.component.ts`, `src/app/core/next-step.ts` (+ spec)

**Interfaces:**
- Consumes: `ContentService`, `ProgressService`, `streak`, `xp`, `minutesByDay`, `mastery`, `reviewQueue`.
- Produces: `nextLesson(index: ContentIndex, units: Map<string, Unit>, done: Record<string, number>): { unitId: string; lessonId: string } | null`. Es la primera lección sin hacer de la primera unidad cargada que no esté terminada, siguiendo el orden del índice.

Pantallas:
- **Inicio**: racha, puntos, anillo o barra de «hoy X/meta min», botón «Seguir» (a `nextLesson`), «Repaso de hoy (N)» (oculto si N = 0) y un aviso si `loadError()`.
- **Módulos**: tarjetas con color, código, nombre y dominio medio.
- **Módulo**: lista de unidades. Las que no tienen `file` salen como «Próximamente».
- **Camino de la unidad**: lecciones en vertical, con el estado `hecha | actual | pendiente` y el icono por tipo (📖 leer, ✏️ practicar, 💻 PC). Al final, «Examen de la unidad (10)».

- [ ] **Step 1: Test** `nextLesson`: sin nada hecho → la primera lección de SAA UD1; con todas las de UD1 hechas y UD2 sin `file` → `null`.
- [ ] **Step 2:** Implementa y comprueba que los tests pasan. Revísalo con `npx ng serve` a 375 px y a 1280 px de ancho.
- [ ] **Step 3:** Commit `feat: inicio, módulos y camino de la unidad`.

### Task 8: Lecciones de leer y de práctica en el PC

**Files:**
- Create: `src/app/features/lesson-read/lesson-read.component.ts`, `src/app/features/lesson-pc/lesson-pc.component.ts`

**Interfaces:**
- Consumes: `ContentService.unit`, `ProgressService.completeLesson`, el pipe `richText`.

Comportamiento:
- **Leer**: tarjetas que se pasan con un botón o deslizando, con barra de avance. En la primera lección de la unidad sale el mapa conceptual con su crédito, y se puede tocar para ampliarlo. Al final, «Hecho» llama a `completeLesson` y lleva a la práctica siguiente.
- **PC**: un aviso arriba («💻 Esto se hace en el ordenador»). Debajo, los pasos numerados, cada uno con la etiqueta `where` (navegador, terminal o Colab), el código con botón de copiar y el resultado que debería salir. Al final, un botón que lleva a sus preguntas de comprobación si la lección tiene `questionIds`, o «Hecho» si no las tiene.
- Si la unidad es `'unavailable'`, sale el mensaje «No se puede cargar sin conexión. Ábrela una vez con internet.».

- [ ] **Step 1:** Implementa las dos pantallas. Comprueba que `npx ng test --watch=false` y `npx ng build` pasan.
- [ ] **Step 2:** Pruébalo a mano en `ng serve` con la unidad de ejemplo de la Task 5.
- [ ] **Step 3:** Commit `feat: lecciones de leer y de práctica en el PC`.

### Task 9: Motor de preguntas, modos y resultado

**Files:**
- Create: `src/app/core/quiz-builder.ts` (+ spec), `src/app/features/quiz/quiz.component.ts`, `questions/choice-question.component.ts`, `questions/match-question.component.ts`, `questions/order-question.component.ts`, `src/app/features/result/result.component.ts`

**Interfaces:**
- Consumes: `ContentService`, `ProgressService`, `reviewQueue`, `computeStates`.
- Produces:
  - `buildQuiz(mode: 'practice' | 'exam' | 'sim' | 'review', ctx: { units: Unit[]; lessonId?: string; states: Map<string, QuestionState>; today: string; rng: () => number }): Question[]`. `practice` devuelve las de la lección en su orden. `exam` devuelve 10 al azar de la unidad. `sim` devuelve 25 al azar del módulo, o todas si hay menos. `review` devuelve `reviewQueue`.
  - `shuffleOptions(q: ChoiceQ, rng): ChoiceQ`: baraja las opciones y recoloca `answer`. No se baraja si alguna opción empieza por «Todas» o «Ninguna».
  - Los componentes de pregunta emiten `answered: { ok: boolean; ms: number }`.

Comportamiento:
- Una pregunta por pantalla.
- `choice` y `truefalse`: se toca una opción, después «Comprobar», y sale la explicación en verde o en rojo. Si hay `code`, se ve en un bloque monoespaciado con scroll horizontal. Si el `prompt` contiene `___`, se pinta como un hueco.
- `match`: se toca un elemento de la izquierda y luego uno de la derecha. Está bien si todas las parejas lo están.
- `order`: se ordena con botones de subir y bajar, que funcionan con el teclado y con el dedo.
- Debajo de cada pregunta se ven la fuente y el botón «⚑ Esta pregunta está mal».
- En `practice` y `review`, cada respuesta llama a `recordAnswer`. En `exam` y `sim` también, pero la explicación se ve al final, en el resultado.
- En `sim` hay un temporizador opcional de 30 minutos.
- **Resultado**: aciertos y nota sobre 10 (en el examen y el simulacro), puntos ganados, lista de las falladas con su explicación y una celebración breve si se aprueba (respetando `reduced-motion`). En la práctica, se llama a `completeLesson` al terminar.

- [ ] **Step 1: Tests** de `buildQuiz` con un `rng` fijo:
  - `exam` con 30 preguntas → 10 sin repetir;
  - `sim` con 12 → 12;
  - `review` respeta el máximo de 15;
  - `shuffleOptions` mantiene correcta la opción buena;
  - con «Ninguna es correcta» no se baraja.
- [ ] **Step 2: Tests** de componente para `match` y `order`: las respuestas correctas e incorrectas emiten el `ok` que toca.
- [ ] **Step 3:** Implementa y comprueba que los tests pasan. Pruébalo a mano en los cuatro modos.
- [ ] **Step 4:** Commit `feat: motor de preguntas, modos y resultado`.

### Task 10: Contenido de SAA UD1 y UD2

**Files:**
- Create: `public/content/saa/ud01.json`, `public/content/saa/ud02.json`, `public/content/img/saa-ud01-mapa.png` (desde `Downloads\SAA01_MapaConceptual.png`). El de la UD2 solo si existe.
- Modify: `public/content/index.json` (`file` de SAA UD2)

Fuentes, que no se copian al repo:
- `C:\Users\ferma\Downloads\Unidad1SAA.pdf` (con texto);
- `C:\Users\ferma\Downloads\SAA T2\saaunidad2.pdf` (con texto);
- de apoyo: `Downloads\Resumen UD1 Introducción a la IA y al aprendizaje automático.pdf`, `Desktop\SAA-Tarea1\` y el examen de práctica de SAA UD2, que está en la nota de la bóveda `ideas/app-estudio-curso-ia.md`.

- [ ] **Step 1:** Despacha un subagente por unidad con `docs/contenido/agente-escritor.md`.
- [ ] **Step 2:** Despacha un subagente revisor nuevo por unidad con `docs/contenido/agente-revisor.md`. Aplica lo que diga: corregir o borrar.
- [ ] **Step 3:** Ejecuta `npm run validate` y comprueba que sale 0. Mira la mezcla de tipos y la cantidad (entre 50 y 100 por unidad).
- [ ] **Step 4:** Comprueba a mano 10 preguntas al azar de cada unidad contra el PDF.
- [ ] **Step 5:** Commit `content: SAA UD1 y UD2`.

### Task 11: Progreso y ajustes

**Files:**
- Create: `src/app/features/progress/progress.component.ts`, `src/app/features/settings/settings.component.ts`, `src/app/core/theme.ts`

**Interfaces:**
- Consumes: `ProgressService`, `ContentService`, `mastery`, `minutesByDay`, `computeStates`.
- Produces: `applyTheme(t: Settings['theme']): void`, que pone `data-theme` en `<html>`. Se llama al arrancar y al cambiar el tema.

Pantallas:
- **Progreso**:
  - dominio por módulo y por unidad, en barras con el color del módulo;
  - los minutos de los últimos 14 días;
  - las 5 secciones (`source`) con más fallos en los últimos 30 días;
  - las preguntas marcadas como mal;
  - tres logros calculados, que no se guardan: «Primera lección», «Racha de 7 días» y «Unidad dominada» (dominio ≥ 80 %).
- **Ajustes**:
  - meta de 5, 10 o 15 minutos;
  - tema (sistema, claro u oscuro);
  - «Exportar progreso», que descarga `estudia-iabd-progreso-YYYY-MM-DD.json`;
  - «Importar progreso» (selector de archivo, lo fusiona y avisa de cuántas respuestas nuevas ha añadido o de que el archivo no es válido);
  - créditos y licencias, con el texto de Global Constraints;
  - versión de la app.

- [ ] **Step 1:** Implementa las dos pantallas. Prueba a mano: exportar, borrar los datos del sitio, importar y comprobar que vuelve todo; importar un `.txt` cualquiera y comprobar que sale el error y no se pierde nada.
- [ ] **Step 2:** `npx ng test --watch=false` y `npx ng build` en verde.
- [ ] **Step 3:** Commit `feat: progreso y ajustes`.

### Task 12: Publicación, prueba sin conexión y pulido

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md` (enlace a la app y cómo instalarla en Android, iPhone y PC)

`deploy.yml`:
- se lanza con un push a `main`;
- usa Node 24;
- ejecuta `npm ci`, `npm run test:content`, `npm run validate`, `npx ng test --watch=false` y `npx ng build --base-href /estudia-iabd/`;
- usa `actions/upload-pages-artifact` con `dist/estudia-iabd/browser` y `actions/deploy-pages`;
- copia `index.html` a `404.html` para que las rutas funcionen al recargar.

- [ ] **Step 1:** Pide a Fernando dos cosas:
  1. crear en GitHub un repo **público** vacío `estudia-iabd` (sin README);
  2. en Settings → Pages, elegir Source «GitHub Actions».

  Después añade el remoto `https://github.com/femarsito/estudia-iabd.git` y haz push. El push lo autentica el Git Credential Manager, que ya usa Obsidian Git.
- [ ] **Step 2:** Comprueba que el workflow pasa y que `https://femarsito.github.io/estudia-iabd/` carga.
- [ ] **Step 3:** Pasa `/impeccable audit` y `/impeccable polish` a la app publicada o en local. Arregla lo que encuentren, sin cambiar la lógica.
- [ ] **Step 4:** Prueba con Fernando en el móvil:
  1. instalarla («Añadir a pantalla de inicio»);
  2. activar el modo avión;
  3. abrirla y hacer una lección y el repaso;
  4. cerrarla y volver a abrirla: el progreso sigue ahí.
- [ ] **Step 5:** Commit y push `chore: despliegue en GitHub Pages`. Actualiza la nota del proyecto en la bóveda.
