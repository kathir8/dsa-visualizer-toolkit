import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineService } from '../../../services/engine.service';

@Component({
  selector: 'app-circular-queue-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circular-queue-visualizer.html'
})
export class CircularQueueVisualizerComponent {
  engine = inject(EngineService);

  data = computed(() => this.engine.currentState()?.data || this.engine.currentInput() || []);
  active = computed(() => this.engine.currentState()?.activeIndices || []);
  swapped = computed(() => this.engine.currentState()?.swappedIndices || []);
  pointersMap = computed(() => this.engine.currentState()?.pointers || {});

  _cos(rad: number) { return Math.cos(rad); }
  _sin(rad: number) { return Math.sin(rad); }

  isActive(index: number) {
    return this.active().includes(index);
  }

  isSwapped(index: number) {
    return this.swapped().includes(index);
  }

  getClasses(index: number) {
    const base = 'w-12 h-12 flex items-center justify-center font-mono text-[14px] border-2 rounded-full shadow-lg';
    
    if (this.isActive(index)) {
      return `${base} bg-[#19273c] border-[var(--accent-base)] text-[var(--accent-base)] shadow-[0_0_12px_rgba(59,130,246,0.3)]`;
    }
    
    if (this.isSwapped(index)) {
      return `${base} bg-[#2d1b2e] border-[#d946ef] text-[#f0abfc] shadow-[0_0_12px_rgba(217,70,239,0.3)]`;
    }

    if (this.data()[index] === 'null' || this.data()[index] === null) {
      return `${base} bg-[var(--surface-panel)] border-[var(--border-subtle)] text-[var(--text-secondary)] opacity-40 border-dashed`;
    }
    
    return `${base} bg-[var(--surface-panel)] border-[var(--border-subtle)] text-[var(--text-primary)]`;
  }
}
