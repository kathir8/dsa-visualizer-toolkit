import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineService } from '../../../services/engine.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-array-visualizer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './array-visualizer.html'
})
export class ArrayVisualizerComponent {
  engine = inject(EngineService);
  
  data = computed(() => this.engine.currentState()?.data || this.engine.currentInput());
  active = computed(() => this.engine.currentState()?.activeIndices || []);
  swapped = computed(() => this.engine.currentState()?.swappedIndices || []);
  pointersMap = computed(() => this.engine.currentState()?.pointers || {});
  
  // Specific logical checks for tailored visual modes
  isLinkedList = computed(() => this.engine.currentOperation()?.id?.includes('ll-'));
  isDoublyLinkedList = computed(() => this.engine.currentOperation()?.id?.startsWith('dll-'));
  isBubbleSort = computed(() => this.engine.currentOperation()?.id === 'bubble-sort');
  isRecursion = computed(() => this.engine.currentOperation()?.id?.includes('recursion'));
  isSlidingWindow = computed(() => this.engine.currentOperation()?.id?.includes('sliding-window'));
  isTreeOrGraphRepresentation = computed(() => {
    const id = this.engine.currentOperation()?.id || '';
    return id === 'bt-create-array' || id === 'graph-create-array';
  });

  isArray(val: unknown): boolean {
    return Array.isArray(val);
  }

  isActive(index: number) {
    return this.active().includes(index);
  }

  isSwapped(index: number) {
    return this.swapped().includes(index);
  }

  getPointersForIndex(index: number): string[] {
    const pmap = this.pointersMap();
    const ptrs: string[] = [];
    for (const [key, val] of Object.entries(pmap)) {
      if (val === index) {
        ptrs.push(key);
      }
    }
    return ptrs;
  }

  getWindowBounds() {
    const actives = this.active();
    if (!actives || actives.length === 0) return null;
    return {
      min: Math.min(...actives),
      max: Math.max(...actives)
    };
  }
}
