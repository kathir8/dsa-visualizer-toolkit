import { Injectable, signal, computed } from '@angular/core';
import { DsaOperation, StepState } from '../core/models';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  activeTopic = signal<any | null>(null);
  currentOperation = signal<DsaOperation | null>(null);
  
  currentState = signal<StepState | null>(null);
  isPlaying = signal<boolean>(false);
  speedTimerMs = signal<number>(1000);

  private generator: Generator<StepState, void, unknown> | null = null;
  private playIntervalId: any = null;
  
  // Expose parsed parameters in case user overrides defaults
  currentInput = signal<any>(null);
  currentArgs = signal<any[]>([]);

  argNames = computed(() => {
    const op = this.currentOperation();
    if (!op || !op.code) return [];
    // Extract argument names from function signature, e.g., "function insertAt(arr, index, value)"
    const match = op.code.match(/function\s+\w+\s*\((.*?)\)/);
    if (match) {
      const args = match[1].split(',').map(s => s.trim()).filter(Boolean);
      if (op.defaultInput === null) return args;
      return args.slice(1);
    }
    return [];
  });

  setActiveTopic(topic: any) {
    this.activeTopic.set(topic);
    if (topic.operations && topic.operations.length > 0) {
      this.setActiveOperation(topic.operations[0]);
    }
  }

  setActiveOperation(op: DsaOperation) {
    this.currentOperation.set(op);
    this.currentInput.set(op.defaultInput);
    this.currentArgs.set(op.defaultArgs || []);
    this.restart();
  }

  updateInputArray(val: string) {
    try {
      const p = val.trim();
      if (!p) return;
      
      try {
        const arr = JSON.parse(p);
        if (Array.isArray(arr)) {
          this.currentInput.set(arr);
          this.restart();
          return;
        }
      } catch {
        // Fallback: try wrapping it in brackets
        const arr = JSON.parse('[' + p + ']');
        if (Array.isArray(arr)) {
          this.currentInput.set(arr);
          this.restart();
        }
      }
    } catch {
      // ignore invalid
    }
  }

  updateArg(idx: number, val: string) {
    try {
      const parsed = JSON.parse(val.trim());
      const newArgs = [...this.currentArgs()];
      newArgs[idx] = parsed;
      this.currentArgs.set(newArgs);
      this.restart();
    } catch {
      const newArgs = [...this.currentArgs()];
      newArgs[idx] = val;
      this.currentArgs.set(newArgs);
      this.restart();
    }
  }

  resetToDefaults() {
    this.pause();
    const op = this.currentOperation();
    if (!op) return;
    this.currentInput.set(op.defaultInput);
    this.currentArgs.set(op.defaultArgs || []);
    this.restart();
  }

  restart() {
    this.pause();
    const op = this.currentOperation();
    if (!op) return;
    
    // Deep clone arrays/objects to not mutate across runs
    const inputClone = JSON.parse(JSON.stringify(this.currentInput()));
    const argsClone = JSON.parse(JSON.stringify(this.currentArgs()));
    
    this.generator = op.run(inputClone, ...argsClone);
    
    // Yield the initial state (before first line)
    this.currentState.set({
      line: 0,
      vars: {},
      data: inputClone,
      message: 'Ready to execute...'
    });
  }

  stepNext() {
    if (!this.generator) {
        this.restart();
    }
    if (!this.generator) return;
    
    const { value, done } = this.generator.next();
    if (done) {
      this.pause();
      this.generator = null; // Mark as done so next play/step restarts
    } else if (value) {
      this.currentState.set(value);
    }
  }

  play() {
    if (this.isPlaying()) return;
    this.isPlaying.set(true);
    
    // If we've finished the previous execution, start over with current inputs
    if (!this.generator) {
      this.restart();
    }

    // Auto-step using setInterval
    this.playIntervalId = setInterval(() => {
      if (!this.generator) return this.pause();
      const { value, done } = this.generator.next();
      if (done) {
        this.pause();
        this.generator = null; // Mark as done for restart
      } else if (value) {
        this.currentState.set(value);
      }
    }, this.speedTimerMs());
  }

  pause() {
    if (this.playIntervalId) {
      clearInterval(this.playIntervalId);
      this.playIntervalId = null;
    }
    this.isPlaying.set(false);
  }

  updateSpeed(ms: number) {
    this.speedTimerMs.set(ms);
    if (this.isPlaying()) {
      this.pause();
      this.play();
    }
  }
}
