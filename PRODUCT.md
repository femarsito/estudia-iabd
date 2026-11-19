# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Una sola persona: Fernando, alumno del Curso de Especialización en Inteligencia Artificial y Big Data (FP a distancia, Junta de Andalucía). Estudia solo y a ratos, sobre todo desde el móvil y a veces sin conexión (fuera de casa, con el PC apagado). Lo que quiere es repasar y entender el temario de cinco módulos (BDA, MIA, PIA, SAA y SBD) de forma más interactiva que leyendo PDF de 50 a 80 páginas.

## Product Purpose

Estudia IABD convierte los apuntes del curso en lecciones de 5 a 10 minutos: un resumen corto para leer y una práctica con preguntas del estilo de los exámenes de práctica de Moodle (test a-d, verdadero o falso y leer código). Lo fallado vuelve en un repaso diario hasta que se sabe. Hay racha y puntos, sin vidas ni bloqueos, y los ejercicios que se hacen en el ordenador (Colab, mongosh, Proxmox, Hadoop) vienen marcados y explicados. Se mide el éxito en que Fernando estudie a menudo, entienda el temario y llegue preparado a las pruebas presenciales (febrero, voluntaria, y junio, obligatoria).

## Positioning

Es una app hecha a partir de sus propios apuntes del curso. Cada pregunta dice de qué apartado sale y cada unidad sigue la estructura de los apuntes. Además funciona entera sin conexión y sin depender de ninguna IA.

## Operating Context

- Ratos sueltos en el móvil: transporte, descansos o antes de dormir. Sesiones cortas que se pueden cortar a la mitad.
- En el PC, para las prácticas 💻 y para sesiones más largas.
- Se instala como PWA desde el navegador en Android, iPhone y PC.
- Las unidades llegan poco a poco durante el curso. Las que aún no están salen como «próximamente».

## Capabilities and Constraints

- Lecciones de tres tipos: Lee (tarjetas), Practica (preguntas) y 💻 PC (pasos para hacer en el ordenador).
- Tipos de pregunta: test con 4 opciones, verdadero o falso, código (test sobre un fragmento), relacionar parejas, ordenar pasos y hueco.
- Repaso espaciado (Leitner, 5 cajas, intervalos de 1, 2, 4, 8 y 16 días) con un máximo de 15 preguntas al día.
- Examen de unidad (10 preguntas) y simulacro de módulo (25 preguntas, nota sobre 10).
- El progreso se guarda en el dispositivo y se exporta e importa como archivo.
- Sin cuentas, sin servidor, sin ranking y sin nada social.
- Stack: Angular 21 con PWA, alojado en GitHub Pages.

## Brand Commitments

- Nombre: **Estudia IABD**.
- Textos en español de España y de tú, claros y sin jerga sin explicar.
- Que no agobie: sin vidas, sin castigos y sin notificaciones insistentes.
- La interfaz tiene que quedar muy bonita (es lo que más le importa a Fernando), con identidad propia y sin copiar el aspecto de Duolingo.

## Evidence on Hand

- Contenido: apuntes de la Junta de Andalucía bajo CC BY-NC-SA. Los resúmenes y las preguntas de `public/content/` son obra derivada y llevan la misma licencia.
- Mapas conceptuales de algunas unidades (por ejemplo `public/content/img/saa-ud01-mapa.png`).
- No hay logotipo, testimonios ni datos de uso, y no se inventan.

## Product Principles

1. Poco y a menudo: cada sesión cabe en un rato y deja algo aprendido.
2. Exacto antes que abundante: una pregunta mal enseña algo falso.
3. Motivar sin castigar: el error solo devuelve la pregunta al repaso.
4. Siempre disponible: sin conexión y sin depender de nadie.
5. Fiel al curso: misma estructura, mismo estilo de pregunta y la fuente a la vista.

## Accessibility & Inclusion

Uso con una mano en el móvil: botones de al menos 44 px, contraste AA y respeto de «reducir movimiento». El texto tiene que leerse bien en pantallas pequeñas y con el modo oscuro.
