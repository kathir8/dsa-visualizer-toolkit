import { DsaOperation, StepState } from '../models';

export const linearSearchOp: DsaOperation = {
  id: 'linear-search',
  name: 'Linear Search',
  complexities: { time: 'O(n)', space: 'O(1)' },
  defaultInput: [12, 45, 23, 78, 56, 89, 34],
  defaultArgs: [78],
  code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
  run: function*(arr: number[], target: number): Generator<StepState, void, unknown> {
    const data = [...arr];
    yield { line: 1, vars: { target }, data: [...data], message: `Start Linear Search for target ${target}` };
    
    for (let i = 0; i < data.length; i++) {
      yield { line: 2, vars: { i, target }, data: [...data], pointers: { i }, message: `Checking index ${i}` };
      yield { line: 3, vars: { i, 'arr[i]': data[i], target }, data: [...data], pointers: { i }, activeIndices: [i], message: `Is ${data[i]} === target?` };
      
      if (data[i] === target) {
        yield { line: 4, vars: { i, target }, data: [...data], pointers: { i }, activeIndices: [i], message: `Target found at index ${i}!` };
        return;
      }
    }
    
    yield { line: 7, vars: { target }, data: [...data], message: 'Target not found' };
  }
};

export const binarySearchOp: DsaOperation = {
  id: 'binary-search',
  name: 'Binary Search',
  complexities: { time: 'O(log n)', space: 'O(1)' },
  defaultInput: [12, 23, 34, 45, 56, 78, 89],
  defaultArgs: [56],
  code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
  run: function*(arr: number[], target: number): Generator<StepState, void, unknown> {
    const data = [...arr];
    yield { line: 1, vars: { target }, data: [...data], message: `Start Binary Search for ${target}` };
    
    let left = 0;
    yield { line: 2, vars: { left, target }, data: [...data], pointers: { left }, message: `left = ${left}` };
    
    let right = data.length - 1;
    yield { line: 3, vars: { left, right, target }, data: [...data], pointers: { left, right }, message: `right = ${right}` };
    
    while (left <= right) {
      yield { line: 4, vars: { left, right, target }, data: [...data], pointers: { left, right }, message: `left <= right` };
      
      const mid = Math.floor((left + right) / 2);
      yield { line: 5, vars: { left, right, mid, target }, data: [...data], pointers: { left, right, mid }, message: `mid = ${mid}` };
      
      yield { line: 6, vars: { left, right, mid, 'arr[mid]': data[mid], target }, data: [...data], pointers: { left, right, mid }, activeIndices: [mid], message: `Is arr[mid] === ${target}?` };
      if (data[mid] === target) {
        yield { line: 7, vars: { left, right, mid, target }, data: [...data], pointers: { left, right, mid }, activeIndices: [mid], message: `Found at ${mid}!` };
        return;
      }
      
      yield { line: 8, vars: { left, right, mid, target }, data: [...data], pointers: { left, right, mid }, activeIndices: [mid], message: `Is arr[mid] < ${target}?` };
      if (data[mid] < target) {
        left = mid + 1;
        yield { line: 9, vars: { left, right, mid, target }, data: [...data], pointers: { left, right, mid }, message: `Target is greater, set left = ${left}` };
      } else {
        right = mid - 1;
        yield { line: 11, vars: { left, right, mid, target }, data: [...data], pointers: { left, right, mid }, message: `Target is smaller, set right = ${right}` };
      }
    }
    
    yield { line: 14, vars: { left, right, target }, data: [...data], pointers: { left, right }, message: 'Target not found' };
  }
};

export const exponentialSearchOp: DsaOperation = {
  id: 'exponential-search',
  name: 'Exponential Search',
  complexities: { time: 'O(log n)', space: 'O(1)' },
  defaultInput: [2, 3, 4, 10, 40, 50, 60, 70],
  defaultArgs: [60],
  code: `function exponentialSearch(arr, target) {
  if (arr[0] === target) return 0;
  let i = 1;
  while (i < arr.length && arr[i] <= target) {
    i = i * 2;
  }
  let left = Math.floor(i / 2);
  let right = Math.min(i, arr.length - 1);
  return binarySearchRange(arr, target, left, right);
}

function binarySearchRange(arr, target, left, right) {
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
  run: function*(arr: number[], target: number): Generator<StepState, void, unknown> {
    const data = [...arr];
    yield { line: 1, vars: { target }, data: [...data], message: `Start Exponential Search` };
    yield { line: 2, vars: { target }, data: [...data], pointers: { top: 0 }, activeIndices: [0], message: `Check if arr[0] is target` };
    if (data[0] === target) {
      yield { line: 2, vars: { target }, data: [...data], pointers: { top: 0 }, activeIndices: [0], message: `Found at index 0` };
      return;
    }
    let i = 1;
    yield { line: 3, vars: { i }, data: [...data], pointers: { i }, message: `i = 1` };
    
    while (i < data.length && data[i] <= target) {
      yield { line: 4, vars: { i, 'arr[i]': data[i], target }, data: [...data], pointers: { i }, activeIndices: [i], message: `Check if arr[${i}] <= target` };
      i = i * 2;
      yield { line: 5, vars: { i }, data: [...data], pointers: { i }, message: `Double i: i = ${i}` };
    }
    
    const left = Math.floor(i / 2);
    yield { line: 7, vars: { i, left }, data: [...data], pointers: { left }, message: `left = Math.floor(i / 2)` };
    const right = Math.min(i, data.length - 1);
    yield { line: 8, vars: { left, right }, data: [...data], pointers: { left, right }, message: `right = Math.min(i, arr.length - 1)` };
    yield { line: 9, vars: { left, right }, data: [...data], pointers: { left, right }, message: `Call binarySearchRange` };
    
    yield { line: 12, vars: { left, right }, data: [...data], pointers: { left, right }, message: `Inside binarySearchRange` };
    // Simulate Binary Search inline
    let currentLeft = left;
    let currentRight = right;

    while (currentLeft <= currentRight) {
      yield { line: 13, vars: { left: currentLeft, right: currentRight }, data: [...data], pointers: { left: currentLeft, right: currentRight }, message: `while left <= right` };
      const mid = Math.floor((currentLeft + currentRight) / 2);
      yield { line: 14, vars: { left: currentLeft, right: currentRight, mid }, data: [...data], pointers: { left: currentLeft, right: currentRight, mid }, message: `mid = ${mid}` };
      
      yield { line: 15, vars: { mid, 'arr[mid]': data[mid] }, data: [...data], pointers: { left: currentLeft, right: currentRight, mid }, activeIndices: [mid], message: `Check arr[mid] === target` };
      if (data[mid] === target) {
        yield { line: 15, vars: {}, data: [...data], pointers: { left: currentLeft, right: currentRight, mid }, activeIndices: [mid], message: `Found at ${mid}!` };
        return;
      }
      if (data[mid] < target) {
         currentLeft = mid + 1;
         yield { line: 16, vars: { left: currentLeft }, data: [...data], pointers: { left: currentLeft, right: currentRight, mid }, message: `Target > arr[mid], left = ${currentLeft}` };
      } else {
         currentRight = mid - 1;
         yield { line: 17, vars: { right: currentRight }, data: [...data], pointers: { left: currentLeft, right: currentRight, mid }, message: `Target < arr[mid], right = ${currentRight}` };
      }
    }
    yield { line: 19, vars: {}, data: [...data], message: `Target not found` };
  }
};
