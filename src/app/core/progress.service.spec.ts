import { TestBed } from '@angular/core/testing';
import { ProgressService, STORAGE_KEY } from './progress.service';
import { serializeProgress } from './progress-codec';

describe('ProgressService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  afterEach(() => vi.restoreAllMocks());

  const create = () => TestBed.inject(ProgressService);

  it('con datos rotos arranca vacío, avisa y guarda una copia de lo roto', () => {
    localStorage.setItem(STORAGE_KEY, '{roto');
    const svc = create();
    expect(svc.progress().answers).toEqual([]);
    expect(svc.loadError()).not.toBeNull();
    const backupKey = Object.keys(localStorage).find((k) => k.startsWith(`${STORAGE_KEY}:roto:`));
    expect(backupKey && localStorage.getItem(backupKey)).toBe('{roto');
  });

  it('con datos rotos y sin espacio para la copia, arranca igualmente', () => {
    localStorage.setItem(STORAGE_KEY, '{roto');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('lleno', 'QuotaExceededError');
    });
    const svc = create();
    expect(svc.progress().answers).toEqual([]);
    expect(svc.loadError()).not.toBeNull();
  });

  it('recordAnswer guarda en localStorage', () => {
    create().recordAnswer('saa-ud01-q001', true, 4000);
    expect(localStorage.getItem(STORAGE_KEY)).toContain('saa-ud01-q001');
  });

  it('importar algo que no es un progreso no cambia nada', () => {
    const svc = create();
    svc.recordAnswer('a', true, 1000);
    expect(svc.importText('hola')).toBe('invalid');
    expect(svc.progress().answers.length).toBe(1);
  });

  it('importar el propio export no duplica nada', () => {
    const svc = create();
    svc.recordAnswer('a', true, 1000);
    svc.completeLesson('saa-ud01-l01');
    expect(svc.importText(serializeProgress(svc.progress()))).toBe('ok');
    expect(svc.progress().answers.length).toBe(1);
  });

  it('si no queda espacio avisa y sigue funcionando en memoria', () => {
    const svc = create();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('lleno', 'QuotaExceededError');
    });
    svc.recordAnswer('a', true, 1000);
    expect(svc.progress().answers.length).toBe(1);
    expect(svc.loadError()).toContain('espacio');
  });
});
