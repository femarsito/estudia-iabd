import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ContentIndex, ModuleId, ModuleInfo, Unit } from './models';

export type UnitResult = Unit | 'coming-soon' | 'unavailable';

const EMPTY_INDEX: ContentIndex = { modules: [] };

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private indexCache?: Promise<ContentIndex>;
  private readonly units = new Map<string, Unit>();

  index(): Promise<ContentIndex> {
    this.indexCache ??= firstValueFrom(this.http.get<ContentIndex>('content/index.json')).catch(() => {
      // Sin red y sin caché: se reintenta en la siguiente llamada.
      this.indexCache = undefined;
      return EMPTY_INDEX;
    });
    return this.indexCache;
  }

  async module(id: ModuleId): Promise<ModuleInfo | undefined> {
    return (await this.index()).modules.find((m) => m.id === id);
  }

  async unit(unitId: string): Promise<UnitResult> {
    const cached = this.units.get(unitId);
    if (cached) return cached;
    const ref = (await this.index()).modules.flatMap((m) => m.units).find((u) => u.id === unitId);
    if (!ref?.file) return ref ? 'coming-soon' : 'unavailable';
    try {
      const unit = await firstValueFrom(this.http.get<Unit>(`content/${ref.file}`));
      this.units.set(unitId, unit);
      return unit;
    } catch {
      return 'unavailable';
    }
  }

  /** Todas las unidades con contenido, en el orden del índice. */
  async loadedUnits(): Promise<Unit[]> {
    const refs = (await this.index()).modules.flatMap((m) => m.units).filter((u) => u.file);
    const results = await Promise.all(refs.map((r) => this.unit(r.id)));
    return results.filter((u): u is Unit => typeof u !== 'string');
  }

  async allQuestionIds(): Promise<Set<string>> {
    return new Set((await this.loadedUnits()).flatMap((u) => u.questions.map((q) => q.id)));
  }
}
