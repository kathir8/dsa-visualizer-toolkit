import { DsaOperation, StepState } from '../models';

export const graphBfsOp: DsaOperation = {
  id: 'graph-bfs',
  name: 'Breadth First Search (BFS)',
  complexities: { time: 'O(V + E)', space: 'O(V)' },
  defaultInput: [[1, 2], [0, 3, 4], [0], [1], [1]],
  defaultArgs: [0], // start node
  code: `function bfs(graph, start) {
  let visited = new Set();
  let queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    let node = queue.shift();
    // process node
    for (let neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
  run: function*(graph: number[][], start: number): Generator<StepState, void, unknown> {
    const data = JSON.parse(JSON.stringify(graph));
    yield { line: 1, vars: { start }, data: [...data], message: 'Start BFS' };
    
    const visited = new Set<number>();
    yield { line: 2, vars: { start, visited: Array.from(visited) }, data: [...data], message: 'let visited = new Set()' };
    
    const queue = [start];
    yield { line: 3, vars: { queue }, data: [...data], activeIndices: [start], message: `let queue = [${start}]` };
    
    visited.add(start);
    yield { line: 4, vars: { visited: Array.from(visited), queue }, data: [...data], message: `visited.add(${start})` };
    
    while (queue.length > 0) {
      const node = queue.shift()!;
      yield { line: 7, vars: { node, queue, visited: Array.from(visited) }, data: [...data], pointers: { currentNode: node }, message: `node = queue.shift() (${node})` };
      
      const neighbors = Array.isArray(graph[node]) ? graph[node] : [];
      for (const neighbor of neighbors) {
        yield { line: 10, vars: { node, neighbor, queue, visited: Array.from(visited) }, data: [...data], pointers: { currentNode: node, neighbor }, activeIndices: [neighbor], message: `Check neighbor ${neighbor}` };
        
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          yield { line: 12, vars: { node, neighbor, queue, visited: Array.from(visited) }, data: [...data], pointers: { currentNode: node, neighbor }, activeIndices: [neighbor], message: `Visited ${neighbor}, added to queue` };
        }
      }
    }
    yield { line: 16, vars: { visited: Array.from(visited) }, data: [...data], message: 'BFS complete' };
  }
};

export const graphDfsOp: DsaOperation = {
  id: 'graph-dfs',
  name: 'Depth First Search (DFS)',
  complexities: { time: 'O(V + E)', space: 'O(V)' },
  defaultInput: [[1, 2], [0, 3, 4], [0], [1], [1]],
  defaultArgs: [0], // start node
  code: `function dfs(graph, start) {
  let visited = new Set();
  
  function explore(node) {
    if (visited.has(node)) return;
    visited.add(node);
    for (let neighbor of graph[node]) {
      explore(neighbor);
    }
  }
  
  explore(start);
}`,
  run: function*(graph: number[][], start: number): Generator<StepState, void, unknown> {
    const data = JSON.parse(JSON.stringify(graph));
    const visited = new Set<number>();
    yield { line: 1, vars: { start }, data: [...data], message: 'Start DFS' };
    yield { line: 2, vars: { visited: Array.from(visited) }, data: [...data], message: 'let visited = new Set()' };
    
    // To yield from within recursive function, we'll maintain a mock call stack 
    // or just inline the recursion using an iterative approach simulating call stack for yielding
    // or pass the generator implicitly by just doing it iteratively
    
    const stack = [start];
    
    while(stack.length > 0) {
       const node = stack.pop()!;
       yield { line: 4, vars: { node }, data: [...data], pointers: { exploreNode: node }, message: `explore(${node})` };
       if (visited.has(node)) {
         yield { line: 5, vars: { node }, data: [...data], pointers: { exploreNode: node }, message: `already visited ${node}` };
         continue;
       }
       visited.add(node);
       yield { line: 6, vars: { node, visited: Array.from(visited) }, data: [...data], pointers: { exploreNode: node }, activeIndices: [node], message: `visited.add(${node})` };
       
       const neighbors = Array.isArray(graph[node]) ? [...graph[node]].reverse() : []; // reverse so we process in order like standard recursion
       for (const neighbor of neighbors) {
         yield { line: 7, vars: { node, neighbor }, data: [...data], pointers: { exploreNode: node, neighbor }, message: `push neighbor ${neighbor}` };
         stack.push(neighbor);
       }
    }
    
    yield { line: 12, vars: { visited: Array.from(visited) }, data: [...data], message: 'DFS complete' };
  }
};

export const btCreateFromArrayOp: DsaOperation = {
  id: 'bt-create-array',
  name: 'Array to Binary Tree',
  complexities: { time: 'O(n)', space: 'O(n)' },
  defaultInput: [1, 2, 3, 4, 5, 6, 7], // level-order representation
  defaultArgs: [],
  code: `function createBinaryTree(arr) {
  let adjList = [];
  for(let i=0; i<arr.length; i++) {
    adjList[i] = [];
    let left = 2*i + 1;
    let right = 2*i + 2;
    if(left < arr.length && arr[left] !== null) adjList[i].push(left);
    if(right < arr.length && arr[right] !== null) adjList[i].push(right);
  }
  return adjList;
}`,
  run: function*(data: any[]): Generator<StepState, void, unknown> {
    const arr = data || [];
    
    // We will build an adjacency list to visualize it as a graph
    const adjList: any[] = [];
    yield { line: 2, vars: { arr: JSON.stringify(arr) }, data: [...adjList], message: `Initialize adjacency list` };
    
    for (let i = 0; i < arr.length; i++) {
      adjList[i] = [];
      yield { line: 4, vars: { i, val: arr[i] }, data: JSON.parse(JSON.stringify(adjList)), message: `Initialize node ${i}` };
      
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      
      yield { line: 5, vars: { i, left, right }, data: JSON.parse(JSON.stringify(adjList)), message: `Calculate children indices for node ${i}` };
      
      if (left < arr.length && arr[left] !== null && arr[left] !== "null") {
        adjList[i].push(left);
        yield { line: 8, vars: { i, left }, data: JSON.parse(JSON.stringify(adjList)), message: `Add left child ${arr[left]} (index ${left}) to node ${i}` };
      }
      
      if (right < arr.length && arr[right] !== null && arr[right] !== "null") {
        adjList[i].push(right);
        yield { line: 9, vars: { i, right }, data: JSON.parse(JSON.stringify(adjList)), message: `Add right child ${arr[right]} (index ${right}) to node ${i}` };
      }
    }
    
    yield { line: 11, vars: {}, data: JSON.parse(JSON.stringify(adjList)), message: `Return binary tree adjList` };
  }
};

export const graphCreateFromArrayOp: DsaOperation = {
  id: 'graph-create-array',
  name: 'Array to Graph',
  complexities: { time: 'O(V+E)', space: 'O(V+E)' },
  defaultInput: [[1, 2], [0, 3], [0], [1]], // using an array-of-arrays represented as string for adjacency list or matrix
  defaultArgs: [],
  code: `function createGraph(adjList) {
  let graph = [];
  for (let i = 0; i < adjList.length; i++) {
    graph[i] = [];
    if (Array.isArray(adjList[i])) {
      for (let j = 0; j < adjList[i].length; j++) {
        graph[i].push(adjList[i][j]);
      }
    }
  }
  return graph;
}`,
  run: function*(data: any[]): Generator<StepState, void, unknown> {
    const adjList = data || [];
    
    const graph: any[] = [];
    yield { line: 2, vars: { adjList: JSON.stringify(adjList) }, data: [...graph], message: `Initialize graph` };
    
    for (let i = 0; i < adjList.length; i++) {
      graph[i] = [];
      yield { line: 4, vars: { i }, data: JSON.parse(JSON.stringify(graph)), message: `Initialize graph[${i}] = []` };
      if (Array.isArray(adjList[i])) {
        for (let j = 0; j < adjList[i].length; j++) {
          const neighbor = adjList[i][j];
          graph[i].push(neighbor);
          yield { line: 6, vars: { i, j, neighbor }, data: JSON.parse(JSON.stringify(graph)), message: `Add edge ${i} -> ${neighbor}` };
        }
      }
    }
    
    yield { line: 9, vars: {}, data: JSON.parse(JSON.stringify(graph)), message: `Return graph` };
  }
};
