import { addDays, localDay } from './dates';

describe('dates', () => {
  it('localDay usa la fecha local justo antes de medianoche', () => {
    expect(localDay(new Date(2026, 10, 18, 23, 59).getTime())).toBe('2026-11-18');
  });

  it('localDay cambia de día justo después de medianoche', () => {
    expect(localDay(new Date(2026, 10, 19, 0, 1).getTime())).toBe('2026-11-19');
  });

  it('addDays cruza el cambio de mes', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
  });

  it('addDays cruza el cambio de hora de marzo', () => {
    expect(addDays('2026-03-28', 2)).toBe('2026-03-30');
  });
});
