export type ModuleId = 'bda' | 'mia' | 'pia' | 'saa' | 'sbd';

export interface ContentIndex {
  modules: ModuleInfo[];
}

export interface ModuleInfo {
  id: ModuleId;
  code: string;
  name: string;
  color: string;
  units: UnitRef[];
}

/** Sin `file`, la unidad sale como «próximamente». */
export interface UnitRef {
  id: string;
  number: number;
  title: string;
  file?: string;
}

export interface Unit {
  id: string;
  moduleId: ModuleId;
  number: number;
  title: string;
  conceptMap?: { src: string; credit: string };
  lessons: Lesson[];
  questions: Question[];
}

export type LessonKind = 'read' | 'practice' | 'pc';

export interface Lesson {
  id: string;
  kind: LessonKind;
  title: string;
  section: string;
  cards?: Card[];
  questionIds?: string[];
  steps?: PcStep[];
}

export interface Card {
  title?: string;
  body: string;
}

export interface PcStep {
  where: string;
  text: string;
  code?: string;
  expected?: string;
}

interface QBase {
  id: string;
  prompt: string;
  code?: string;
  explanation: string;
  source: string;
  difficulty: 1 | 2 | 3;
}

export interface ChoiceQ extends QBase {
  type: 'choice';
  options: string[];
  answer: number;
}

export interface TrueFalseQ extends QBase {
  type: 'truefalse';
  answer: boolean;
}

export interface MatchQ extends QBase {
  type: 'match';
  pairs: [string, string][];
}

export interface OrderQ extends QBase {
  type: 'order';
  steps: string[];
}

export type Question = ChoiceQ | TrueFalseQ | MatchQ | OrderQ;

export interface AnswerRecord {
  q: string;
  ok: boolean;
  at: number;
  ms: number;
}

export interface Settings {
  goalMinutes: 5 | 10 | 15;
  theme: 'system' | 'light' | 'dark';
}

export interface Progress {
  version: 1;
  answers: AnswerRecord[];
  lessonsDone: Record<string, number>;
  flags: Record<string, { at: number; note?: string }>;
  settings: Settings;
}

export interface QuestionState {
  box: 1 | 2 | 3 | 4 | 5;
  due: string;
  lastAt: number;
  lastOk: boolean;
}
