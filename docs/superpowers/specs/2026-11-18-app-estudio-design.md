# Estudia IABD: diseño de la app de estudio del curso de IA y Big Data

Fecha: 2026-11-18. Estado: borrador para que Fernando lo apruebe.

## Para qué es

Fernando estudia a distancia el curso de especialización en Inteligencia Artificial y Big Data (FP de la Junta de Andalucía). Tiene cinco módulos: BDA (Big Data Aplicado), MIA (Modelos de IA), PIA (Programación de IA), SAA (Sistemas de Aprendizaje Automático) y SBD (Sistemas de Big Data). Los apuntes son largos, unas 50 a 80 páginas por unidad, y estudia a ratos, muchas veces desde el móvil.

Quiere una app para estudiar y practicar al estilo de Duolingo, con puntos, racha y preguntas cortas, y con algo de lectura en forma de resúmenes que no saturen. Tiene que funcionar en el PC y en el móvil (Android o iPhone) y sin conexión. No puede depender de Claude ni de que el ordenador esté encendido. Irá creciendo según se publiquen unidades nuevas. Para él lo más importante es que la interfaz quede muy bonita.

Los exámenes de unidad de Moodle son de práctica. Los de verdad son presenciales: uno voluntario en febrero y otro obligatorio en junio, de formato todavía sin confirmar.

## Objetivos

- Repasar cada unidad en sesiones de 5 a 10 minutos: leer un resumen corto y responder preguntas.
- Que lo fallado vuelva hasta que se sepa (repaso espaciado).
- Que las preguntas sean del estilo de las del curso: test con cuatro opciones (a-d), verdadero o falso y leer un trozo de código y decir qué pasa.
- Marcar lo práctico (Colab, mongosh, Proxmox, Hadoop) con 💻 y con los pasos explicados, porque se hace en el PC.
- Motivar sin agobiar: puntos, racha, una meta diaria pequeña y el progreso de cada unidad.
- Que cada pregunta diga de qué apartado de los apuntes sale.

## Lo que no es

- No sustituye a los apuntes ni a las tareas, ni las hace.
- No hay usuarios, ni ranking, ni nada social.
- La primera versión no lleva tutor con IA. Si algún día se añade, será opcional y la app funcionará igual sin él.
- No hay app nativa ni se publica en tiendas.

## Qué la haría fracasar aunque funcione

- Preguntas con la respuesta mal. Se aprendería algo falso.
- Que agobie: vidas que bloquean, sesiones largas, notificaciones insistentes.
- Que no funcione sin conexión o que se pierda el progreso.
- Que añadir una unidad nueva cueste tanto que se deje de hacer.
- Que se vea fea o genérica.

## Restricciones

- Sin conexión: todo el contenido viene dentro de la app y el progreso se guarda en el dispositivo.
- Se tiene que poder instalar desde el navegador en Android, iPhone y PC, sin tiendas.
- Gratis, sin pagar cuentas de desarrollador.
- Los apuntes son materiales «desarrollados inicialmente por el Ministerio de Educación, Cultura y Deporte y actualizados por el profesorado de la Junta de Andalucía bajo licencia Creative Commons BY-NC-SA». Está comprobado en SAA UD2 y en la guía de BDA; en cada unidad nueva se comprueba el pie. Por eso los resúmenes, las preguntas y los mapas conceptuales que se copien llevan la misma licencia: aviso en el repo (`LICENSE-CONTENIDO`) y en los créditos de la app, con enlace al aviso legal de la Junta. El código lleva su propia licencia. Nada se cobra y no se suben los PDF.
- Ni claves ni datos personales en el repo.
- Stack de Fernando: Angular con TypeScript. Calidad SonarQube y Git.

## Formas de construirla que se valoraron

| Opción | A favor | En contra | Decisión |
|---|---|---|---|
| A. Página privada en claude.ai | Progreso compartido entre PC y móvil, Claude dentro para corregir y explicar, no hay que alojarla en ningún sitio | Necesita internet y la sesión de claude.ai, y depende de Claude | Descartada. Fernando necesita que funcione sin conexión y sin Claude |
| B. App web instalable (PWA) | Funciona sin conexión, se instala con icono en Android, iPhone y PC, gratis y sin depender de nadie | Cada dispositivo guarda su propio progreso. Hay que alojarla en un sitio con HTTPS para instalarla en el móvil | **Elegida** |
| C. Mazos de Anki | No hay nada que programar y su repaso espaciado es muy bueno | No se parece a Duolingo, es fea y no tiene lecciones para leer | Descartada |
| App nativa | Experiencia de tienda | Para iPhone pide un Mac y 99 $ al año | Descartada |

## Cómo funciona

### Estructura del contenido

Módulo → unidad → lecciones. Cada unidad se parte en lecciones de 5 a 10 minutos, más o menos una por apartado de los apuntes. Hay tres tipos de lección:

- **Lee**: un resumen corto en tarjetas (unas 3 a 6 tarjetas de pocas líneas). La primera lección de cada unidad muestra el mapa conceptual de los apuntes como imagen, con su crédito, porque la licencia lo permite.
- **Practica**: unas 10 preguntas del apartado.
- **💻 Práctica en el PC**: los pasos explicados (qué abrir, qué escribir y qué debería salir), con preguntas de comprobación que se responden en la app. Dentro de la app no se ejecuta nada.

Al final de cada unidad hay un **examen de unidad** con 10 preguntas mezcladas, al estilo de los de práctica de Moodle. Por módulo hay un **simulacro** de 20 a 30 preguntas de todas las unidades cargadas, con nota sobre 10 y tiempo opcional.

Las unidades que todavía no se han publicado salen en el camino como «próximamente».

### Tipos de pregunta

1. Test con 4 opciones (a-d) y una correcta.
2. Verdadero o falso.
3. Código: un fragmento y una pregunta sobre él (qué hace, si está bien o qué falta). Se responde como un test.
4. Relacionar parejas (concepto ↔ definición).
5. Ordenar pasos (por ejemplo, cómo escribe HDFS un fichero).
6. Completar un hueco eligiendo entre opciones.

Fuera de la primera versión se queda la respuesta libre escrita, porque sin IA no se puede corregir bien.

Cada pregunta lleva su explicación (por qué es esa respuesta), la fuente («SBD UD2, apartado 3.1») y su dificultad (1 a 3).

### Cantidad de preguntas

Las que dé cada unidad sin relleno: unas 50 en una unidad corta y hasta unas 100 en una larga.

### Repaso espaciado

Sistema de cajas de Leitner, con 5 cajas. Una pregunta acertada sube de caja y una fallada vuelve a la 1. Cada caja tiene su intervalo: 1, 2, 4, 8 y 16 días. El «repaso de hoy» junta las preguntas que tocan, con un máximo de 15 para que no agobie, y empieza por las falladas.

### Gamificación

- Puntos (XP) por pregunta acertada y una bonificación al terminar la lección.
- Racha de días seguidos con la meta diaria cumplida. La meta la elige Fernando (5, 10 o 15 minutos o un número de puntos) y por defecto es de 10 minutos.
- Dominio de cada unidad (de 0 a 100 %), según cuántas preguntas están en las cajas altas.
- No hay vidas ni nada que bloquee. Fallar solo hace que la pregunta vuelva.
- Algún logro sencillo (primera unidad dominada, racha de 7 días). Pocos.

### Pantallas

1. **Inicio**: racha, puntos, meta de hoy, botón «Seguir» (lleva a la siguiente lección pendiente) y «Repaso de hoy».
2. **Módulos**: los cinco, cada uno con su color y su progreso.
3. **Camino de la unidad**: las lecciones en vertical, al estilo Duolingo, con su estado (hecha, actual, bloqueada suave o próximamente).
4. **Lección Lee**: tarjetas que se pasan.
5. **Lección Practica, examen y simulacro**: una pregunta por pantalla, respuesta inmediata con su explicación y botón para seguir.
6. **Resultado**: aciertos, puntos ganados y qué repasar.
7. **Progreso**: dominio por módulo y unidad y los temas con más fallos.
8. **Ajustes**: meta diaria, tema claro u oscuro, exportar e importar el progreso (un archivo) y créditos de los apuntes.

«Bloqueada suave» quiere decir que se recomienda seguir el orden, pero se puede saltar.

Boceto de la pantalla de inicio en el móvil:

```
┌────────────────────────────┐
│ 🔥 6 días    ⭐ 340 puntos  │
│ Hoy 7/10 min ▓▓▓▓▓▓▓░░░    │
│ SBD · Unidad 2             │
│  ✓ Lee: HDFS en 3 minutos  │
│  ● Practica (10 preguntas) │
│  ○ 💻 Comandos de mongosh  │
│  ○ Repaso de las falladas  │
│        [ Seguir ]          │
└────────────────────────────┘
```

### Diseño visual

El diseño se piensa primero para el móvil y se adapta al PC. Tiene identidad propia: no copia el aspecto de Duolingo, solo la mecánica de camino y lecciones cortas. Cada módulo lleva un color, hay modo claro y oscuro, las animaciones son cortas al acertar y al subir de nivel, y se respetan «reducir movimiento» y la accesibilidad (contraste y tamaño de los botones). La dirección visual se decide con la skill impeccable antes de programar las pantallas, y al terminar se pasan `/impeccable audit` y `/impeccable polish`.

### Datos y guardado

- El contenido va en archivos JSON dentro del repo, uno por unidad (por ejemplo `content/sbd/ud02.json`), con sus lecciones, tarjetas y preguntas. Un archivo `content/index.json` lista los módulos y unidades, también los que salen como «próximamente».
- El progreso se guarda en el dispositivo, en `localStorage`. Es menos de 1 MB al año de uso y no hace falta añadir ninguna dependencia. Lo que se guarda es el registro de respuestas, y de él se calculan las cajas, los puntos y la racha. Para pasarlo de un dispositivo a otro o tener una copia, se exporta y se importa como archivo.
- Importar **fusiona** y no reemplaza, para no perder nada si se alterna entre el PC y el móvil. Cada respuesta guarda la fecha y la hora. Por pregunta gana el estado con la respuesta más reciente. Los días de estudio se suman (la racha se recalcula a partir de ellos), los puntos se recalculan a partir del historial de respuestas y las marcas de «pregunta mal» se suman. Decisión de Claude.
- Las preguntas tienen un identificador estable, para que corregir una pregunta no borre su progreso.

### Cómo entra el contenido nuevo

1. Fernando deja el PDF de la unidad en una carpeta (por ejemplo `Descargas\SBD T2`) y avisa a Claude.
2. Claude lo lee. Si el PDF tiene texto, lo extrae con `pdftotext`. Si son capturas de Moodle, saca las fotos de las páginas y las lee.
3. Un agente escribe el resumen y las preguntas de la unidad siguiendo una guía fija de estilo. La guía (`content/GUIA-CONTENIDO.md`) y las instrucciones de los dos agentes se guardan en el repo, para que cualquier sesión de Claude haga lo mismo. Los agentes son sesiones de Claude, no un programa que corra solo.
4. Otro agente comprueba cada pregunta contra los apuntes y descarta o corrige las que no cuadren.
5. Un script valida el JSON (que la estructura esté bien, que no haya identificadores repetidos y que cada pregunta tenga fuente y explicación), y después se publica la nueva versión.
6. La app se actualiza sola la próxima vez que se abra con conexión.

Si Fernando ve una pregunta mal, la marca en la app. Las marcas se exportan junto con el progreso, o las cuenta en el chat, y se corrigen.

### Dónde se aloja

Para instalarla en el móvil hace falta un sitio con HTTPS. Queda por decidir con Fernando, porque supone publicar fuera:

- **GitHub Pages con el repo público**: no pide cuenta nueva, porque ya tiene GitHub (femarsito), pero el código, los resúmenes y las preguntas quedan públicos. En GitHub gratis, Pages no funciona con repos privados (*pendiente de verificar*).
- **Cloudflare Pages con el repo privado**: pide registrarse en Cloudflare. Quien tenga el enlace puede abrir la web, pero el repo no es público.

### Calidad y pruebas

- Pruebas unitarias del repaso espaciado, la racha, los puntos y el validador de contenido.
- Lint y formato del proyecto, sin code smells evidentes para SonarQube.
- Una prueba a mano en el móvil de Fernando: instalarla, quitar la conexión y estudiar una lección.

## Decisiones técnicas (las toma Claude)

- **Angular con TypeScript y `@angular/pwa`** (service worker para funcionar sin conexión), porque es el stack de Fernando. El runner de tests es el que traiga por defecto la versión de Angular instalada (*pendiente de verificar* si es Karma o Vitest).
- El repo es `C:\Users\ferma\Desktop\Claude_Code\estudia-iabd`, con su propio git. En la bóveda va solo la nota del proyecto.
- **Primera entrega**: la app completa, el flujo de contenido (guía, instrucciones de los agentes y validador) y el contenido revisado de SAA UD1 y UD2, que ya tienen texto y cuya tarea 2 y examen de práctica sirven de referencia. El resto de unidades se añade después, una por una con el mismo flujo, empezando por SBD UD2 cuando llegue su PDF. El índice incluye desde el principio todas las unidades conocidas de los cinco módulos, y las que no tienen contenido salen como «próximamente».
- Las preguntas del examen de práctica de Moodle no se copian tal cual: sirven de modelo del estilo.

## Lo que se deja al que lo construya

- Nombres de componentes y servicios y la organización interna del proyecto Angular.
- La forma exacta del JSON de contenido, siempre que cumpla lo que se dice arriba.
- Las animaciones concretas y la paleta, dentro de la dirección que salga de impeccable.
