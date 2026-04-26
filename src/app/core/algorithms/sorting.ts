import { DsaOperation, StepState } from '../models';

export const bubbleSortOp: DsaOperation = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  complexities: { time: 'O(n²)', space: 'O(1)' },
  defaultInput: [5, 3, 8, 4, 1, 9, 2],
  code: `function bubbleSort(arr) {
  let temp;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`,
  run: function*(arr: number[]): Generator<StepState, void, unknown> {
    const data = [...arr];
    yield { line: 1, vars: {}, data: [...data], message: 'Start Bubble Sort' };
    yield { line: 2, vars: {}, data: [...data], message: 'Declare temp' };
    for (let i = 0; i < data.length - 1; i++) {
      yield { line: 3, vars: { i }, data: [...data], pointers: { i }, message: `Outer loop iteration i=${i}` };
      for (let j = 0; j < data.length - i - 1; j++) {
        yield { line: 4, vars: { i, j }, data: [...data], pointers: { i, j }, message: `Inner loop iteration j=${j}` };
        yield { line: 5, vars: { i, j, 'arr[j]': data[j], 'arr[j+1]': data[j+1] }, data: [...data], pointers: { i, j }, activeIndices: [j, j + 1], message: `Is ${data[j]} > ${data[j+1]}?` };
        if (data[j] > data[j + 1]) {
          const temp = data[j];
          yield { line: 6, vars: { i, j, temp }, data: [...data], pointers: { i, j }, activeIndices: [j, j + 1], message: `temp = ${data[j]}` };
          data[j] = data[j + 1];
          yield { line: 7, vars: { i, j, temp }, data: [...data], pointers: { i, j }, activeIndices: [j], message: `arr[${j}] = ${data[j+1]}` };
          data[j + 1] = temp;
          yield { line: 8, vars: { i, j, temp }, data: [...data], pointers: { i, j }, swappedIndices: [j, j+1], message: `arr[${j+1}] = temp. Swapped.` };
        }
      }
    }
    yield { line: 12, vars: {}, data: [...data], message: 'Array is sorted' };
  }
};

export const selectionSortOp: DsaOperation = {
  id: 'selection-sort',
  name: 'Selection Sort',
  complexities: { time: 'O(n²)', space: 'O(1)' },
  defaultInput: [64, 25, 12, 22, 11],
  code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
}`,
  run: function*(arr: number[]): Generator<StepState, void, unknown> {
    const data = [...arr];
    for (let i = 0; i < data.length - 1; i++) {
      let minIdx = i;
      yield { line: 3, vars: { i, minIdx }, data: [...data], pointers: { i, minIdx }, message: `Assume minIdx is ${i}` };
      for (let j = i + 1; j < data.length; j++) {
        yield { line: 5, vars: { i, minIdx, j }, data: [...data], pointers: { i, minIdx, j }, activeIndices: [j, minIdx], message: `Is arr[${j}] < arr[minIdx]?` };
        if (data[j] < data[minIdx]) {
          minIdx = j;
          yield { line: 6, vars: { i, minIdx, j }, data: [...data], pointers: { i, minIdx, j }, message: `Update minIdx = ${j}` };
        }
      }
      if (minIdx !== i) {
        yield { line: 9, vars: { i, minIdx }, data: [...data], pointers: { i, minIdx }, message: `Swap arr[${i}] & arr[${minIdx}]` };
        const temp = data[i];
        data[i] = data[minIdx];
        data[minIdx] = temp;
        yield { line: 12, vars: { i, minIdx }, data: [...data], pointers: { i, minIdx }, swappedIndices: [i, minIdx], message: `Swapped` };
      }
    }
  }
};

export const insertionSortOp: DsaOperation = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  complexities: { time: 'O(n²)', space: 'O(1)' },
  defaultInput: [12, 11, 13, 5, 6],
  code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}`,
  run: function*(arr: number[]): Generator<StepState, void, unknown> {
    const data = [...arr];
    for (let i = 1; i < data.length; i++) {
      const key = data[i];
      yield { line: 3, vars: { i, key }, data: [...data], pointers: { i }, activeIndices: [i], message: `key = ${key}` };
      let j = i - 1;
      while (j >= 0 && data[j] > key) {
        yield { line: 5, vars: { i, key, j }, data: [...data], pointers: { i, j }, activeIndices: [j], message: `arr[${j}] > key. Shift right.` };
        data[j + 1] = data[j];
        yield { line: 6, vars: { i, key, j }, data: [...data], pointers: { i, j }, swappedIndices: [j, j+1], message: `arr[${j+1}] = ${data[j]}` };
        j = j - 1;
      }
      data[j + 1] = key;
      yield { line: 9, vars: { i, key, j }, data: [...data], pointers: { i, j }, activeIndices: [j+1], message: `arr[${j+1}] = key (${key})` };
    }
  }
};

export const mergeSortOp: DsaOperation = {
  id: 'merge-sort',
  name: 'Merge Sort',
  complexities: { time: 'O(n log n)', space: 'O(n)' },
  defaultInput: [38, 27, 43, 3, 9, 82, 10],
  code: `function mergeSort(arr) {
  let currSize;
  let leftStart;
  for (currSize = 1; currSize <= arr.length - 1; currSize = 2 * currSize) {
    for (leftStart = 0; leftStart < arr.length - 1; leftStart += 2 * currSize) {
      let mid = Math.min(leftStart + currSize - 1, arr.length - 1);
      let rightEnd = Math.min(leftStart + 2 * currSize - 1, arr.length - 1);
      merge(arr, leftStart, mid, rightEnd);
    }
  }
}

function merge(arr, l, m, r) {
  let i = l, j = m + 1, k = l;
  let temp = [...arr];
  while (i <= m && j <= r) {
    if (temp[i] <= temp[j]) arr[k++] = temp[i++];
    else arr[k++] = temp[j++];
  }
  while (i <= m) arr[k++] = temp[i++];
  while (j <= r) arr[k++] = temp[j++];
}`,
  run: function*(arr: number[]): Generator<StepState, void, unknown> {
    const data = [...arr];
    const n = data.length;
    for (let currSize = 1; currSize <= n - 1; currSize = 2 * currSize) {
      yield { line: 4, vars: { currSize }, data: [...data], message: `currSize = ${currSize}` };
      for (let leftStart = 0; leftStart < n - 1; leftStart += 2 * currSize) {
        const mid = Math.min(leftStart + currSize - 1, n - 1);
        const rightEnd = Math.min(leftStart + 2 * currSize - 1, n - 1);
        yield { line: 8, vars: { leftStart, mid, rightEnd }, data: [...data], pointers: { left: leftStart, right: rightEnd, mid }, message: `Merging [${leftStart}...${mid}] and [${mid+1}...${rightEnd}]` };
        
        let i = leftStart, j = mid + 1, k = leftStart;
        const temp = [...data];
        while (i <= mid && j <= rightEnd) {
          yield { line: 16, vars: { i, j, k }, data: [...data], pointers: { i, j, k }, activeIndices: [i, j], message: `Compare temp[${i}] & temp[${j}]` };
          if (temp[i] <= temp[j]) {
            data[k] = temp[i];
            i++;
          } else {
            data[k] = temp[j];
            j++;
          }
          yield { line: 18, vars: { i, j, k }, data: [...data], pointers: { i, j, k }, activeIndices: [k], message: `Placed ${data[k]} at index ${k}` };
          k++;
        }
        while (i <= mid) {
          data[k] = temp[i];
          yield { line: 20, vars: { i, k }, data: [...data], pointers: { i, k }, activeIndices: [k], message: `Copy remaining from left: ${data[k]}` };
          i++; k++;
        }
        while (j <= rightEnd) {
          data[k] = temp[j];
          yield { line: 21, vars: { j, k }, data: [...data], pointers: { j, k }, activeIndices: [k], message: `Copy remaining from right: ${data[k]}` };
          j++; k++;
        }
      }
    }
  }
};

export const quickSortOp: DsaOperation = {
  id: 'quick-sort',
  name: 'Quick Sort',
  complexities: { time: 'O(n log n)', space: 'O(log n)' },
  defaultInput: [10, 80, 30, 90, 40, 50, 70],
  code: `function quickSort(arr) {
  let stack = [];
  stack.push(0);
  stack.push(arr.length - 1);
  while (stack.length > 0) {
    let high = stack.pop();
    let low = stack.pop();
    let p = partition(arr, low, high);
    if (p - 1 > low) {
      stack.push(low);
      stack.push(p - 1);
    }
    if (p + 1 < high) {
      stack.push(p + 1);
      stack.push(high);
    }
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j <= high - 1; j++) {
    if (arr[j] < pivot) {
      i++;
      let temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
    }
  }
  let temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
  return i + 1;
}`,
  run: function*(arr: number[]): Generator<StepState, void, unknown> {
    const data = [...arr];
    const stack = [0, data.length - 1];
    yield { line: 2, vars: { stack }, data: [...data], message: `Initialize stack with full range` };
    
    while(stack.length > 0) {
      const high = stack.pop()!;
      const low = stack.pop()!;
      yield { line: 7, vars: { low, high }, data: [...data], pointers: { low, high }, message: `Pop low=${low}, high=${high}` };
      
      const pivot = data[high];
      let i = low - 1;
      yield { line: 22, vars: { low, high, pivot, i }, data: [...data], pointers: { low, high, pivot: high }, activeIndices: [high], message: `Partition around pivot ${pivot}` };
      
      for (let j = low; j <= high - 1; j++) {
        yield { line: 24, vars: { i, j, pivot }, data: [...data], pointers: { low, high, pivot: high, i, j }, activeIndices: [j, high], message: `Is data[${j}] < ${pivot}?` };
        if (data[j] < pivot) {
          i++;
          const temp = data[i]; data[i] = data[j]; data[j] = temp;
          yield { line: 26, vars: { i, j }, data: [...data], pointers: { low, high, pivot: high, i, j }, swappedIndices: [i, j], message: `Swap data[${i}] and data[${j}]` };
        }
      }
      const temp = data[i + 1]; data[i + 1] = data[high]; data[high] = temp;
      yield { line: 29, vars: { i, high }, data: [...data], pointers: { low, high, 'newPivot': i+1 }, swappedIndices: [i + 1, high], message: `Place pivot in correct position (${i + 1})` };
      
      const p = i + 1;
      if (p - 1 > low) {
        stack.push(low, p - 1);
        yield { line: 10, vars: { low, 'p-1': p-1, stack }, data: [...data], pointers: { low, high, p }, message: `Push left subarray [${low}...${p-1}] to stack` };
      }
      if (p + 1 < high) {
        stack.push(p + 1, high);
        yield { line: 14, vars: { 'p+1': p+1, high, stack }, data: [...data], pointers: { low, high, p }, message: `Push right subarray [${p+1}...${high}] to stack` };
      }
    }
  }
};
