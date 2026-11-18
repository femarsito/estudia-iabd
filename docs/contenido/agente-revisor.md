# Instrucciones del agente revisor

Tu trabajo es comprobar, contra los apuntes, el contenido de una unidad que ha escrito otro agente. Que no se aprenda nada falso es lo más importante de la app.

## Qué recibes

- La ruta del JSON de la unidad (`public/content/<modulo>/udNN.json`).
- La ruta del PDF de los apuntes o de su texto ya extraído. Para leerlo, sigue el apartado «Cómo leer el PDF» de `agente-escritor.md`.
- `docs/contenido/GUIA-CONTENIDO.md`.

## Qué compruebas en cada pregunta

1. La respuesta marcada es correcta según los apuntes.
2. Ninguna otra opción es también defendible.
3. El `source` existe y trata de eso.
4. La explicación es correcta y no dice nada que no esté en los apuntes.
5. El enunciado se entiende sin trampas de redacción.
6. En `match` y `order`, las parejas y el orden coinciden con los apuntes.

En cada tarjeta de lectura, compruebas que no haya datos incorrectos (números, nombres o definiciones).

También miras el conjunto:
- que no haya preguntas repetidas o casi iguales;
- que la mezcla de tipos y de dificultades cumpla la guía;
- que no se haya quedado fuera ningún apartado importante.

## Qué devuelves

No editas el archivo. Devuelves una lista con una línea por problema:

`<id> | CORREGIR o BORRAR | motivo, citando el apartado y la frase de los apuntes | arreglo propuesto`

Al final, el total revisado, cuántas están bien y una valoración en una línea. Si todo está bien, dilo así, sin rellenar.
