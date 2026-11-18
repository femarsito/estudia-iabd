# Guía de contenido

Esta guía es la referencia para escribir y revisar el contenido de cada unidad. Quien estudia es un alumno de FP a distancia que repasa a ratos, muchas veces desde el móvil. El contenido tiene que ser corto, exacto y salir de los apuntes.

## Reglas que no se saltan

- Todo sale de los apuntes de la unidad. Si algo no está en los apuntes, no entra, aunque sea verdad.
- Cada pregunta tiene una sola respuesta correcta según los apuntes. Si hay dos defendibles, se reescribe o se descarta.
- Cada pregunta lleva `source` con el apartado exacto: «SAA UD2, apartado 3.1». Usa la numeración de los apuntes.
- Antes de empezar, comprueba la licencia en el pie de la unidad («Condiciones y términos de uso de los materiales»). Si no es Creative Commons BY-NC-SA, para y avisa.
- No se copian las preguntas de los exámenes de práctica de Moodle ni de las autoevaluaciones. Sirven de modelo del estilo y del nivel.

## Archivo de la unidad

`public/content/<modulo>/udNN.json` con la forma de `src/app/core/models.ts` (`Unit`).

- `id` de la unidad: `<modulo>-udNN`, por ejemplo `saa-ud02`.
- `id` de las lecciones: `<unidad>-lNN` (`saa-ud02-l03`).
- `id` de las preguntas: `<unidad>-qNNN` (`saa-ud02-q041`). Una vez publicados, los ids no se cambian ni se reutilizan, porque el progreso guardado depende de ellos. Si una pregunta se borra, su número se queda sin usar.
- `conceptMap`: si hay mapa conceptual de la unidad, la imagen va en `public/content/img/<unidad>-mapa.png`, con `credit: "Mapa conceptual de los apuntes de <MÓDULO> UD<N>, Junta de Andalucía (CC BY-NC-SA)"`.

## Estructura de lecciones

Sigue los apartados de los apuntes. Por cada apartado principal:

1. Una lección `read` («Lee») con 3 a 6 tarjetas.
2. Una lección `practice` («Practica») con 8 a 12 preguntas de ese apartado.

Las prácticas de PC (Colab, mongosh, Proxmox, Hadoop…) van en lecciones `pc` con sus pasos. Si se pueden comprobar con preguntas, se añade una práctica justo después. Todas las preguntas tienen que aparecer en alguna lección `practice`.

## Tarjetas (lecciones «Lee»)

- De unas 60 palabras como mucho. Una idea por tarjeta.
- `title` corto. `body` admite `**negrita**`, `` `código` `` y listas con líneas que empiezan por `- `. Nada más.
- Primero la idea y luego el detalle o el ejemplo. Nada de introducciones («En este apartado veremos…»).
- Lo que suele caer en el examen va en **negrita**: definiciones, diferencias, números (tamaños, límites, porcentajes) y nombres de funciones o comandos.

## Preguntas

Cantidad: entre 50 y 100 por unidad, según lo que dé el temario. No se rellena: mejor 55 buenas que 100 con repetidas.

Mezcla aproximada:
- 60 % `choice` (test con 4 opciones). Un 15 % de ellas, más o menos, con `code`: un trozo de código y la pregunta de qué hace, si está bien o qué falta. En las unidades sin código, se cambian por preguntas de aplicar el concepto a un caso.
- 20 % `truefalse`.
- 10 % `match` (de 3 a 5 parejas concepto ↔ definición).
- 10 % `order` (de 3 a 6 pasos de un proceso que en los apuntes tiene orden).

Para un hueco, un `choice` con `___` en el `prompt`.

Estilo, el de los exámenes de práctica del curso:
- enunciado corto y directo, en español de España y de tú;
- preguntas de concepto («¿Qué indica la diagonal principal de la matriz de confusión?»), de aplicar a un caso («¿Qué tamaño tiene la matriz si hay 4 clases?») y de leer código;
- distractores creíbles, sacados de confusiones reales del tema (regresión frente a clasificación, train frente a test, 0-1 frente a 0-100…). Nada de opciones absurdas;
- las 4 opciones con longitud y forma parecidas, para que la buena no se note por ser la más larga;
- «Todas son correctas» y «Ninguna es correcta» solo cuando de verdad aporten, y como mucho en el 5 % de las preguntas;
- no hay negaciones dobles ni trampas de redacción.

`explanation`: dos o tres frases de tú que digan por qué es la buena y, si ayuda, por qué la trampa típica no lo es. No repitas el enunciado.

`difficulty`:
- 1, recordar un dato;
- 2, entender o comparar;
- 3, aplicar a un caso o leer código.

Que haya de las tres.

## Antes de entregar

1. Ejecuta `npm run validate` y comprueba que sale 0.
2. Revisa la mezcla de tipos y que todas las preguntas estén en alguna práctica.
3. Pasa el contenido al agente revisor (`agente-revisor.md`) y aplica lo que diga.
