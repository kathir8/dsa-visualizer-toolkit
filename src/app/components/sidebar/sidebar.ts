import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsaService } from '../../services/dsa.service';
import { EngineService } from '../../services/engine.service';
import { DsaTopic } from '../../core/models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  dsaService = inject(DsaService);
  engineService = inject(EngineService);
  
  topics = this.dsaService.getTopics();
  activeTopic = computed(() => this.engineService.activeTopic());

  constructor() {
    // Select default topic
    const firstTopic = this.topics[0];
    if (firstTopic) {
      this.selectTopic(firstTopic);
    }
  }

  selectTopic(topic: any) {
    this.engineService.setActiveTopic(topic);
  }
}
