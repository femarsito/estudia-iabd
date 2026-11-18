# Estudia IABD

App para estudiar el Curso de Especialización en Inteligencia Artificial y Big Data
(FP a distancia, Junta de Andalucía): lecciones cortas para leer, preguntas tipo test,
repaso de las falladas, racha y puntos. Funciona sin conexión una vez instalada.

## Uso en local

```
npm start          # http://localhost:4200
npm test           # tests de la app (Vitest, via ng test)
npm run test:content
npm run validate   # comprueba los JSON de public/content
```

Tests: Vitest con el builder `@angular/build:unit-test`. Para una pasada sin modo vigilancia: `npx ng test --watch=false`.

## Añadir una unidad

Ver `docs/contenido/`: la guía de estilo, las instrucciones del agente que escribe y del que revisa,
y el script para sacar las páginas de los PDF hechos con capturas.

## Licencias

Código: MIT (`LICENSE`). Contenido: CC BY-NC-SA 4.0 (`LICENSE-CONTENIDO`).
