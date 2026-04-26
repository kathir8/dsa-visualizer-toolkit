import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complexity-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complexity-chart.html'
})
export class ComplexityChartComponent {
  activeComplexity = input<string>('');
  chartTitle = input<string>('Complexity');
  yAxisLabel = input<string>('Value');

  curves = [
    { id: 'O(1)', color: '#10b981', path: 'M 25 115 L 200 115', labelX: 205, labelY: 119, align: 'start' },
    { id: 'O(log n)', color: '#14b8a6', path: 'M 25 125 Q 80 100 200 95', labelX: 205, labelY: 99, align: 'start' },
    { id: 'O(n)', color: '#eab308', path: 'M 25 125 L 200 25', labelX: 205, labelY: 29, align: 'start' },
    { id: 'O(n log n)', color: '#f97316', path: 'M 25 125 Q 120 100 160 10', labelX: 165, labelY: 14, align: 'start' },
    { id: 'O(n^2)', color: '#ef4444', path: 'M 25 125 Q 80 125 100 10', labelX: 105, labelY: 14, align: 'start' },
  ];

  normalizedActiveComplexity = computed(() => {
    // Clean string by removing spaces and asterisks (e.g. "O(n)*")
    const c = (this.activeComplexity() || '').toLowerCase().replace(/[\\s\\*]/g, '');
    if (c === 'o(1)') return 'O(1)';
    if (c === 'o(n^2)' || c === 'o(n²)') return 'O(n^2)';
    if (c === 'o(nlogn)' || c === 'o(n*logn)') return 'O(n log n)';
    if (c === 'o(logn)') return 'O(log n)';
    // Handle Graph O(V + E) which is essentially linear time relative to size of graph
    if (c.includes('v+e')) return 'O(n)';
    // ensure 'n' is present but it is NOT an n^2 or log n
    if (c.includes('n') && !c.includes('log') && !c.includes('2') && !c.includes('²')) return 'O(n)';
    return '';
  });

  isActive(curveId: string) {
    const active = this.normalizedActiveComplexity();
    if (!active) return true; // Show all if none matched
    return curveId === active;
  }

  activeColor = computed(() => {
    const id = this.normalizedActiveComplexity();
    const curve = this.curves.find(c => c.id === id);
    return curve?.color || '';
  });
}
