---
version: 1
slug: "src-app-app-ts"
primary_target: "src/app/app.ts"
related_targets: []
---

# Surface brief: app shell y pantallas de estudio

Modo: Operate. Audiencia, trabajo y restricciones: ver PRODUCT.md.

## Direction contract

THESIS: La app es la carpeta de anillas del curso. Cada módulo es un separador de cartulina a todo color y lo que se estudia va en una hoja translúcida encima. Rechaza la app de estudio genérica: fondo blanco, tarjetas grises y un verde de acierto.

OWN-WORLD: El fondo es el color del módulo activo a plena intensidad. Son cinco tonos: SAA ultramar #2f5bea, SBD verde azulado #0f9d8a, MIA violeta #7b3fe4, PIA naranja óxido #ff6a1a y BDA amarillo cromo #f2c200. Encima va la hoja color leche, rgba(250,251,255,.94), con dos agujeros de anilla en el canto izquierdo. El bermellón #e5322d se reserva para la fe de erratas (fallo) y el verde hierba #2e9e4f para el acierto. La tinta es #121418. Tipografía Archivo de anchura variable (títulos en 80 %, cifras tabulares) y Literata para leer las tarjetas.

STORY: Abres la app, ves en qué separador estás y lo que toca, pulsas Seguir y acabas una hoja en 5 minutos. Lo fallado vuelve.

FIRST VIEWPORT: Arriba, sobre el separador, el nombre, la racha y los puntos. A la derecha, la regla de pestañas con los cinco módulos, cada una con una altura proporcional a sus unidades; la del módulo actual sobresale. En el centro, la hoja con la unidad, el título de la lección, la barra de la meta y el botón Seguir a lo ancho. Debajo de la hoja, el repaso de hoy. Navegación inferior en tinta (Inicio, Módulos, Progreso, Ajustes); en escritorio pasa a un riel lateral.

FORM: Reference manual with acetate tab board, adaptado como carpeta de anillas (challenger elegido, rw-manual-acetate-tab-board). seed:b8cc8b3affb603a9
Movimiento característico: al cambiar de módulo, la hoja bascula en sus agujeros en dos fotogramas de 90 ms y el separador cambia de color. Nada se desliza ni se difumina. Con «reducir movimiento», el cambio es instantáneo.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
