import { TestBed } from '@angular/core/testing';
import { OrderQuestion } from './order-question';
import { OrderQ } from '../../../core/models';

const q: OrderQ = {
  id: 'saa-ud01-q002',
  type: 'order',
  prompt: 'Ordena',
  steps: ['uno', 'dos', 'tres'],
  explanation: 'e',
  source: 's',
  difficulty: 1,
};

function setup() {
  const fixture = TestBed.createComponent(OrderQuestion);
  fixture.componentRef.setInput('question', q);
  const emitted: boolean[] = [];
  fixture.componentInstance.answered.subscribe((r) => emitted.push(r.ok));
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const items = () => [...el.querySelectorAll<HTMLElement>('[data-step]')].map((li) => li.dataset['step']);
  /** Ordena pulsando «subir», como lo haría alguien con el dedo. */
  const sortWithButtons = (target: string[]) => {
    for (let pos = 0; pos < target.length; pos++) {
      while (items()[pos] !== target[pos]) {
        const from = items().indexOf(target[pos]);
        el.querySelectorAll<HTMLButtonElement>('[data-action="up"]')[from].click();
        fixture.detectChanges();
      }
    }
  };
  const check = () => {
    el.querySelector<HTMLButtonElement>('[data-action="check"]')!.click();
    fixture.detectChanges();
  };
  return { items, sortWithButtons, check, emitted };
}

describe('OrderQuestion', () => {
  it('empieza desordenada', () => {
    expect(setup().items()).not.toEqual(q.steps);
  });

  it('ordenar bien con los botones emite ok', () => {
    const { sortWithButtons, check, emitted } = setup();
    sortWithButtons(['uno', 'dos', 'tres']);
    check();
    expect(emitted).toEqual([true]);
  });

  it('en un examen no marca si has acertado', () => {
    const fixture = TestBed.createComponent(OrderQuestion);
    fixture.componentRef.setInput('question', q);
    fixture.componentRef.setInput('reveal', false);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    el.querySelector<HTMLButtonElement>('[data-action="check"]')!.click();
    fixture.detectChanges();
    expect(el.querySelectorAll('li.ok, li.ko').length).toBe(0);
  });

  it('un orden distinto emite fallo', () => {
    const { sortWithButtons, check, emitted } = setup();
    sortWithButtons(['tres', 'dos', 'uno']);
    check();
    expect(emitted).toEqual([false]);
  });
});
