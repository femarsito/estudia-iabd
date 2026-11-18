import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContentService } from './content.service';
import { ContentIndex, Unit } from './models';

const index: ContentIndex = {
  modules: [
    {
      id: 'saa',
      code: 'SAA',
      name: 'Sistemas de Aprendizaje Automático',
      color: '#000',
      units: [
        { id: 'saa-ud01', number: 1, title: 'Uno', file: 'saa/ud01.json' },
        { id: 'saa-ud02', number: 2, title: 'Dos' },
      ],
    },
  ],
};

const unit = { id: 'saa-ud01', moduleId: 'saa', number: 1, title: 'Uno', lessons: [], questions: [] } as unknown as Unit;

describe('ContentService', () => {
  let svc: ContentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    svc = TestBed.inject(ContentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  /** Responde al índice cuando el servicio lo pida (lo pide en una microtarea). */
  const flushIndex = async () => {
    await Promise.resolve();
    http.expectOne('content/index.json').flush(index);
  };

  it('una unidad sin archivo está próximamente', async () => {
    const result = svc.unit('saa-ud02');
    await flushIndex();
    expect(await result).toBe('coming-soon');
  });

  it('un error al cargar la unidad la deja como no disponible', async () => {
    const result = svc.unit('saa-ud01');
    await flushIndex();
    await new Promise((r) => setTimeout(r));
    http.expectOne('content/saa/ud01.json').flush('no', { status: 404, statusText: 'Not Found' });
    expect(await result).toBe('unavailable');
  });

  it('carga la unidad y no la vuelve a pedir', async () => {
    const first = svc.unit('saa-ud01');
    await flushIndex();
    await new Promise((r) => setTimeout(r));
    http.expectOne('content/saa/ud01.json').flush(unit);
    expect(await first).toEqual(unit);
    expect(await svc.unit('saa-ud01')).toEqual(unit);
  });

  it('si el índice no carga, devuelve un índice vacío en vez de romper', async () => {
    const result = svc.index();
    await Promise.resolve();
    http.expectOne('content/index.json').error(new ProgressEvent('offline'));
    expect(await result).toEqual({ modules: [] });
  });
});
