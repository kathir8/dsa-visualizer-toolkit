import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineService } from '../../../services/engine.service';

@Component({
  selector: 'app-graph-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graph-visualizer.html'
})
export class GraphVisualizerComponent {
  engine = inject(EngineService);
  state = computed(() => this.engine.currentState());

  get edgesData() {
     return this.state()?.data || [];
  }
  
  get totalNodes(): number {
    if (this.isTree()) {
       const inputs = this.engine.currentInput();
       if (Array.isArray(inputs)) {
          return inputs.length;
       }
    }
    // calculate max from adjacency list edges to ensure all referenced nodes are rendered
    let max = this.edgesData.length > 0 ? this.edgesData.length - 1 : 0;
    for (const nodeEdges of this.edgesData) {
        if (Array.isArray(nodeEdges)) {
            for (const edge of nodeEdges) {
                if (typeof edge === 'number' && edge > max) {
                    max = edge;
                }
            }
        }
    }
    return max + 1;
  }
  
  get margins() {
     return new Array(this.totalNodes).fill(0);
  }

  isTree = computed(() => this.engine.currentOperation()?.id === 'bt-create-array' || this.engine.currentOperation()?.id?.includes('heap'));

  viewBox = "0 0 500 500";
  
  // Arrange nodes in a circle or tree
  getNodePos(index: number) {
     const total = this.totalNodes || 1;
     
     if (this.isTree()) {
       // Binary Tree Layout
       const level = Math.floor(Math.log2(index + 1));
       const verticalSpacing = 70;
       const y = 50 + level * verticalSpacing;
       
       const nodesInLevel = Math.pow(2, level);
       const posInLevel = index - (nodesInLevel - 1);
       
       const width = 500;
       const horizontalSpacing = width / (nodesInLevel + 1);
       const x = horizontalSpacing * (posInLevel + 1);
       
       return { x, y };
     } else {
       // Circular Graph Layout
       const cx = 250;
       const cy = 250;
       const radius = 150;
       const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // start from top
       return {
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle)
       };
     }
  }

  getEdges(nodeIdx: number, data: unknown[]): number[] {
     if (Array.isArray(data) && Array.isArray(data[nodeIdx])) {
        return data[nodeIdx] as number[];
     }
     return [];
  }

  getNodeLabel(index: number): string | number {
    if (this.isTree()) {
       const inputs = this.engine.currentInput();
       if (Array.isArray(inputs) && inputs[index] !== undefined) {
          return inputs[index];
       }
    }
    return index;
  }

  getNodeClass(idx: number): string {
    const s = this.state();
    if (!s) return 'fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-700';

    if (s.activeIndices?.includes(idx)) {
      return 'fill-green-100 dark:fill-green-900/40 stroke-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]';
    }
    
    // Check if visited 
    if (s.vars?.['visited'] && Array.isArray(s.vars['visited']) && s.vars['visited'].includes(idx)) {
      return 'fill-purple-100 dark:fill-purple-900/40 stroke-purple-500';
    }
    
    if (s.pointers?.['currentNode'] === idx || s.pointers?.['exploreNode'] === idx) {
       return 'fill-blue-100 dark:fill-blue-900/40 stroke-blue-500';
    }

    return 'fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-700';
  }
}
