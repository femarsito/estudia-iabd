import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home').then((m) => m.Home), title: 'Estudia IABD' },
  { path: 'modulos', loadComponent: () => import('./features/modules/modules').then((m) => m.Modules), title: 'Módulos · Estudia IABD' },
  { path: 'modulo/:moduleId', loadComponent: () => import('./features/modules/module-page').then((m) => m.ModulePage) },
  { path: 'unidad/:unitId', loadComponent: () => import('./features/unit-path/unit-path').then((m) => m.UnitPath) },
  { path: 'leccion/:lessonId', loadComponent: () => import('./features/lesson/lesson-page').then((m) => m.LessonPage) },
  { path: 'quiz/:mode/:id', loadComponent: () => import('./features/quiz/quiz').then((m) => m.Quiz) },
  { path: 'resultado', loadComponent: () => import('./features/result/result').then((m) => m.Result), title: 'Resultado · Estudia IABD' },
  { path: 'progreso', loadComponent: () => import('./features/progress/progress-page').then((m) => m.ProgressPage), title: 'Progreso · Estudia IABD' },
  { path: 'ajustes', loadComponent: () => import('./features/settings/settings').then((m) => m.Settings), title: 'Ajustes · Estudia IABD' },
  { path: '**', redirectTo: '' },
];
