import { TestBed } from '@angular/core/testing';
import { MatchQuestion } from './match-question';
import { MatchQ } from '../../../core/models';

const q: MatchQ = {
  id: 'saa-ud01-q001',
  type: 'match',
  prompt: 'Relaciona',
  pairs: [
    ['A', 'a'],
    ['B', 'b'],
    ['C', 'c'],
  ],
  explanation: 'e',
  source: 's',
  difficulty: 1,
};

function setup() {
  const fixture = TestBed.createComponent(MatchQuestion);
  fixture.componentRef.setInput('question', q);
  const emitted: boolean[] = [];
  fixture.componentInstance.answered.subscribe((r) => emitted.push(r.ok));
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  const click = (side: 'left' | 'right', text: string) => {
    const btn = [...el.querySelectorAll<HTMLButtonElement>(`[data-side="${side}"]`)].find((b) => b.dataset['value'] === text)!;
    btn.click();
    fixture.detectChanges();
  };
  const check = () => {
    el.querySelector<HTMLButtonElement>('[data-action="check"]')!.click();
    fixture.detectChanges();
  };
  return { click, check, emitted };
}

describe('MatchQuestion', () => {
  it('emparejar todo bien emite ok', () => {
    const { click, check, emitted } = setup();
    for (const [l, r] of q.pairs) {
      click('left', l);
      click('right', r);
    }
    check();
    expect(emitted).toEqual([true]);
  });

  it('una pareja cambiada emite fallo', () => {
    const { click, check, emitted } = setup();
    click('left', 'A');
    click('right', 'b');
    click('left', 'B');
    click('right', 'a');
    click('left', 'C');
    click('right', 'c');
    check();
    expect(emitted).toEqual([false]);
  });
});
