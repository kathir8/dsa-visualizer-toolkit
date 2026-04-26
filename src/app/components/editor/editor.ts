import { Component, computed, inject, effect, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineService } from '../../services/engine.service';
import { MatIconModule } from '@angular/material/icon';
import { ComplexityChartComponent } from './complexity-chart/complexity-chart';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import { AngularSplitModule } from 'angular-split';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, MatIconModule, ComplexityChartComponent, AngularSplitModule],
  templateUrl: './editor.html',
  styles: []
})
export class EditorComponent {
  engine = inject(EngineService);
  
  op = computed(() => this.engine.currentOperation());
  currentLine = computed(() => this.engine.currentState()?.line || 0);
  vars = computed(() => this.engine.currentState()?.vars || {});
  
  editableCode = signal<string>('');
  scrollTop = signal<number>(0);
  scrollLeft = signal<number>(0);
  copied = signal<boolean>(false);

  constructor() {
    effect(() => {
      // Setup the editable code correctly whenever operation changes
      const currentOp = this.op();
      if (currentOp) {
        this.editableCode.set(currentOp.code);
      }
    });
  }

  highlightedCode = computed(() => {
    const code = this.editableCode();
    if (!code) return '';
    try {
      if (typeof window !== 'undefined' && Prism && Prism.languages && Prism.languages['javascript']) {
        return Prism.highlight(code, Prism.languages['javascript'], 'javascript');
      }
      return code;
    } catch(e) {
      return code;
    }
  });

  copyCode() {
    navigator.clipboard.writeText(this.editableCode());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  onScroll(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.scrollTop.set(target.scrollTop);
    this.scrollLeft.set(target.scrollLeft);
  }

  onSpeedInput(event: Event) {
    const target = event.target as HTMLInputElement;
    // Just visually update the signal without restarting play loop yet
    this.engine.speedTimerMs.set(2100 - parseInt(target.value));
  }

  onSpeedChange(event: Event) {
    const target = event.target as HTMLInputElement;
    // Actually update speed and restart interval
    this.engine.updateSpeed(2100 - parseInt(target.value));
  }

  getObjectKeys(obj: any) {
    return Object.keys(obj);
  }

  stringify(val: any) {
    if (Array.isArray(val)) return '[' + val.join(', ') + ']';
    if (typeof val === 'object' && val !== null) return JSON.stringify(val);
    return String(val);
  }
}
