import { DsaOperation, StepState } from '../models';

export const llInsertHeadOp: DsaOperation = {
  id: 'll-insert-head',
  name: 'Insert Head',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, 30],
  defaultArgs: [99],
  code: `function insertHead(head, value) {
  let newNode = { val: value, next: head };
  head = newNode;
  return head;
}`,
  run: function*(defaultList: number[], value: number): Generator<StepState, void, unknown> {
    const data = [...defaultList];
    yield { line: 1, vars: { value, head: data }, data: [...data], message: `Start insert head ${value}` };
    
    yield { line: 2, vars: { value, head: data }, data: [...data, value], pointers: { newNode: data.length }, activeIndices: [data.length], message: `Create new node` };
    
    data.unshift(value);
    yield { line: 3, vars: { value, head: data }, data: [...data], pointers: { newNode: 0, head: 0 }, activeIndices: [0], message: `Point head to new node` };
    
    yield { line: 4, vars: { value, head: data }, data: [...data], pointers: { head: 0 }, message: `Return new head` };
  }
};

export const llSearchOp: DsaOperation = {
  id: 'll-search',
  name: 'Search',
  complexities: { time: 'O(n)', space: 'O(1)' },
  defaultInput: [10, 20, 30, 40],
  defaultArgs: [30],
  code: `function search(head, target) {
  let curr = head;
  while (curr !== null) {
    if (curr.val === target) return curr;
    curr = curr.next;
  }
  return null;
}`,
  run: function*(defaultList: number[], target: number): Generator<StepState, void, unknown> {
    const data = [...defaultList];
    yield { line: 1, vars: { target }, data: [...data], message: `Start search for ${target}` };
    
    yield { line: 2, vars: { target }, data: [...data], pointers: { curr: 0 }, message: `curr = head` };
    
    for (let i = 0; i < data.length; i++) {
       yield { line: 3, vars: { target, 'curr.val': data[i] }, data: [...data], pointers: { curr: i }, message: `Is curr !== null?` };
       
       yield { line: 4, vars: { target, 'curr.val': data[i] }, data: [...data], pointers: { curr: i }, activeIndices: [i], message: `Is curr.val (${data[i]}) === target?` };
       if (data[i] === target) {
         yield { line: 4, vars: { target }, data: [...data], pointers: { curr: i }, activeIndices: [i], message: `Target found!` };
         return;
       }
       
       const nextIndex = i + 1 < data.length ? i + 1 : -1;
       if (nextIndex !== -1) {
         yield { line: 5, vars: { target }, data: [...data], pointers: { curr: nextIndex }, message: `curr = curr.next` };
       } else {
         yield { line: 5, vars: { target }, data: [...data], pointers: { curr: 'null' }, message: `curr = curr.next (null)` };
       }
    }
    
    yield { line: 7, vars: { target }, data: [...data], message: `Target not found, returning null` };
  }
};

export const llInsertTailOp: DsaOperation = {
  id: 'll-insert-tail',
  name: 'Insert Tail',
  complexities: { time: 'O(n)', space: 'O(1)' },
  defaultInput: [10, 20, 30],
  defaultArgs: [40],
  code: `function insertTail(head, value) {
  let newNode = { val: value, next: null };
  if (!head) return newNode;
  let curr = head;
  while (curr.next) {
    curr = curr.next;
  }
  curr.next = newNode;
  return head;
}`,
  run: function*(defaultList: number[], value: number): Generator<StepState, void, unknown> {
    const data = [...defaultList];
    yield { line: 1, vars: { value }, data: [...data], message: `Start insert tail` };
    yield { line: 2, vars: { value }, data: [...data, value], pointers: { newNode: data.length }, message: `Create newNode` };
    if (data.length === 0) {
      data.push(value);
      yield { line: 3, vars: { value }, data: [...data], pointers: { head: 0 }, message: `Head is null, return newNode` };
      return;
    }
    yield { line: 4, vars: { value }, data: [...data, value], pointers: { newNode: data.length, curr: 0 }, message: `curr = head` };
    
    let curr = 0;
    while (curr < data.length - 1) {
      yield { line: 5, vars: { curr }, data: [...data, value], pointers: { newNode: data.length, curr }, message: `Is curr.next valid?` };
      curr++;
      yield { line: 6, vars: { curr }, data: [...data, value], pointers: { newNode: data.length, curr }, message: `curr = curr.next` };
    }
    yield { line: 8, vars: { curr }, data: [...data, value], pointers: { newNode: data.length, curr }, activeIndices: [curr, data.length], message: `curr.next = newNode` };
    data.push(value);
    yield { line: 9, vars: {}, data: [...data], pointers: { head: 0, tail: data.length - 1 }, message: `Return head` };
  }
};

export const dllInsertHeadOp: DsaOperation = {
  id: 'dll-insert-head',
  name: 'DLL Insert Head',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, 30],
  defaultArgs: [99],
  code: `function insertHeadDLL(head, value) {
  let newNode = { val: value, prev: null, next: head };
  if (head) {
    head.prev = newNode;
  }
  head = newNode;
  return head;
}`,
  run: function*(defaultList: number[], value: number): Generator<StepState, void, unknown> {
    const data = [...defaultList];
    yield { line: 1, vars: { value }, data: [...data], message: `Start DLL insert head` };
    yield { line: 2, vars: { value }, data: [...data, value], pointers: { newNode: data.length }, message: `Create newNode with next = head` };
    
    if (data.length > 0) {
      yield { line: 4, vars: { value }, data: [...data, value], pointers: { newNode: data.length, head: 0 }, activeIndices: [0, data.length], message: `head.prev = newNode` };
    }
    
    data.unshift(value);
    yield { line: 6, vars: { value }, data: [...data], pointers: { head: 0 }, activeIndices: [0], message: `head = newNode` };
    yield { line: 7, vars: {}, data: [...data], pointers: { head: 0 }, message: `Return head` };
  }
};

export const llDeleteOp: DsaOperation = {
  id: 'll-delete',
  name: 'Delete Node',
  complexities: { time: 'O(n)', space: 'O(1)' },
  defaultInput: [10, 20, 30, 40],
  defaultArgs: [30],
  code: `function deleteNode(head, value) {
  if (!head) return null;
  if (head.val === value) return head.next;
  let curr = head;
  while (curr.next && curr.next.val !== value) {
    curr = curr.next;
  }
  if (curr.next) {
    curr.next = curr.next.next;
  }
  return head;
}`,
  run: function*(defaultList: number[], value: number): Generator<StepState, void, unknown> {
    const data = [...defaultList];
    yield { line: 1, vars: { value }, data: [...data], message: `Start delete node` };
    if (data.length === 0) return;
    if (data[0] === value) {
      data.shift();
      yield { line: 3, vars: { value }, data: [...data], activeIndices: [0], message: `Found at head, return head.next` };
      return;
    }
    yield { line: 4, vars: { value }, data: [...data], pointers: { curr: 0 }, message: `curr = head` };
    let curr = 0;
    while (curr + 1 < data.length && data[curr + 1] !== value) {
      yield { line: 5, vars: { curr }, data: [...data], pointers: { curr, 'curr.next': curr + 1 }, message: `Check curr.next` };
      curr++;
      yield { line: 6, vars: { curr }, data: [...data], pointers: { curr }, message: `curr = curr.next` };
    }
    
    if (curr + 1 < data.length) {
      yield { line: 8, vars: { curr }, data: [...data], pointers: { curr, target: curr + 1 }, activeIndices: [curr + 1], message: `Found node to delete` };
      data.splice(curr + 1, 1);
      yield { line: 9, vars: { curr }, data: [...data], pointers: { curr, next: curr + 1 }, message: `curr.next = curr.next.next` };
    }
  }
};

export const dllDeleteNodeOp: DsaOperation = {
  id: 'dll-delete-node',
  name: 'DLL Delete',
  complexities: { time: 'O(1)', space: 'O(1)' },
  defaultInput: [10, 20, 30, 40],
  defaultArgs: [2],
  code: `function deleteNodeDLL(list, nodeIndex) {
  let node = list.getNode(nodeIndex);
  if (!node) return;
  if (node.prev) {
    node.prev.next = node.next;
  }
  if (node.next) {
    node.next.prev = node.prev;
  }
}`,
  run: function*(defaultList: number[], nodeIdx: number): Generator<StepState, void, unknown> {
    const data = [...defaultList];
    yield { line: 2, vars: { nodeIdx }, data: [...data], pointers: { node: nodeIdx }, message: `Get node at index ${nodeIdx}` };
    if (nodeIdx < 0 || nodeIdx >= data.length) return;
    
    yield { line: 4, vars: { nodeIdx }, data: [...data], pointers: { node: nodeIdx, prev: nodeIdx - 1 }, message: `Check node.prev` };
    if (nodeIdx > 0) {
      yield { line: 5, vars: { nodeIdx }, data: [...data], pointers: { node: nodeIdx, prev: nodeIdx - 1, next: nodeIdx + 1 }, activeIndices: [nodeIdx - 1, nodeIdx + 1], message: `node.prev.next = node.next` };
    }
    
    yield { line: 7, vars: { nodeIdx }, data: [...data], pointers: { node: nodeIdx, next: nodeIdx + 1 }, message: `Check node.next` };
    if (nodeIdx < data.length - 1) {
      yield { line: 8, vars: { nodeIdx }, data: [...data], pointers: { node: nodeIdx, prev: nodeIdx - 1, next: nodeIdx + 1 }, activeIndices: [nodeIdx + 1, nodeIdx - 1], message: `node.next.prev = node.prev` };
    }
    
    data.splice(nodeIdx, 1);
    yield { line: 10, vars: {}, data: [...data], message: `Node removed from list` };
  }
};

export const llCreateFromArrayOp: DsaOperation = {
  id: 'll-create-array',
  name: 'Array to Linked List',
  complexities: { time: 'O(n)', space: 'O(n)' },
  defaultInput: [10, 20, 30, 40],
  defaultArgs: [],
  code: `function createList(arr) {
  if (!arr.length) return null;
  let head = { val: arr[0], next: null };
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    curr.next = { val: arr[i], next: null };
    curr = curr.next;
  }
  return head;
}`,
  run: function*(data: number[]): Generator<StepState, void, unknown> {
    const arr = data || [];
    
    yield { line: 1, vars: { arr: JSON.stringify(arr) }, data: [], message: `Initialize with array` };
    
    if (!arr.length) {
      yield { line: 2, vars: {}, data: [], message: `Array empty, return null` };
      return;
    }
    
    const elements: number[] = [arr[0]];
    yield { line: 3, vars: { head: arr[0] }, data: [...elements], pointers: { head: 0, curr: 0 }, activeIndices: [0], message: `Create head node` };
    
    for (let i = 1; i < arr.length; i++) {
      yield { line: 5, vars: { i, val: arr[i] }, data: [...elements], pointers: { head: 0, curr: i - 1 }, message: `Process arr[${i}] = ${arr[i]}` };
      elements.push(arr[i]);
      yield { line: 6, vars: { i, val: arr[i] }, data: [...elements], pointers: { head: 0, curr: i - 1, "curr.next": i }, activeIndices: [i], message: `Attach ${arr[i]} to list` };
      yield { line: 7, vars: { i }, data: [...elements], pointers: { head: 0, curr: i }, activeIndices: [i], message: `Move curr forward` };
    }
    
    yield { line: 9, vars: {}, data: [...elements], pointers: { head: 0 }, message: `Return head` };
  }
};

export const dllCreateFromArrayOp: DsaOperation = {
  id: 'dll-create-array',
  name: 'Array to Doubly Linked List',
  complexities: { time: 'O(n)', space: 'O(n)' },
  defaultInput: [10, 20, 30, 40],
  defaultArgs: [],
  code: `function createDoublyList(arr) {
  if (!arr.length) return null;
  let head = { val: arr[0], next: null, prev: null };
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    let newNode = { val: arr[i], next: null, prev: curr };
    curr.next = newNode;
    curr = newNode;
  }
  return head;
}`,
  run: function*(data: number[]): Generator<StepState, void, unknown> {
    const arr = data || [];
    
    yield { line: 1, vars: { arr: JSON.stringify(arr) }, data: [], message: `Initialize with array` };
    
    if (!arr.length) {
      yield { line: 2, vars: {}, data: [], message: `Array empty, return null` };
      return;
    }
    
    const elements: number[] = [arr[0]];
    yield { line: 3, vars: { head: arr[0] }, data: [...elements], pointers: { head: 0, curr: 0 }, activeIndices: [0], message: `Create head node` };
    
    for (let i = 1; i < arr.length; i++) {
      yield { line: 5, vars: { i, val: arr[i] }, data: [...elements], pointers: { head: 0, curr: i - 1 }, message: `Process arr[${i}] = ${arr[i]}` };
      elements.push(arr[i]);
      yield { line: 6, vars: { i, val: arr[i] }, data: [...elements], pointers: { curr: i - 1, newNode: i }, activeIndices: [i], message: `Create new node with prev=curr` };
      yield { line: 7, vars: { i }, data: [...elements], pointers: { curr: i - 1, "curr.next": i }, activeIndices: [i, i - 1], message: `Link curr to newNode` };
      yield { line: 8, vars: { i }, data: [...elements], pointers: { curr: i }, activeIndices: [i], message: `Move curr forward` };
    }
    
    yield { line: 10, vars: {}, data: [...elements], pointers: { head: 0 }, message: `Return head` };
  }
};
