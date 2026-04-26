import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineService } from '../../../services/engine.service';

interface TreeNode {
  value: number;
  idx: number;
  x: number;
  y: number;
  left?: TreeNode;
  right?: TreeNode;
}

interface TreeEdge {
  id: string;
  u: number;
  v: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Component({
  selector: 'app-heap-visualizer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heap-visualizer.html'
})
export class HeapVisualizerComponent {
  engine = inject(EngineService);

  data = computed(() => this.engine.currentState()?.data || this.engine.currentInput() || []);
  active = computed(() => this.engine.currentState()?.activeIndices || []);
  swapped = computed(() => this.engine.currentState()?.swappedIndices || []);
  pointersMap = computed(() => this.engine.currentState()?.pointers || {});

  // Calculate coordinates for nodes based on tree level
  nodesAndEdges = computed(() => {
    const list = this.data();
    if (!list || list.length === 0) return { nodes: [], edges: [] };

    const nodes: TreeNode[] = [];
    const edges: TreeEdge[] = [];
    
    // We'll place the root at x=300, y=50
    const canvasWidth = 800; // a bit wider
    const levelHeight = 100; // more spacing vertically

    // Helper to traverse and assign coordinates
    const buildTree = (idx: number, level: number, leftBound: number, rightBound: number): TreeNode | undefined => {
      if (idx >= list.length || list[idx] === null || list[idx] === undefined || list[idx] === 'null') return undefined;

      const x = (leftBound + rightBound) / 2;
      const y = 80 + level * levelHeight;

      const node: TreeNode = {
        value: list[idx],
        idx,
        x,
        y
      };

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      node.left = buildTree(leftIdx, level + 1, leftBound, x);
      node.right = buildTree(rightIdx, level + 1, x, rightBound);

      nodes.push(node);

      if (node.left) {
        edges.push({
          id: String(idx) + '-' + String(leftIdx),
          u: idx,
          v: leftIdx,
          x1: x,
          y1: y + 24, // bottom of node
          x2: node.left.x,
          y2: node.left.y - 24 // top of child
        });
      }

      if (node.right) {
        edges.push({
          id: String(idx) + '-' + String(rightIdx),
          u: idx,
          v: rightIdx,
          x1: x,
          y1: y + 24,
          x2: node.right.x,
          y2: node.right.y - 24
        });
      }

      return node;
    };

    buildTree(0, 0, 0, canvasWidth);

    return { nodes, edges };
  });

  nodes = computed(() => this.nodesAndEdges().nodes);
  edges = computed(() => this.nodesAndEdges().edges);

  isEdgeActive(edge: TreeEdge) {
    return (this.isActive(edge.u) && this.isActive(edge.v)) || (this.isSwapped(edge.u) && this.isSwapped(edge.v));
  }

  isActive(index: number) {
    return this.active().includes(index);
  }

  isSwapped(index: number) {
    return this.swapped().includes(index);
  }

  getClasses(index: number) {
    const base = 'w-12 h-12 flex items-center justify-center font-mono text-[14px] border-2 rounded-full shadow-md bg-[var(--surface-panel)]';
    
    if (this.isActive(index)) {
      return base + ' border-[var(--accent-base)] text-[var(--accent-base)] shadow-[0_0_12px_rgba(59,130,246,0.3)] bg-blue-900/20';
    }
    
    if (this.isSwapped(index)) {
      return base + ' border-[#d946ef] text-[#f0abfc] shadow-[0_0_12px_rgba(217,70,239,0.3)] bg-[#2d1b2e]';
    }

    if (this.pointersMap()['curr'] === index || this.pointersMap()['parent'] === index || this.pointersMap()['i'] === index) {
      return base + ' border-teal-500 text-teal-400 bg-teal-900/20 shadow-[0_0_8px_rgba(20,184,166,0.2)]';
    }
    
    return base + ' border-[var(--border-subtle)] text-[var(--text-primary)]';
  }
}
