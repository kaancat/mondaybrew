declare module 'lenis' {
  // Minimal typing to satisfy TS; the package provides runtime implementation
  export default class Lenis {
    constructor(options?: Record<string, unknown>);
    raf(time: number): void;
    on(event: string, handler: (...args: unknown[]) => void): void;
    resize(): void;
    destroy(): void;
    scrollTo(value: number | HTMLElement | string, options?: Record<string, unknown>): void;
    get scroll(): number;
  }
}

