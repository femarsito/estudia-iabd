---
name: Estudia IABD
description: La carpeta de anillas del curso; cada módulo es un separador a todo color y el estudio va en una hoja encima.
colors:
  saa-ultramar: "#2f5bea"
  sbd-verde-azulado: "#0b7f70"
  mia-violeta: "#7b3fe4"
  pia-naranja: "#ff6a1a"
  bda-amarillo: "#f2c200"
  tinta: "#121418"
  tinta-suave: "#4a5060"
  hoja: "#fafbff"
  hoja-translucida: "rgb(250 251 255 / 0.95)"
  regla: "rgb(18 20 24 / 0.14)"
  acierto: "#2e9e4f"
  acierto-lavado: "#e3f4e8"
  errata: "#e5322d"
  errata-lavado: "#fde6e5"
  nav-apagado: "#9aa1ae"
  tinta-noche: "#eef0f5"
  tinta-suave-noche: "#a9afbd"
  hoja-noche: "#181a20"
typography:
  display:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "clamp(34px, 9vw, 56px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 82"
  headline:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 82"
  title:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.05
    fontVariation: "'wdth' 82"
  body:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "'tnum'"
  reading:
    fontFamily: "Literata Variable, Georgia, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 800
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 85"
  meta:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  code: "4px"
  leaf: "6px"
  tab: "8px"
  button: "10px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
components:
  button-primary:
    backgroundColor: "{colors.saa-ultramar}"
    textColor: "{colors.hoja}"
    typography: "{typography.title}"
    rounded: "{rounded.button}"
    padding: "0 24px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.button}"
    padding: "0 24px"
    height: "48px"
  leaf:
    backgroundColor: "{colors.hoja-translucida}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.leaf}"
    padding: "24px 24px 24px 56px"
  answer-option:
    backgroundColor: "{colors.hoja}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.button}"
    padding: "12px 16px"
    height: "52px"
  answer-option-ok:
    backgroundColor: "{colors.acierto-lavado}"
    textColor: "{colors.tinta}"
  answer-option-ko:
    backgroundColor: "{colors.errata-lavado}"
    textColor: "{colors.tinta}"
  tab-rail-tab:
    backgroundColor: "{colors.saa-ultramar}"
    textColor: "{colors.hoja}"
    typography: "{typography.label}"
    rounded: "{rounded.tab}"
    width: "34px"
  tab-rail-tab-current:
    width: "44px"
  nav-bar:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.nav-apagado}"
    height: "68px"
---

# Design System: Estudia IABD

## Overview

**Creative North Star: "La carpeta de anillas"**

La app es la carpeta del curso. El fondo de la pantalla es el separador del módulo activo, a todo color y a sangre; lo que se estudia va siempre en una hoja color leche encima, con la franja de encuadernación y dos agujeros de anilla en el canto izquierdo. Al cambiar de módulo, la hoja bascula en sus anillas en dos fotogramas y el separador cambia de color. Nada se desliza ni se difumina.

Es una interfaz densa pero tranquila, pensada para ratos cortos con el móvil en una mano. El color lo pone el módulo y nada más; el resto es tinta sobre papel. Rechaza el aspecto de app de estudio genérica: fondo blanco, tarjetas grises y un verde de acierto como único color.

La hoja manda: toda pantalla tiene al menos una, y todo texto largo vive dentro de ella. Sobre el separador solo van el título de la pantalla, la marca, la racha y los puntos, y las barras de avance de lección y test.

**Key Characteristics:**
- Fondo de pantalla igual al color del módulo activo, a plena intensidad.
- Hojas translúcidas con franja de encuadernación y dos agujeros de anilla.
- Regla de pestañas vertical pegada al canto derecho de la hoja; la pestaña del módulo actual sobresale.
- Archivo condensado y muy negro para títulos y cifras; Literata para leer tarjetas.
- Movimiento por pasos (`steps()`), nunca por interpolación suave.
- Iconos propios de trazo, sin emojis.

## Colors

Cinco separadores saturados que se turnan como fondo, una tinta casi negra, una hoja casi blanca y dos colores de corrección reservados.

### Primary
- **Ultramar SAA** (saa-ultramar): separador de Sistemas de Aprendizaje Automático y valor por defecto de `--board`. Texto blanco encima.
- **Verde azulado SBD** (sbd-verde-azulado): separador de Sistemas de Big Data. Se oscureció respecto al #0f9d8a del contrato de dirección porque el blanco sobre #0f9d8a se queda en unos 3,4:1; sobre #0b7f70 llega a unos 4,9:1. Texto blanco encima.
- **Violeta MIA** (mia-violeta): separador de Modelos de Inteligencia Artificial. Texto blanco encima.
- **Naranja óxido PIA** (pia-naranja): separador de Programación de Inteligencia Artificial. Texto en tinta encima, porque el blanco no llega a 4,5:1.
- **Amarillo cromo BDA** (bda-amarillo): separador de Big Data Aplicado. Texto en tinta encima, por la misma razón.

Los cinco viven como `--mod-*` y el activo se copia a `--board`; botones, puntos de avance, opción marcada, agujeros de anilla y la barra de la meta usan siempre `--board`, nunca un color de módulo fijo. `--on-board` es blanco salvo en PIA y BDA, donde pasa a tinta.

### Tertiary
- **Verde hierba** (acierto): solo para el acierto: borde y agujero de la opción correcta, sello de aprobado, contador de repaso vacío. Su lavado (acierto-lavado) es el fondo de la opción o la ficha correcta.
- **Bermellón de fe de erratas** (errata): solo para el fallo y los avisos de error. Su lavado (errata-lavado) es el fondo de la opción fallada y de la alerta de carga.

### Neutral
- **Tinta** (tinta): texto principal, contorno de foco, barra de navegación y fondo de los bloques de código.
- **Tinta suave** (tinta-suave): metadatos, subtítulos, ejes y créditos.
- **Hoja** (hoja / hoja-translucida): la hoja translúcida al 95 % es la superficie de estudio; la versión sólida se usa para opciones, fichas y el aviso de repaso.
- **Regla** (regla): tinta al 14 %. Franja de encuadernación, contornos de opciones y controles, pistas vacías de barras y separadores finos.
- **Gris de navegación** (nav-apagado): etiquetas inactivas de la barra de navegación sobre tinta.

### Tema oscuro (sin verificar)
Definido en código pero sin comprobar con capturas. Sigue el sistema o se fuerza en Ajustes. El separador del fondo se mezcla al 38 % con #0b0c10 para no deslumbrar de noche sin perder su tono; la tinta pasa a tinta-noche, la tinta suave a tinta-suave-noche, la hoja a hoja-noche (al 95 %), la regla a tinta-noche al 14 % y los lavados de acierto y fallo a #15301f y #3a1716. Botones, pestañas y agujeros siguen usando el color de módulo sin mezclar.

### Named Rules
**La regla del separador.** El color de módulo cubre el fondo entero o no aparece; dentro de la hoja solo entra como acento funcional a través de `--board` (botón, marca, progreso), nunca como relleno decorativo.

**La regla de la tinta sobre claros.** Sobre naranja y amarillo el texto va en tinta; sobre ultramar, verde azulado y violeta, en blanco. Cualquier color de módulo nuevo se prueba contra 4,5:1 antes de decidir cuál lleva.

**La regla de la fe de erratas.** El verde y el bermellón significan acierto y fallo y nada más. No sirven para decorar, ni para estados de navegación, ni para resaltar.

## Typography

**Display Font:** Archivo Variable con eje de anchura (con system-ui de reserva)
**Body Font:** Archivo Variable
**Reading Font:** Literata Variable (con Georgia de reserva)
**Code Font:** ui-monospace, Cascadia Mono, Consolas

**Character:** Archivo condensado al 80-90 % y en peso 800 da títulos de rótulo de carpeta, compactos y con presencia; Literata, más abierta, hace de página de apuntes para leer las tarjetas sin cansar. Las dos están autoalojadas con @fontsource-variable (Archivo con el eje `wdth`) para que la app funcione sin conexión.

### Hierarchy
- **Display** (800, clamp(34px, 9vw, 56px), 1.05, anchura 82 %): título de la lección en Inicio.
- **Headline** (800, 40px, anchura 82 %): título de pantalla sobre el separador (Módulos, Progreso, Ajustes). Las cabeceras de módulo y unidad usan clamp entre 30 y 48 px.
- **Title** (800, 22px, anchura 82 %): títulos de sección dentro de la hoja y leyendas de formulario.
- **Body** (400, 17px, 1.45): interfaz y opciones de respuesta. Cifras tabulares en todo el cuerpo.
- **Reading** (400, 19px, 1.6, máximo 62ch): cuerpo de las tarjetas de lectura.
- **Label** (800, 14px, 0.06em, anchura 85 %): códigos de módulo en las pestañas (SAA, SBD...). Son siglas, no texto puesto en mayúsculas.
- **Meta** (400, 15px, tinta suave): datos secundarios; baja a 13-14 px en créditos y ejes.
- **Cifra grande** (800, clamp(56px, 16vw, 88px), anchura 75 %, 0.9): nota del resultado.
- La marca «Estudia IABD» es la única excepción en ancho: 800, 22px, anchura 115 %.

### Named Rules
**La regla del rótulo condensado.** Todo título va en Archivo 800 condensado (entre 75 % y 92 %) con interlineado apretado y `text-wrap: balance`. El ancho normal o expandido queda para el cuerpo y la marca.

**La regla de la página de apuntes.** Literata aparece solo en el texto largo de las tarjetas. Ni botones, ni títulos, ni metadatos.

## Layout

Una columna sobre el separador con la regla de pestañas a la derecha, pegada al canto de la hoja con 6 px de separación. En móvil el marco mide hasta 780 px, con 16 px de margen izquierdo y hueco abajo para la barra de navegación fija (68 px más el área segura). La regla de pestañas es pegajosa y arranca 60 px por debajo del borde superior.

A partir de 900 px la navegación pasa a un riel lateral de 96 px y el marco se ensancha a 1180 px con 32 px de margen. Solo Inicio usa la carpeta abierta a dos hojas (a partir de 1100 px, columnas 3:2: la lección a la izquierda; el repaso de hoy y lo que viene, a la derecha). El resto de pantallas usan una sola hoja de 760 px con la regla de pestañas pegada a su canto.

El ritmo sale de una escala de 4 px (4, 8, 12, 16, 24, 32, 48). Dentro de la hoja los bloques se separan 16 px; las secciones de resultado y la lista de módulos, 24 px.

### Named Rules
**La regla de la carpeta abierta.** Dos hojas lado a lado solo en Inicio y solo en escritorio. Una pantalla nueva empieza con una sola hoja de 760 px.

**La regla del canto.** La regla de pestañas siempre toca la hoja. Si el marco cambia de ancho, la regla se mueve con la hoja, no con la ventana.

## Elevation & Depth

Sistema híbrido y físico: las hojas y los separadores de la lista de módulos tienen una sombra de papel apoyado; todo lo que va dentro de la hoja es plano y se dibuja con contornos interiores (`inset`) en vez de bordes. Los agujeros de anilla son la única profundidad hundida.

### Shadow Vocabulary
- **Papel apoyado** (`0 1px 1px rgb(0 0 0 / 0.08), 0 10px 24px -12px rgb(0 0 0 / 0.35)`): hojas, aviso de repaso y separadores de Módulos. En oscuro sube a `0 1px 1px rgb(0 0 0 / 0.3), 0 12px 28px -12px rgb(0 0 0 / 0.7)`.
- **Agujero de anilla** (`inset 0 1px 3px rgb(0 0 0 / 0.45), 0 0 0 3px` tinta al 9 %): los dos agujeros de cada hoja, rellenos del color del separador.
- **Contorno de ficha** (`inset 0 0 0 2px` regla; 3px en `--board`, acierto o errata cuando está marcada): opciones, controles segmentados, insignias y botón fantasma.
- **Pestaña actual** (`inset 3px 0 0 rgb(255 255 255 / 0.45), 2px 2px 8px rgb(0 0 0 / 0.2)`): la pestaña del módulo activo en la regla.

### Named Rules
**La regla del contorno interior.** Dentro de la hoja no hay `border`; los límites se dibujan con `box-shadow: inset`, así el grosor puede pasar de 2 a 3 px al marcar sin mover el contenido.

## Shapes

Esquinas poco redondeadas, de material de oficina: hoja de 6 px, botones y opciones de 10 px, pestañas de 8 px redondeadas solo por fuera, código en línea de 4 px. Los separadores de Módulos llevan la esquina superior izquierda recta, porque de ahí sale su pestaña. Los agujeros de anilla, los puntos de avance de la unidad y los números de paso son círculos. La franja de encuadernación es una línea de 1 px a 38 px del canto izquierdo; los agujeros, de 16 px, van a 44 y 124 px de arriba, a paso fijo que no se alinea con ninguna línea de texto.

## Components

### Buttons
Grandes, gruesos y del color del separador.
- **Shape:** esquinas suaves (10px), alto mínimo de 48 px.
- **Primary:** fondo `--board`, texto `--on-board`, Archivo 800 a 19 px y anchura 90 %, 0 24px de relleno. El botón principal de cada hoja va a lo ancho (Seguir, Comprobar, Hecho).
- **Hover / Focus:** brillo al 106 % al pasar; al pulsar baja 1 px. Foco con contorno de tinta de 3 px separado 2 px. Transiciones en dos pasos de 90 ms.
- **Ghost:** transparente, texto en tinta, contorno interior de 2 px en regla. Para la acción secundaria (Atrás).
- **Disabled:** opacidad 0,45.
- **Copiar código:** botón pequeño en gris oscuro (#2a2e37) con texto blanco, de 44 px de alto, encima del bloque de código.

### Cards / Containers
- **La hoja:** fondo hoja translúcida, esquinas de 6 px, sombra de papel apoyado, relleno 24px y 56px a la izquierda para dejar sitio a la franja y los agujeros. Entra con la báscula (`hinge-in`).
- **Aviso de repaso:** hoja sólida sin franja ni agujeros, 64 px de alto mínimo, título condensado a 20 px y contador a 22 px.
- **Nota de PC:** franja de `--board` al 14 % dentro de la hoja, con el icono de pantalla y una frase en 700. La herramienta concreta de cada paso (Colab, mongosh...) se nombra dentro de la frase del paso.
- **Bloque de código:** fondo tinta, texto #eef0f5, 14 px, 1.5 de interlineado, se desplaza en horizontal sin ensanchar la hoja.

### Inputs / Fields
- **Opción de respuesta (ficha perforada):** hoja sólida, 52 px de alto mínimo, contorno interior de 2 px en regla y un agujero de 18 px a la izquierda. Al pasar, el contorno toma `--board` al 60 %; al marcarla, contorno de 3 px en `--board` y el agujero se rellena.
- **Corregida:** contorno de 3 px y agujero en acierto o errata, fondo en su lavado e icono de check o cruz.
- **Control segmentado (Ajustes):** fichas de 48 px con contorno de regla; la elegida lleva 3 px de `--board` y fondo `--board` al 12 %.

### Navigation
- **Barra inferior en tinta:** cuatro entradas (Inicio, Módulos, Progreso, Ajustes) con icono y etiqueta de 12 px en 700. Inactivas en gris de navegación; la activa en blanco con el icono en el color del separador, aclarado. Siempre tinta, también en tema oscuro.
- **Escritorio:** la misma barra pasa a riel lateral de 96 px con filas de 84 px.

### Regla de pestañas (componente propio)
Una pestaña vertical por módulo, de 34 px de ancho, con texto girado y la sigla en Label. La altura es 48 px más 24 px por unidad, así que la regla dibuja el tamaño del temario. La pestaña del módulo activo crece a 44 px y lleva un canto blanco y sombra. Blanco sobre SAA, SBD y MIA; tinta sobre PIA y BDA.

### Separadores de Módulos (componente propio)
Cada módulo es un separador a todo color con su pestaña arriba, escalonada un 17 % por posición como en una carpeta real. El actual lleva un canto interior de 3 px (blanco al 55 % o tinta al 35 %) que sigue también por su pestaña.

### Sello de resultado (componente propio)
Rótulo condensado a 22 px con contorno de 3 px en acierto o errata, girado −3° y estampado en tres pasos de 180 ms.

### Iconos
Propios, en `app-icon`: rejilla de 24, trazo 2, extremos y uniones redondos, `currentColor`, 22 px por defecto. Nada de emojis ni glifos tipográficos como icono.

## Do's and Don'ts

### Do:
- **Do** pinta el fondo de la pantalla con `--board` y pon el contenido en una hoja (`.leaf`) con su franja y sus dos agujeros.
- **Do** usa `--board` y `--on-board` para todo acento del módulo, de modo que PIA y BDA cambien solos a texto en tinta.
- **Do** comprueba 4,5:1 del texto sobre cada separador; por eso SBD es #0b7f70 y no #0f9d8a.
- **Do** anima con `steps()` y la duración de 90 ms (`--hinge`); con «reducir movimiento» todo cambia al instante.
- **Do** usa iconos SVG de `app-icon` (trazo 2, rejilla de 24).
- **Do** deja una sola hoja de 760 px en pantallas nuevas; la carpeta abierta a dos hojas es solo de Inicio.
- **Do** nombra la herramienta de un paso de PC dentro de la frase del paso.

### Don't:
- **Don't** pongas el texto largo directamente sobre el separador; sobre el color solo van títulos de pantalla, marca, racha, puntos y barras de avance.
- **Don't** uses el verde y el bermellón para nada que no sea acierto y fallo.
- **Don't** pongas un rótulo pequeño en mayúsculas encima de los títulos (kicker o eyebrow); el contexto va en la línea de metadatos debajo.
- **Don't** uses emojis en la interfaz.
- **Don't** cargues fuentes desde un CDN; van autoalojadas para funcionar sin conexión.
- **Don't** uses deslizamientos, fundidos ni curvas suaves para cambiar de pantalla o de módulo.
- **Don't** pongas texto blanco sobre naranja o amarillo.
