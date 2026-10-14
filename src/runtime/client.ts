import type { ScriptResult } from '../engine/types';

type Pending = { resolve: (value: ScriptResult) => void; reject: (reason: Error) => void; timer: ReturnType<typeof setTimeout> };
export class PythonRuntime {
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  private pending = new Map<number, Pending>();
  private counter = 0;

  private start(): Promise<void> {
    if (this.ready) return this.ready;
    this.ready = new Promise<void>((resolve, reject) => {
      const worker = new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' });
      this.worker = worker;
      const bootTimer = setTimeout(() => { this.reset(); reject(new Error('Python took too long to initialize. Check your connection.')); }, 60000);
      worker.onmessage = (event: MessageEvent) => {
        const message = event.data;
        if (message.type === 'ready') { clearTimeout(bootTimer); resolve(); }
        else if (message.type === 'fatal') { clearTimeout(bootTimer); this.reset(); reject(new Error(message.error)); }
        else if (message.type === 'result' || message.type === 'error') {
          const job = this.pending.get(message.id);
          if (!job) return;
          clearTimeout(job.timer);
          this.pending.delete(message.id);
          if (message.type === 'error') job.reject(new Error(message.error));
          else job.resolve(message.value);
        }
      };
      worker.onerror = (event) => {
        clearTimeout(bootTimer);
        this.reset();
        reject(new Error(event.message || 'Python worker failed to start'));
      };
    });
    return this.ready;
  }

  async run(source: string, snapshot: unknown, memory: Record<string, unknown>): Promise<ScriptResult> {
    await this.start();
    return new Promise<ScriptResult>((resolve, reject) => {
      const id = ++this.counter;
      const timer = setTimeout(() => {
        this.reset();
        reject(new Error('Script exceeded its 2-second execution budget. Python runtime restarted.'));
      }, 2000);
      this.pending.set(id, { resolve, reject, timer });
      this.worker!.postMessage({ type: 'run', id, source, snapshot, memory });
    });
  }

  private reset(): void {
    this.worker?.terminate();
    this.worker = null;
    this.ready = null;
    for (const job of this.pending.values()) {
      clearTimeout(job.timer);
      job.reject(new Error('Python runtime restarted.'));
    }
    this.pending.clear();
  }

  destroy(): void { this.reset(); }
}
