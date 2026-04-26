import { DsaOperation, StepState } from '../models';

export const stackPushOp: DsaOperation = {
  id: 'stack-push',
  name: 'Push (Stack)',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, 30],
  defaultArgs: [40],
  code: `function push(stack, value) {
  stack[stack.length] = value;
}`,
  run: function*(stack: number[], value: number): Generator<StepState, void, unknown> {
    const data = [...stack];
    yield { line: 1, vars: { value, 'stack.length': data.length }, data: [...data], message: `Pushing ${value} onto the stack` };
    
    data.push(value);
    yield { line: 2, vars: { value, 'stack.length': data.length }, data: [...data], pointers: { top: data.length - 1 }, activeIndices: [data.length - 1], message: `Added ${value} to top of the stack` };
  }
};

export const stackPopOp: DsaOperation = {
  id: 'stack-pop',
  name: 'Pop (Stack)',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, 30],
  defaultArgs: [],
  code: `function pop(stack) {
  if (stack.length === 0) return undefined;
  const value = stack[stack.length - 1];
  stack.length = stack.length - 1;
  return value;
}`,
  run: function*(stack: number[]): Generator<StepState, void, unknown> {
    const data = [...stack];
    yield { line: 1, vars: { 'stack.length': data.length }, data: [...data], pointers: { top: data.length - 1 }, message: `Start Pop operation` };
    
    if (data.length === 0) {
      yield { line: 2, vars: {}, data: [...data], message: `Stack is empty, returning undefined` };
      return;
    }
    
    const value = data[data.length - 1];
    yield { line: 3, vars: { value }, data: [...data], pointers: { top: data.length - 1 }, activeIndices: [data.length - 1], message: `Value to pop is ${value}` };
    
    data.pop();
    yield { line: 4, vars: { value }, data: [...data], pointers: { top: data.length - 1 }, message: `Removed ${value} from the stack` };
    
    yield { line: 5, vars: { value }, data: [...data], pointers: { top: data.length - 1 }, message: `Returning ${value}` };
  }
};

export const queueEnqueueOp: DsaOperation = {
  id: 'queue-enqueue',
  name: 'Enqueue (Queue)',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, 30],
  defaultArgs: [40],
  code: `function enqueue(queue, value) {
  queue[queue.length] = value;
}`,
  run: function*(queue: number[], value: number): Generator<StepState, void, unknown> {
    const data = [...queue];
    yield { line: 1, vars: { value, 'queue.length': data.length }, data: [...data], message: `Enqueue ${value} to queue` };
    
    data.push(value);
    yield { line: 2, vars: { value, 'queue.length': data.length }, data: [...data], pointers: { rear: data.length - 1, front: 0 }, activeIndices: [data.length - 1], message: `Added ${value} at the rear` };
  }
};

export const queueDequeueOp: DsaOperation = {
  id: 'queue-dequeue',
  name: 'Dequeue (Queue)',
  complexities: { time: 'O(n)*', space: 'O(1)' },
  defaultInput: [10, 20, 30],
  defaultArgs: [],
  code: `function dequeue(queue) {
  if (queue.length === 0) return undefined;
  const value = queue[0];
  for(let i = 0; i < queue.length - 1; i++) {
    queue[i] = queue[i+1];
  }
  queue.length = queue.length - 1;
  return value;
}`,
  run: function*(queue: number[]): Generator<StepState, void, unknown> {
    const data = [...queue];
    yield { line: 1, vars: { 'queue.length': data.length }, data: [...data], pointers: { front: 0, rear: data.length - 1 }, message: `Start Dequeue operation` };
    
    if (data.length === 0) {
      yield { line: 2, vars: {}, data: [...data], message: `Queue is empty, returning undefined` };
      return;
    }
    
    const value = data[0];
    yield { line: 3, vars: { value }, data: [...data], pointers: { front: 0, rear: data.length - 1 }, activeIndices: [0], message: `Value to dequeue is ${value}` };
    
    for(let i = 0; i < data.length - 1; i++) {
      yield { line: 4, vars: { i, value }, data: [...data], activeIndices: [i, i+1] , message: `Shift element at index ${i+1} to ${i}`};
      data[i] = data[i+1];
      yield { line: 5, vars: { i, value }, data: [...data], swappedIndices: [i, i+1], message: `queue[${i}] = queue[${i+1}]` };
    }
    
    data.pop();
    yield { line: 7, vars: { value }, data: [...data], pointers: { front: 0, rear: data.length - 1 }, message: `Removed last element duplicate` };
    
    yield { line: 8, vars: { value }, data: [...data], pointers: { front: 0, rear: data.length - 1 }, message: `Returning ${value}` };
  }
};

export const stackPeekOp: DsaOperation = {
  id: 'stack-peek',
  name: 'Peek (Stack)',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, 30],
  defaultArgs: [],
  code: `function peek(stack) {
  if (stack.length === 0) return undefined;
  return stack[stack.length - 1];
}`,
  run: function*(stack: number[]): Generator<StepState, void, unknown> {
    const data = [...stack];
    yield { line: 1, vars: {}, data: [...data], pointers: { top: data.length - 1 }, message: `Start Peek operation` };
    if (data.length === 0) {
      yield { line: 2, vars: {}, data: [...data], message: `Stack is empty, returning undefined` };
      return;
    }
    const val = data[data.length - 1];
    yield { line: 3, vars: { topValue: val }, data: [...data], pointers: { top: data.length - 1 }, activeIndices: [data.length - 1], message: `Returning top value: ${val}` };
  }
};

export const queuePeekOp: DsaOperation = {
  id: 'queue-peek',
  name: 'Peek (Queue)',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, 30],
  defaultArgs: [],
  code: `function peek(queue) {
  if (queue.length === 0) return undefined;
  return queue[0];
}`,
  run: function*(queue: number[]): Generator<StepState, void, unknown> {
    const data = [...queue];
    yield { line: 1, vars: {}, data: [...data], pointers: { front: 0, rear: data.length - 1 }, message: `Start Peek operation` };
    if (data.length === 0) {
      yield { line: 2, vars: {}, data: [...data], message: `Queue is empty, returning undefined` };
      return;
    }
    const val = data[0];
    yield { line: 3, vars: { frontValue: val }, data: [...data], pointers: { front: 0, rear: data.length - 1 }, activeIndices: [0], message: `Returning front value: ${val}` };
  }
};

export const circularQueueEnqueueOp: DsaOperation = {
  id: 'circular-queue-enqueue',
  name: 'Circular Enqueue',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, "null", "null", "null"],
  defaultArgs: [30, 0, 1],
  code: `function enqueue(queue, value, front, rear) {
  const maxSize = queue.length;
  if ((rear + 1) % maxSize === front) {
    return false; // full
  }
  rear = (rear + 1) % maxSize;
  queue[rear] = value;
  return true;
}`,
  run: function*(queue: any[], value: number, front: number, rear: number): Generator<StepState, void, unknown> {
    const data = [...queue];
    const maxSize = data.length;
    yield { line: 1, vars: { value, front, rear, maxSize }, data: [...data], pointers: { front, rear }, message: `Start Circular Enqueue` };
    
    yield { line: 3, vars: { front, rear }, data: [...data], pointers: { front, rear }, message: `Check if full` };
    if ((rear + 1) % maxSize === front) {
      yield { line: 4, vars: {}, data: [...data], pointers: { front, rear }, message: `Queue is full` };
      return;
    }
    
    rear = (rear + 1) % maxSize;
    yield { line: 6, vars: { rear }, data: [...data], pointers: { front, rear }, message: `Update rear to ${rear}` };
    
    data[rear] = value;
    yield { line: 7, vars: { rear, value }, data: [...data], pointers: { front, rear }, activeIndices: [rear], message: `Set queue[${rear}] = ${value}` };
    
    yield { line: 8, vars: {}, data: [...data], pointers: { front, rear }, message: `Return true` };
  }
};

export const circularQueueDequeueOp: DsaOperation = {
  id: 'circular-queue-dequeue',
  name: 'Circular Dequeue',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, 30, "null", "null"],
  defaultArgs: [0, 2], // front=0, rear=2
  code: `function dequeue(queue, front, rear) {
  const maxSize = queue.length;
  if (front === -1) {
    return false; // empty
  }
  let value = queue[front];
  queue[front] = "null";
  if (front === rear) {
    front = -1;
    rear = -1;
  } else {
    front = (front + 1) % maxSize;
  }
  return value;
}`,
  run: function*(queue: any[], front: number, rear: number): Generator<StepState, void, unknown> {
    const data = [...queue];
    const maxSize = data.length;
    yield { line: 2, vars: { front, rear, maxSize }, data: [...data], pointers: { front, rear }, message: `Start Circular Dequeue` };
    
    yield { line: 3, vars: { front }, data: [...data], pointers: { front, rear }, message: `Check if empty` };
    if (front === -1) {
      yield { line: 4, vars: {}, data: [...data], pointers: { front, rear }, message: `Queue is empty` };
      return;
    }
    
    const value = data[front];
    yield { line: 6, vars: { value, front }, data: [...data], pointers: { front, rear }, activeIndices: [front], message: `value = queue[${front}] (${value})` };
    
    data[front] = "null";
    yield { line: 7, vars: { front }, data: [...data], pointers: { front, rear }, activeIndices: [front], message: `clear queue[${front}]` };
    
    yield { line: 8, vars: { front, rear }, data: [...data], pointers: { front, rear }, message: `Check if front == rear` };
    if (front === rear) {
      front = -1;
      rear = -1;
      yield { line: 10, vars: { front, rear }, data: [...data], message: `Reset front=-1, rear=-1` };
    } else {
      front = (front + 1) % maxSize;
      yield { line: 12, vars: { front }, data: [...data], pointers: { front, rear }, message: `front = ${front}` };
    }
    yield { line: 14, vars: { value }, data: [...data], pointers: { front, rear }, message: `Return ${value}` };
  }
};

export const stackCreateFromArrayOp: DsaOperation = {
  id: 'stack-create-array',
  name: 'Array to Stack',
  complexities: { time: 'O(n)', space: 'O(n)' },
  defaultInput: [10, 20, 30, 40],
  defaultArgs: [],
  code: `function createStack(arr) {
  let stack = [];
  for (let i = 0; i < arr.length; i++) {
    stack.push(arr[i]);
  }
  return stack;
}`,
  run: function*(data: number[]): Generator<StepState, void, unknown> {
    const arr = data || [];
    const stack: number[] = [];
    yield { line: 2, vars: { arr: JSON.stringify(arr), stack: "[]" }, data: [...stack], message: `Initialize empty stack` };
    
    for (let i = 0; i < arr.length; i++) {
      yield { line: 3, vars: { i, val: arr[i] }, data: [...stack], message: `Process arr[${i}] = ${arr[i]}` };
      stack.push(arr[i]);
      yield { line: 4, vars: { i, pushed: arr[i] }, data: [...stack], activeIndices: [stack.length - 1], message: `Push ${arr[i]} into stack` };
    }
    
    yield { line: 6, vars: {}, data: [...stack], message: `Return stack` };
  }
};

export const queueCreateFromArrayOp: DsaOperation = {
  id: 'queue-create-array',
  name: 'Array to Queue',
  complexities: { time: 'O(n)', space: 'O(n)' },
  defaultInput: [10, 20, 30, 40],
  defaultArgs: [],
  code: `function createQueue(arr) {
  let queue = [];
  for (let i = 0; i < arr.length; i++) {
    queue.push(arr[i]);
  }
  return queue;
}`,
  run: function*(data: number[]): Generator<StepState, void, unknown> {
    const arr = data || [];
    const queue: number[] = [];
    yield { line: 2, vars: { arr: JSON.stringify(arr), queue: "[]" }, data: [...queue], message: `Initialize empty queue` };
    
    for (let i = 0; i < arr.length; i++) {
      yield { line: 3, vars: { i, val: arr[i] }, data: [...queue], message: `Process arr[${i}] = ${arr[i]}` };
      queue.push(arr[i]);
      yield { line: 4, vars: { i, enqueued: arr[i] }, data: [...queue], activeIndices: [queue.length - 1], message: `Enqueue ${arr[i]}` };
    }
    
    yield { line: 6, vars: {}, data: [...queue], message: `Return queue` };
  }
};

export const circularQueueCreateFromArrayOp: DsaOperation = {
  id: 'circ-queue-create-array',
  name: 'Array to Circular Queue',
  complexities: { time: 'O(n)', space: 'O(n)' },
  defaultInput: [10, 20, 30, 40],
  defaultArgs: ["5"],
  code: `function createCircularQueue(arr, maxSize) {
  let queue = new Array(maxSize).fill(null);
  let front = -1, rear = -1;
  for (let i = 0; i < arr.length && i < maxSize; i++) {
    if (front === -1) front = 0;
    rear = (rear + 1) % maxSize;
    queue[rear] = arr[i];
  }
  return queue;
}`,
  run: function*(data: number[], maxSizeStr: string): Generator<StepState, void, unknown> {
    const arr = data || [];
    let maxSize = parseInt(maxSizeStr);
    if (isNaN(maxSize) || maxSize <= 0) maxSize = Math.max(arr.length, 5);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queue: any[] = new Array(maxSize).fill("null");
    let front = -1, rear = -1;
    
    yield { line: 2, vars: { maxSize, queue: "Array(" + maxSize + ")" }, data: [...queue], message: `Initialize array of size ${maxSize}` };
    yield { line: 3, vars: { front, rear }, data: [...queue], pointers: { front, rear }, message: `Set front=-1, rear=-1` };
    
    for (let i = 0; i < arr.length && i < maxSize; i++) {
      yield { line: 4, vars: { i, val: arr[i] }, data: [...queue], pointers: { front, rear }, message: `Process arr[${i}] = ${arr[i]}` };
      
      if (front === -1) {
        front = 0;
        yield { line: 5, vars: { front }, data: [...queue], pointers: { front, rear }, message: `First item, setting front=0` };
      }
      
      rear = (rear + 1) % maxSize;
      yield { line: 6, vars: { rear }, data: [...queue], pointers: { front, rear }, message: `rear = ${rear}` };
      
      queue[rear] = arr[i];
      yield { line: 7, vars: { rear, val: arr[i] }, data: [...queue], pointers: { front, rear }, activeIndices: [rear], message: `queue[${rear}] = ${arr[i]}` };
    }
    
    yield { line: 9, vars: {}, data: [...queue], pointers: { front, rear }, message: `Return queue` };
  }
};
