// Valida public/content: índice y unidades. Uso: node scripts/validate-content.mjs public/content
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MODULES = ['bda', 'mia', 'pia', 'saa', 'sbd'];
const KINDS = ['read', 'practice', 'pc'];
const blank = (s) => typeof s !== 'string' || s.trim() === '';

export function validateIndex(index) {
  const errors = [];
  if (!Array.isArray(index?.modules)) return ["index: falta 'modules'"];
  for (const m of index.modules) {
    if (!MODULES.includes(m.id)) errors.push(`index: módulo desconocido '${m.id}'`);
    if (blank(m.name) || blank(m.code) || blank(m.color)) errors.push(`${m.id}: falta 'name', 'code' o 'color'`);
    for (const u of m.units ?? []) {
      if (typeof u.number !== 'number' || blank(u.title)) errors.push(`${u.id}: falta 'number' o 'title'`);
    }
  }
  return errors;
}

function questionErrors(q) {
  const e = [];
  const at = (msg) => e.push(`${q.id}: ${msg}`);
  if (blank(q.prompt)) at("'prompt' vacío");
  if (blank(q.explanation)) at("'explanation' vacía");
  if (blank(q.source)) at("'source' vacío");
  if (![1, 2, 3].includes(q.difficulty)) at("'difficulty' debe ser 1, 2 o 3");
  switch (q.type) {
    case 'choice': {
      const n = q.options?.length ?? 0;
      if (n < 2 || n > 4) at('entre 2 y 4 opciones');
      if (new Set(q.options).size !== n) at('opciones repetidas');
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= n) at("'answer' fuera de las opciones");
      break;
    }
    case 'truefalse':
      if (typeof q.answer !== 'boolean') at("'answer' debe ser true o false");
      break;
    case 'match':
      if (!(q.pairs?.length >= 3 && q.pairs.length <= 5)) at('de 3 a 5 parejas');
      break;
    case 'order':
      if (!(q.steps?.length >= 3 && q.steps.length <= 6)) at('de 3 a 6 pasos');
      break;
    default:
      at(`tipo desconocido '${q.type}'`);
  }
  return e;
}

function lessonErrors(l, questionIds) {
  const e = [];
  const at = (msg) => e.push(`${l.id}: ${msg}`);
  if (!KINDS.includes(l.kind)) at(`tipo de lección desconocido '${l.kind}'`);
  if (blank(l.title)) at("'title' vacío");
  const cards = l.cards?.length ?? 0;
  const qs = l.questionIds?.length ?? 0;
  if (l.kind === 'read' && (cards < 1 || cards > 6)) at('una lección de leer lleva de 1 a 6 tarjetas');
  if (l.kind === 'practice' && (qs < 5 || qs > 12)) at('una práctica lleva de 5 a 12 preguntas');
  if (l.kind === 'pc' && !(l.steps?.length >= 1)) at('una práctica de PC lleva al menos un paso');
  for (const id of l.questionIds ?? []) if (!questionIds.has(id)) at(`la pregunta ${id} no existe`);
  return e;
}

function duplicateIds(ids) {
  const seen = new Set();
  return ids.filter((id) => seen.has(id) || !seen.add(id));
}

/** @returns {{errors: string[], warnings: string[]}} */
export function validateUnit(unit, ref, { exists }) {
  const errors = [];
  if (unit.id !== ref.id) errors.push(`${ref.file}: el id '${unit.id}' no coincide con el índice ('${ref.id}')`);
  const qIds = unit.questions.map((q) => q.id);
  const lIds = unit.lessons.map((l) => l.id);
  for (const id of duplicateIds([...qIds, ...lIds])) errors.push(`${id}: id repetido`);
  for (const id of qIds) if (!new RegExp(`^${unit.id}-q\\d{3}$`).test(id)) errors.push(`${id}: formato de id incorrecto`);
  for (const id of lIds) if (!new RegExp(`^${unit.id}-l\\d{2}$`).test(id)) errors.push(`${id}: formato de id incorrecto`);
  for (const q of unit.questions) errors.push(...questionErrors(q));
  const qSet = new Set(qIds);
  for (const l of unit.lessons) errors.push(...lessonErrors(l, qSet));
  if (unit.conceptMap && !exists(unit.conceptMap.src)) errors.push(`${unit.id}: no existe el mapa ${unit.conceptMap.src}`);

  const practiced = new Set(unit.lessons.filter((l) => l.kind === 'practice').flatMap((l) => l.questionIds ?? []));
  const warnings = qIds.filter((id) => !practiced.has(id)).map((id) => `${id}: no está en ninguna práctica`);
  return { errors, warnings };
}

function main(dir) {
  const read = (rel) => JSON.parse(readFileSync(join(dir, rel), 'utf8'));
  const index = read('index.json');
  const problems = validateIndex(index).map((e) => `index.json: ${e}`);
  const allIds = [];
  for (const ref of index.modules.flatMap((m) => m.units).filter((u) => u.file)) {
    const unit = read(ref.file);
    const { errors, warnings } = validateUnit(unit, ref, { exists: (src) => existsSync(join(dir, src)) });
    problems.push(...errors.map((e) => `${ref.file}: ${e}`));
    for (const w of warnings) console.warn(`aviso ${ref.file}: ${w}`);
    allIds.push(...unit.questions.map((q) => q.id), ...unit.lessons.map((l) => l.id));
  }
  problems.push(...duplicateIds(allIds).map((id) => `${id}: id repetido entre unidades`));
  for (const p of problems) console.error(p);
  console.log(problems.length ? `${problems.length} errores` : 'Contenido válido');
  return problems.length ? 1 : 0;
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv[2] ?? 'public/content'));
}
