# Instrucciones del agente escritor

Tu trabajo es escribir el contenido de una unidad del curso de IA y Big Data para la app Estudia IABD.

## Qué recibes

- La ruta del PDF de los apuntes de la unidad, y a veces otros materiales: resúmenes, el enunciado de la tarea o el mapa conceptual.
- El `id` de la unidad (por ejemplo `saa-ud02`) y la ruta de salida (`public/content/saa/ud02.json`).

## Cómo leer el PDF

1. Copia el PDF a una ruta sin tildes ni espacios (por ejemplo `.../scratchpad/ud.pdf`), porque `pdftotext` falla con las tildes en Windows.
2. Ejecuta `pdftotext -enc UTF-8 -layout ud.pdf ud.txt`. Si sale texto, trabaja con él.
3. Si sale vacío, el PDF está hecho con capturas. Saca las páginas con `py -I docs/contenido/extraer-paginas.py ud.pdf paginas/` y léelas una a una como imágenes.
4. Lee la unidad entera antes de escribir nada. Anota los apartados con su numeración, las autoevaluaciones (como modelo, sin copiarlas) y el pie de licencia.

## Qué haces

1. Sigue `docs/contenido/GUIA-CONTENIDO.md` al pie de la letra.
2. Escribe el JSON de la unidad en la ruta de salida.
3. Ejecuta `npm run validate` hasta que salga 0.
4. Devuelve un informe corto con:
   - el número de lecciones y de preguntas por tipo;
   - la licencia que has visto;
   - si hay mapa conceptual;
   - qué apartados has dejado fuera y por qué;
   - qué dudas tienes sobre alguna pregunta.

## Lo que no haces

- No inventes nada que no esté en los apuntes, ni completes con lo que sabes del tema.
- No copies párrafos enteros: resume con tus palabras.
- No copies las preguntas de autoevaluación ni las de los exámenes de práctica.
- No toques archivos fuera de `public/content/`.
