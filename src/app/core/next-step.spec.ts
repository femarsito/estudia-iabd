import { ContentIndex, Unit } from './models';
import { nextLesson } from './next-step';

const index: ContentIndex = {
  modules: [
    {
      id: 'saa',
      code: 'SAA',
      name: 'SAA',
      color: '#000',
      units: [
        { id: 'saa-ud01', number: 1, title: 'Uno', file: 'saa/ud01.json' },
        { id: 'saa-ud02', number: 2, title: 'Dos' },
      ],
    },
  ],
};

const unit = {
  id: 'saa-ud01',
  moduleId: 'saa',
  number: 1,
  title: 'Uno',
  lessons: [
    { id: 'saa-ud01-l01', kind: 'read', title: 'Lee', section: '1' },
    { id: 'saa-ud01-l02', kind: 'practice', title: 'Practica', section: '1' },
  ],
  questions: [],
} as unknown as Unit;

const units = new Map([['saa-ud01', unit]]);

describe('nextLesson', () => {
  it('sin nada hecho propone la primera lección de la primera unidad', () => {
    expect(nextLesson(index, units, {})).toEqual({ unitId: 'saa-ud01', lessonId: 'saa-ud01-l01' });
  });

  it('salta las lecciones hechas', () => {
    expect(nextLesson(index, units, { 'saa-ud01-l01': 1 })).toEqual({ unitId: 'saa-ud01', lessonId: 'saa-ud01-l02' });
  });

  it('devuelve null si todo lo disponible está hecho', () => {
    expect(nextLesson(index, units, { 'saa-ud01-l01': 1, 'saa-ud01-l02': 2 })).toBeNull();
  });
});
