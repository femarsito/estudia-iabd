import { ContentIndex, Unit } from './models';

export interface LessonRef {
  unitId: string;
  lessonId: string;
}

/** Primera lección sin hacer, siguiendo el orden del índice; null si todo lo disponible está hecho. */
export function nextLesson(index: ContentIndex, units: Map<string, Unit>, done: Record<string, number>): LessonRef | null {
  for (const ref of index.modules.flatMap((m) => m.units)) {
    const lesson = units.get(ref.id)?.lessons.find((l) => !done[l.id]);
    if (lesson) return { unitId: ref.id, lessonId: lesson.id };
  }
  return null;
}
