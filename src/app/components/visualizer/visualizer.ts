import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineService } from '../../services/engine.service';
import { ArrayVisualizerComponent } from './array-visualizer/array-visualizer';
import { GraphVisualizerComponent } from './graph-visualizer/graph-visualizer';
import { CircularQueueVisualizerComponent } from './circular-queue-visualizer/circular-queue-visualizer';
import { HeapVisualizerComponent } from './heap-visualizer/heap-visualizer';

@Component({
  selector: 'app-visualizer',
  standalone: true,
  imports: [CommonModule, ArrayVisualizerComponent, GraphVisualizerComponent, CircularQueueVisualizerComponent, HeapVisualizerComponent],
  templateUrl: './visualizer.html'
})
export class VisualizerComponent {
  engine = inject(EngineService);
  
  op = computed(() => this.engine.currentOperation());
  message = computed(() => this.engine.currentState()?.message || 'Ready to execute...');

  opType = computed(() => {
    const o = this.op();
    if (!o) return 'none';
    if (o.id.includes('circular-queue')) return 'circular-queue';
    if (o.id.includes('graph') || o.id === 'bt-create-array') return 'graph';
    if (o.id.includes('heap')) return 'heap';
    if (o.id.includes('sort') || o.id.includes('search') || o.id.includes('array') || o.id.includes('stack') || o.id.includes('queue') || o.id.includes('ll-') || o.id.includes('dll-') || o.id.includes('two-pointers') || o.id.includes('sliding') || o.id.includes('kadane') || o.id.includes('dp-') || o.id.includes('greedy-')) {
      return 'array';
    }
    return 'array'; // Defaulting to array for demo
  });

  inputArrayString = computed(() => {
    const arr = this.engine.currentInput();
    if (Array.isArray(arr)) {
      return JSON.stringify(arr).replace(/^\[|\]$/g, '');
    }
    return String(arr || '');
  });

  onInputArrayBlur(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.engine.updateInputArray(val);
    (event.target as HTMLInputElement).value = this.inputArrayString(); // Reset to formatted string
  }

  onArgBlur(idx: number, event: Event) {
    this.engine.updateArg(idx, (event.target as HTMLInputElement).value);
    (event.target as HTMLInputElement).value = this.engine.currentArgs()[idx]; // Reset to parsed value
  }
}


