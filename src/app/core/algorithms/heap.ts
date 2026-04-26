import { DsaOperation, StepState } from '../models';

export const minHeapPeekOp: DsaOperation = {
  id: 'min-heap-peek',
  name: 'Peek',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, 30, 40, 50],
  defaultArgs: [],
  code: `function peek(heap) {
  if (heap.length === 0) return null;
  return heap[0];
}`,
  run: function*(heap: number[]): Generator<StepState, void, unknown> {
    const data = [...heap];
    yield { line: 1, vars: {}, data: [...data], message: `Starting peek operation` };
    yield { line: 2, vars: {}, data: [...data], message: `Check if heap is empty` };
    if (data.length === 0) return;
    yield { line: 3, vars: {}, data: [...data], pointers: { root: 0 }, activeIndices: [0], message: `Return root element: ${data[0]}` };
  }
};

export const minHeapInsertOp: DsaOperation = {
  id: 'min-heap-insert',
  name: 'Insert',
  complexities: { time: 'O(log n)', space: 'O(1)' },
  defaultInput: [10, 20, 30, 40, 50],
  defaultArgs: [15],
  code: `function insert(heap, value) {
  heap.push(value);
  let curr = heap.length - 1;
  while (curr > 0) {
    let parent = Math.floor((curr - 1) / 2);
    if (heap[parent] > heap[curr]) {
      // Swap
      let temp = heap[parent];
      heap[parent] = heap[curr];
      heap[curr] = temp;
      curr = parent;
    } else {
      break;
    }
  }
}`,
  run: function*(heap: number[], value: number): Generator<StepState, void, unknown> {
    const data = [...heap];
    yield { line: 1, vars: { value }, data: [...data], message: `Starting min heap insert` };
    
    data.push(value);
    let curr = data.length - 1;
    yield { line: 2, vars: { value }, data: [...data], pointers: { newNode: curr }, activeIndices: [curr], message: `Push value to end of heap` };
    
    yield { line: 3, vars: { curr }, data: [...data], pointers: { curr }, message: `curr = ${curr}` };
    
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      yield { line: 5, vars: { curr, parent }, data: [...data], pointers: { curr, parent }, message: `parent = ${parent}` };
      
      yield { line: 6, vars: { curr, parent }, data: [...data], pointers: { curr, parent }, activeIndices: [curr, parent], message: `heap[${parent}] > heap[${curr}] ?` };
      
      if (data[parent] > data[curr]) {
        yield { line: 8, vars: { curr, parent }, data: [...data], pointers: { curr, parent }, message: `Swapping ${data[parent]} and ${data[curr]}` };
        const temp = data[parent];
        data[parent] = data[curr];
        data[curr] = temp;
        yield { line: 10, vars: { curr, parent }, data: [...data], pointers: { curr, parent }, swappedIndices: [curr, parent], message: `Swapped` };
        curr = parent;
        yield { line: 11, vars: { curr }, data: [...data], pointers: { curr }, message: `curr = ${parent}` };
      } else {
        yield { line: 13, vars: { curr, parent }, data: [...data], pointers: { curr, parent }, message: `Heap property satisfied, break` };
        break;
      }
    }
    yield { line: 16, vars: {}, data: [...data], message: `Insert complete` };
  }
};

export const minHeapExtractOp: DsaOperation = {
  id: 'min-heap-extract',
  name: 'Extract',
  complexities: { time: 'O(log n)', space: 'O(1)' },
  defaultInput: [10, 20, 30, 40, 50],
  defaultArgs: [],
  code: `function extractMin(heap) {
  if (heap.length === 0) return null;
  if (heap.length === 1) return heap.pop();
  let root = heap[0];
  heap[0] = heap.pop();
  // Heapify down
  let curr = 0;
  while (true) {
    let left = 2 * curr + 1;
    let right = 2 * curr + 2;
    let smallest = curr;
    if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
    if (right < heap.length && heap[right] < heap[smallest]) smallest = right;
    if (smallest !== curr) {
      let temp = heap[curr];
      heap[curr] = heap[smallest];
      heap[smallest] = temp;
      curr = smallest;
    } else {
      break;
    }
  }
  return root;
}`,
  run: function*(heap: number[]): Generator<StepState, void, unknown> {
    const data = [...heap];
    yield { line: 1, vars: {}, data: [...data], message: `Starting extract min` };
    if (data.length === 0) return;
    yield { line: 2, vars: {}, data: [...data], message: `Check if heap is length 1` };
    if (data.length === 1) {
      data.pop();
      yield { line: 3, vars: {}, data: [...data], message: `Popped last element` };
      return;
    }
    
    const root = data[0];
    yield { line: 4, vars: { root }, data: [...data], pointers: { root: 0 }, activeIndices: [0], message: `Storing root element ${root}` };
    
    data[0] = data.pop()!;
    yield { line: 5, vars: {}, data: [...data], pointers: { root: 0 }, activeIndices: [0], message: `Moved last element to root` };
    
    let curr = 0;
    yield { line: 7, vars: { curr }, data: [...data], pointers: { curr }, message: `Heapify down starting from 0` };
    
    while (true) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      let smallest = curr;
      
      yield { line: 9, vars: { curr, left, right, smallest }, data: [...data], pointers: { curr }, message: `Find smallest among curr, left, right` };
      
      if (left < data.length) {
        yield { line: 12, vars: { curr, left, smallest }, data: [...data], pointers: { curr, left }, activeIndices: [curr, left], message: `Check left child` };
        if (data[left] < data[smallest]) smallest = left;
      }
      
      if (right < data.length) {
        yield { line: 13, vars: { curr, right, smallest }, data: [...data], pointers: { curr, right }, activeIndices: [curr, right], message: `Check right child` };
        if (data[right] < data[smallest]) smallest = right;
      }
      
      yield { line: 14, vars: { curr, smallest }, data: [...data], pointers: { curr, smallest }, message: `Smallest is at ${smallest}` };
      
      if (smallest !== curr) {
        yield { line: 15, vars: { curr, smallest }, data: [...data], pointers: { curr, smallest }, message: `Swapping ${data[curr]} and ${data[smallest]}` };
        const temp = data[curr];
        data[curr] = data[smallest];
        data[smallest] = temp;
        yield { line: 18, vars: { curr, smallest }, data: [...data], pointers: { curr, smallest }, swappedIndices: [curr, smallest], message: `Swapped` };
        
        curr = smallest;
        yield { line: 19, vars: { curr }, data: [...data], pointers: { curr }, message: `curr = ${smallest}` };
      } else {
        yield { line: 21, vars: {}, data: [...data], message: `Heap property satisfied` };
        break;
      }
    }
    yield { line: 24, vars: { root }, data: [...data], message: `Returning extracted min: ${root}` };
  }
};

export const minHeapSearchOp: DsaOperation = {
  id: 'min-heap-search',
  name: 'Search',
  complexities: { time: 'O(n)', space: 'O(1)' },
  defaultInput: [10, 20, 30, 40, 50],
  defaultArgs: [30],
  code: `function search(heap, target) {
  for (let i = 0; i < heap.length; i++) {
    if (heap[i] === target) return i;
  }
  return -1;
}`,
  run: function*(heap: number[], target: number): Generator<StepState, void, unknown> {
    const data = [...heap];
    yield { line: 1, vars: { target }, data: [...data], message: `Starting search for ${target}` };
    
    for (let i = 0; i < data.length; i++) {
        yield { line: 2, vars: { i, target }, data: [...data], pointers: { i }, activeIndices: [i], message: `Check index ${i}` };
        if (data[i] === target) {
            yield { line: 3, vars: { i, target }, data: [...data], pointers: { i }, activeIndices: [i], message: `Found ${target} at index ${i}` };
            return;
        }
    }
    yield { line: 5, vars: { target }, data: [...data], message: `Target ${target} not found` };
  }
};

export const maxHeapPeekOp: DsaOperation = {
  id: 'max-heap-peek',
  name: 'Peek',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [50, 40, 30, 20, 10],
  defaultArgs: [],
  code: `function peek(heap) {
  if (heap.length === 0) return null;
  return heap[0];
}`,
  run: function*(heap: number[]): Generator<StepState, void, unknown> {
    const data = [...heap];
    yield { line: 1, vars: {}, data: [...data], message: `Starting peek operation` };
    yield { line: 2, vars: {}, data: [...data], message: `Check if heap is empty` };
    if (data.length === 0) return;
    yield { line: 3, vars: {}, data: [...data], pointers: { root: 0 }, activeIndices: [0], message: `Return root element: ${data[0]}` };
  }
};

export const maxHeapInsertOp: DsaOperation = {
  id: 'max-heap-insert',
  name: 'Insert',
  complexities: { time: 'O(log n)', space: 'O(1)' },
  defaultInput: [50, 40, 30, 20, 10],
  defaultArgs: [45],
  code: `function insert(heap, value) {
  heap.push(value);
  let curr = heap.length - 1;
  while (curr > 0) {
    let parent = Math.floor((curr - 1) / 2);
    if (heap[parent] < heap[curr]) {
      // Swap
      let temp = heap[parent];
      heap[parent] = heap[curr];
      heap[curr] = temp;
      curr = parent;
    } else {
      break;
    }
  }
}`,
  run: function*(heap: number[], value: number): Generator<StepState, void, unknown> {
    const data = [...heap];
    yield { line: 1, vars: { value }, data: [...data], message: `Starting max heap insert` };
    
    data.push(value);
    let curr = data.length - 1;
    yield { line: 2, vars: { value }, data: [...data], pointers: { newNode: curr }, activeIndices: [curr], message: `Push value to end of heap` };
    
    yield { line: 3, vars: { curr }, data: [...data], pointers: { curr }, message: `curr = ${curr}` };
    
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      yield { line: 5, vars: { curr, parent }, data: [...data], pointers: { curr, parent }, message: `parent = ${parent}` };
      
      yield { line: 6, vars: { curr, parent }, data: [...data], pointers: { curr, parent }, activeIndices: [curr, parent], message: `heap[${parent}] < heap[${curr}] ?` };
      
      if (data[parent] < data[curr]) {
        yield { line: 8, vars: { curr, parent }, data: [...data], pointers: { curr, parent }, message: `Swapping ${data[parent]} and ${data[curr]}` };
        const temp = data[parent];
        data[parent] = data[curr];
        data[curr] = temp;
        yield { line: 10, vars: { curr, parent }, data: [...data], pointers: { curr, parent }, swappedIndices: [curr, parent], message: `Swapped` };
        curr = parent;
        yield { line: 11, vars: { curr }, data: [...data], pointers: { curr }, message: `curr = ${parent}` };
      } else {
        yield { line: 13, vars: { curr, parent }, data: [...data], pointers: { curr, parent }, message: `Heap property satisfied, break` };
        break;
      }
    }
    yield { line: 16, vars: {}, data: [...data], message: `Insert complete` };
  }
};

export const maxHeapExtractOp: DsaOperation = {
  id: 'max-heap-extract',
  name: 'Extract',
  complexities: { time: 'O(log n)', space: 'O(1)' },
  defaultInput: [50, 40, 30, 20, 10],
  defaultArgs: [],
  code: `function extractMax(heap) {
  if (heap.length === 0) return null;
  if (heap.length === 1) return heap.pop();
  let root = heap[0];
  heap[0] = heap.pop();
  // Heapify down
  let curr = 0;
  while (true) {
    let left = 2 * curr + 1;
    let right = 2 * curr + 2;
    let largest = curr;
    if (left < heap.length && heap[left] > heap[largest]) largest = left;
    if (right < heap.length && heap[right] > heap[largest]) largest = right;
    if (largest !== curr) {
      let temp = heap[curr];
      heap[curr] = heap[largest];
      heap[largest] = temp;
      curr = largest;
    } else {
      break;
    }
  }
  return root;
}`,
  run: function*(heap: number[]): Generator<StepState, void, unknown> {
    const data = [...heap];
    yield { line: 1, vars: {}, data: [...data], message: `Starting extract max` };
    if (data.length === 0) return;
    yield { line: 2, vars: {}, data: [...data], message: `Check if heap is length 1` };
    if (data.length === 1) {
      data.pop();
      yield { line: 3, vars: {}, data: [...data], message: `Popped last element` };
      return;
    }
    
    const root = data[0];
    yield { line: 4, vars: { root }, data: [...data], pointers: { root: 0 }, activeIndices: [0], message: `Storing root element ${root}` };
    
    data[0] = data.pop()!;
    yield { line: 5, vars: {}, data: [...data], pointers: { root: 0 }, activeIndices: [0], message: `Moved last element to root` };
    
    let curr = 0;
    yield { line: 7, vars: { curr }, data: [...data], pointers: { curr }, message: `Heapify down starting from 0` };
    
    while (true) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      let largest = curr;
      
      yield { line: 9, vars: { curr, left, right, largest }, data: [...data], pointers: { curr }, message: `Find largest among curr, left, right` };
      
      if (left < data.length) {
        yield { line: 12, vars: { curr, left, largest }, data: [...data], pointers: { curr, left }, activeIndices: [curr, left], message: `Check left child` };
        if (data[left] > data[largest]) largest = left;
      }
      
      if (right < data.length) {
        yield { line: 13, vars: { curr, right, largest }, data: [...data], pointers: { curr, right }, activeIndices: [curr, right], message: `Check right child` };
        if (data[right] > data[largest]) largest = right;
      }
      
      yield { line: 14, vars: { curr, largest }, data: [...data], pointers: { curr, largest }, message: `Largest is at ${largest}` };
      
      if (largest !== curr) {
        yield { line: 15, vars: { curr, largest }, data: [...data], pointers: { curr, largest }, message: `Swapping ${data[curr]} and ${data[largest]}` };
        const temp = data[curr];
        data[curr] = data[largest];
        data[largest] = temp;
        yield { line: 18, vars: { curr, largest }, data: [...data], pointers: { curr, largest }, swappedIndices: [curr, largest], message: `Swapped` };
        
        curr = largest;
        yield { line: 19, vars: { curr }, data: [...data], pointers: { curr }, message: `curr = ${largest}` };
      } else {
        yield { line: 21, vars: {}, data: [...data], message: `Heap property satisfied` };
        break;
      }
    }
    yield { line: 24, vars: { root }, data: [...data], message: `Returning extracted max: ${root}` };
  }
};

export const maxHeapSearchOp: DsaOperation = {
  id: 'max-heap-search',
  name: 'Search',
  complexities: { time: 'O(n)', space: 'O(1)' },
  defaultInput: [50, 40, 30, 20, 10],
  defaultArgs: [30],
  code: `function search(heap, target) {
  for (let i = 0; i < heap.length; i++) {
    if (heap[i] === target) return i;
  }
  return -1;
}`,
  run: function*(heap: number[], target: number): Generator<StepState, void, unknown> {
    const data = [...heap];
    yield { line: 1, vars: { target }, data: [...data], message: `Starting search for ${target}` };
    
    for (let i = 0; i < data.length; i++) {
        yield { line: 2, vars: { i, target }, data: [...data], pointers: { i }, activeIndices: [i], message: `Check index ${i}` };
        if (data[i] === target) {
            yield { line: 3, vars: { i, target }, data: [...data], pointers: { i }, activeIndices: [i], message: `Found ${target} at index ${i}` };
            return;
        }
    }
    yield { line: 5, vars: { target }, data: [...data], message: `Target ${target} not found` };
  }
};

export const minHeapCreateFromArrayOp: DsaOperation = {
  id: 'min-heap-create-array',
  name: 'Array to Min Heap',
  complexities: { time: 'O(n log n)', space: 'O(n)' },
  defaultInput: [40, 10, 30, 50, 20],
  defaultArgs: [],
  code: `function createMinHeap(arr) {
  let heap = [];
  for (let i = 0; i < arr.length; i++) {
    heap.push(arr[i]);
    // Heapify Up logic
  }
  return heap;
}`,
  run: function*(data: number[]): Generator<StepState, void, unknown> {
    const arr = data || [];
    const heap: number[] = [];
    yield { line: 2, vars: { arr: JSON.stringify(arr) }, data: [...heap], message: `Initialize empty heap` };
    
    for (let k = 0; k < arr.length; k++) {
      const val = arr[k];
      yield { line: 3, vars: { k, val }, data: [...heap], message: `Process arr[${k}] = ${val}` };
      
      heap.push(val);
      let curr = heap.length - 1;
      yield { line: 4, vars: { val, curr }, data: [...heap], activeIndices: [curr], message: `Insert ${val} at the end` };
      
      while (curr > 0) {
        const parent = Math.floor((curr - 1) / 2);
        yield { line: 5, vars: { curr, parent, "heap[curr]": heap[curr], "heap[parent]": heap[parent] }, data: [...heap], pointers: { curr, parent }, activeIndices: [curr, parent], message: `Compare child ${heap[curr]} with parent ${heap[parent]}` };
        
        if (heap[parent] > heap[curr]) {
          const temp = heap[parent];
          heap[parent] = heap[curr];
          heap[curr] = temp;
          yield { line: 5, vars: { curr, parent }, data: [...heap], pointers: { curr, parent }, activeIndices: [curr, parent], message: `Swap ${heap[curr]} and ${heap[parent]}` };
          curr = parent;
        } else {
          yield { line: 5, vars: {}, data: [...heap], pointers: { curr, parent }, message: `Heap property satisfied` };
          break;
        }
      }
    }
    yield { line: 7, vars: {}, data: [...heap], message: `Return min heap` };
  }
};

export const maxHeapCreateFromArrayOp: DsaOperation = {
  id: 'max-heap-create-array',
  name: 'Array to Max Heap',
  complexities: { time: 'O(n log n)', space: 'O(n)' },
  defaultInput: [10, 40, 20, 50, 30],
  defaultArgs: [],
  code: `function createMaxHeap(arr) {
  let heap = [];
  for (let i = 0; i < arr.length; i++) {
    heap.push(arr[i]);
    // Heapify Up logic
  }
  return heap;
}`,
  run: function*(data: number[]): Generator<StepState, void, unknown> {
    const arr = data || [];
    const heap: number[] = [];
    yield { line: 2, vars: { arr: JSON.stringify(arr) }, data: [...heap], message: `Initialize empty heap` };
    
    for (let k = 0; k < arr.length; k++) {
      const val = arr[k];
      yield { line: 3, vars: { k, val }, data: [...heap], message: `Process arr[${k}] = ${val}` };
      
      heap.push(val);
      let curr = heap.length - 1;
      yield { line: 4, vars: { val, curr }, data: [...heap], activeIndices: [curr], message: `Insert ${val} at the end` };
      
      while (curr > 0) {
        const parent = Math.floor((curr - 1) / 2);
        yield { line: 5, vars: { curr, parent, "heap[curr]": heap[curr], "heap[parent]": heap[parent] }, data: [...heap], pointers: { curr, parent }, activeIndices: [curr, parent], message: `Compare child ${heap[curr]} with parent ${heap[parent]}` };
        
        if (heap[parent] < heap[curr]) {
          const temp = heap[parent];
          heap[parent] = heap[curr];
          heap[curr] = temp;
          yield { line: 5, vars: { curr, parent }, data: [...heap], pointers: { curr, parent }, activeIndices: [curr, parent], message: `Swap ${heap[curr]} and ${heap[parent]}` };
          curr = parent;
        } else {
          yield { line: 5, vars: {}, data: [...heap], pointers: { curr, parent }, message: `Heap property satisfied` };
          break;
        }
      }
    }
    yield { line: 7, vars: {}, data: [...heap], message: `Return max heap` };
  }
};
