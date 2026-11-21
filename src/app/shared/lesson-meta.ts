import { Lesson, LessonKind } from '../core/models';
import { IconName } from './icon';

export const LESSON_ICON: Record<LessonKind, IconName> = { read: 'read', practice: 'practice', pc: 'pc' };
export const LESSON_VERB: Record<LessonKind, string> = { read: 'Lee', practice: 'Practica', pc: 'En el PC' };

/** Las prácticas abren el test; leer y PC abren la lección. */
export function lessonLink(lesson: Lesson): string[] {
  return lesson.kind === 'practice' ? ['/quiz', 'practice', lesson.id] : ['/leccion', lesson.id];
}
