import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudyStore } from './study.store';

describe('StudyStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
  });

  afterEach(() => vi.useRealTimers());

  it('«hoy» cambia solo al pasar la medianoche con la app abierta', () => {
    vi.setSystemTime(new Date(2026, 10, 21, 23, 59));
    const store = TestBed.inject(StudyStore);
    expect(store.today()).toBe('2026-11-21');
    vi.advanceTimersByTime(2 * 60_000);
    expect(store.today()).toBe('2026-11-22');
  });
});
