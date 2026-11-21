export interface Answer {
  ok: boolean;
  ms: number;
}

/** Cronómetro de la pregunta: desde que se pinta hasta que se comprueba. */
export function startTimer(): () => number {
  const start = performance.now();
  return () => Math.round(performance.now() - start);
}
