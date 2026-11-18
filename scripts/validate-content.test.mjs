import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateUnit, validateIndex } from './validate-content.mjs';

const q = (n, extra = {}) => ({
  id: `saa-ud01-q${String(n).padStart(3, '0')}`,
  type: 'choice',
  prompt: `Pregunta ${n}`,
  options: ['a', 'b', 'c', 'd'],
  answer: 1,
  explanation: 'Porque sí.',
  source: 'SAA UD1, apartado 1',
  difficulty: 1,
  ...extra,
});

const validUnit = () => ({
  id: 'saa-ud01',
  moduleId: 'saa',
  number: 1,
  title: 'Unidad',
  lessons: [
    { id: 'saa-ud01-l01', kind: 'read', title: 'Lee', section: '1', cards: [{ body: 'Texto' }] },
    { id: 'saa-ud01-l02', kind: 'practice', title: 'Practica', section: '1', questionIds: [1, 2, 3, 4, 5].map((n) => q(n).id) },
  ],
  questions: [1, 2, 3, 4, 5].map((n) => q(n)),
});

const ref = { id: 'saa-ud01', file: 'saa/ud01.json' };
const opts = { exists: () => true };

test('una unidad válida no tiene errores', () => {
  assert.deepEqual(validateUnit(validUnit(), ref, opts).errors, []);
});

test('detecta un id repetido', () => {
  const u = validUnit();
  u.questions[1].id = u.questions[0].id;
  assert.ok(validateUnit(u, ref, opts).errors.some((e) => e.includes(u.questions[0].id)));
});

test('detecta una respuesta fuera de las opciones', () => {
  const u = validUnit();
  u.questions[0].answer = 4;
  assert.ok(validateUnit(u, ref, opts).errors.some((e) => e.includes('answer')));
});

test('detecta una lección que apunta a una pregunta que no existe', () => {
  const u = validUnit();
  u.lessons[1].questionIds[0] = 'saa-ud01-q999';
  assert.ok(validateUnit(u, ref, opts).errors.some((e) => e.includes('saa-ud01-q999')));
});

test('detecta una explicación vacía', () => {
  const u = validUnit();
  u.questions[2].explanation = '  ';
  assert.ok(validateUnit(u, ref, opts).errors.some((e) => e.includes('explanation')));
});

test('detecta un mapa conceptual que no existe', () => {
  const u = { ...validUnit(), conceptMap: { src: 'img/no.png', credit: 'Junta' } };
  const errors = validateUnit(u, ref, { exists: () => false }).errors;
  assert.ok(errors.some((e) => e.includes('img/no.png')));
});

test('avisa (sin error) si una pregunta no está en ninguna práctica', () => {
  const u = validUnit();
  u.questions.push(q(6));
  const result = validateUnit(u, ref, opts);
  assert.deepEqual(result.errors, []);
  assert.ok(result.warnings.some((w) => w.includes('saa-ud01-q006')));
});

test('el índice exige módulos con unidades numeradas', () => {
  assert.deepEqual(validateIndex({ modules: [{ id: 'saa', code: 'SAA', name: 'x', color: '#000', units: [ref] }] }), [
    "saa-ud01: falta 'number' o 'title'",
  ]);
});
