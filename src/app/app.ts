import {ChangeDetectionStrategy, Component, inject, computed} from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar';
import { EditorComponent } from './components/editor/editor';
import { VisualizerComponent } from './components/visualizer/visualizer';
import { EngineService } from './services/engine.service';
import { CommonModule } from '@angular/common';
import { AngularSplitModule } from 'angular-split';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [SidebarComponent, EditorComponent, VisualizerComponent, CommonModule, AngularSplitModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  engineService = inject(EngineService);
  
  activeTopic = computed(() => this.engineService.activeTopic());
  activeOp = computed(() => this.engineService.currentOperation());
  
  selectOperation(op: any) {
    this.engineService.setActiveOperation(op);
  }
}

