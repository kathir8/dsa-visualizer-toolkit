import { DsaOperation, StepState } from '../models';

export const arrayInsertOp: DsaOperation = {
  id: 'array-insert',
  name: 'Insert',
  complexities: { time: 'O(n)', space: 'O(1)' },
  defaultInput: [10, 20, 30, 40, 50],
  defaultArgs: [2, 99],
  code: `function insertAt(arr, index, value) {
  for (let i = arr.length; i > index; i--) {
    arr[i] = arr[i - 1];
  }
  arr[index] = value;
}`,
  run: function*(arr: number[], index: number, value: number): Generator<StepState, void, unknown> {
    const data = [...arr];
    yield { line: 1, vars: { index, value }, data: [...data], message: `Start insert ${value} at index ${index}` };
    
    for (let i = data.length; i > index; i--) {
      yield { line: 2, vars: { i, index, value }, data: [...data], pointers: { i }, message: `Shift elements to the right` };
      data[i] = data[i - 1];
      yield { line: 3, vars: { i, index, value, 'arr[i]': data[i] }, data: [...data], pointers: { i }, swappedIndices: [i, i-1], message: `arr[${i}] = arr[${i-1}]` };
    }
    
    data[index] = value;
    yield { line: 5, vars: { index, value }, data: [...data], pointers: { index }, activeIndices: [index], message: `arr[${index}] = ${value}` };
  }
};

export const arrayDeleteOp: DsaOperation = {
  id: 'array-delete',
  name: 'Delete',
  complexities: { time: 'O(n)', space: 'O(1)' },
  defaultInput: [10, 20, 30, 40, 50],
  defaultArgs: [2],
  code: `function deleteAt(arr, index) {
  for (let i = index; i < arr.length - 1; i++) {
    arr[i] = arr[i + 1];
  }
  arr.length--;
}`,
  run: function*(arr: number[], index: number): Generator<StepState, void, unknown> {
    const data = [...arr];
    yield { line: 1, vars: { index }, data: [...data], pointers: { index }, activeIndices: [index], message: `Start delete at index ${index}` };
    
    for (let i = index; i < data.length - 1; i++) {
      yield { line: 2, vars: { i, index }, data: [...data], pointers: { i }, message: `Shift element from right to left` };
      data[i] = data[i + 1];
      yield { line: 3, vars: { i, index, 'arr[i]': data[i] }, data: [...data], pointers: { i }, swappedIndices: [i, i+1], message: `arr[${i}] = arr[${i+1}]` };
    }
    
    data.pop();
    yield { line: 5, vars: { index }, data: [...data], pointers: {}, message: `Removed last duplicated element` };
  }
};

export const arrayAccessOp: DsaOperation = {
  id: 'array-access',
  name: 'Access',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, 30, 40, 50],
  defaultArgs: [3],
  code: `function access(arr, index) {
  if (index >= 0 && index < arr.length) {
    return arr[index];
  }
  return undefined;
}`,
  run: function*(arr: number[], index: number): Generator<StepState, void, unknown> {
    const data = [...arr];
    yield { line: 1, vars: { index }, data: [...data], message: `Start access at index ${index}` };
    
    yield { line: 2, vars: { index, 'arr.length': data.length }, data: [...data], message: `Check index bounds` };
    if (index >= 0 && index < data.length) {
      yield { line: 3, vars: { index, value: data[index] }, data: [...data], pointers: { index }, activeIndices: [index], message: `Return value ${data[index]}` };
      return;
    }
    yield { line: 5, vars: { index }, data: [...data], message: `Index out of bounds` };
  }
};

export const arrayUpdateOp: DsaOperation = {
  id: 'array-update',
  name: 'Update',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, 30, 40, 50],
  defaultArgs: [2, 99],
  code: `function update(arr, index, value) {
  if (index >= 0 && index < arr.length) {
    arr[index] = value;
  }
}`,
  run: function*(arr: number[], index: number, value: number): Generator<StepState, void, unknown> {
    const data = [...arr];
    yield { line: 1, vars: { index, value }, data: [...data], message: `Start update at index ${index} with value ${value}` };
    
    yield { line: 2, vars: { index, value, 'arr.length': data.length }, data: [...data], message: `Check index bounds` };
    if (index >= 0 && index < data.length) {
      data[index] = value;
      yield { line: 3, vars: { index, value }, data: [...data], pointers: { index }, activeIndices: [index], message: `Updated arr[${index}] to ${value}` };
    }
  }
};
