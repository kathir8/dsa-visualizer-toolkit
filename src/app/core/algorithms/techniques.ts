import { DsaOperation, StepState } from '../models';

export const twoPointersOp: DsaOperation = {
  id: 'two-pointers-sum',
  name: 'Two Pointers (Target Sum)',
  complexities: { time: 'O(n)', space: 'O(1)' },
  defaultInput: [2, 7, 11, 15],
  defaultArgs: [9],
  code: `function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    let sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return null;
}`,
  run: function*(arr: number[], target: number): Generator<StepState, void, unknown> {
    const data = [...arr];
    let left = 0;
    let right = data.length - 1;
    yield { line: 2, vars: { left, right, target }, data: [...data], pointers: { left, right }, message: `Initialize pointers` };
    
    while (left < right) {
      const sum = data[left] + data[right];
      yield { line: 5, vars: { left, right, target, sum }, data: [...data], pointers: { left, right }, activeIndices: [left, right], message: `sum = ${data[left]} + ${data[right]} = ${sum}` };
      
      if (sum === target) {
         yield { line: 6, vars: { left, right, target, sum }, data: [...data], pointers: { left, right }, activeIndices: [left, right], message: `Found target!` };
         return;
      }
      
      if (sum < target) {
         left++;
         yield { line: 7, vars: { left, right, target, sum }, data: [...data], pointers: { left, right }, message: `sum < target, left++` };
      } else {
         right--;
         yield { line: 8, vars: { left, right, target, sum }, data: [...data], pointers: { left, right }, message: `sum > target, right--` };
      }
    }
  }
};

export const slidingWindowOp: DsaOperation = {
  id: 'sliding-window',
  name: 'Sliding Window (Max Sum)',
  complexities: { time: 'O(n)', space: 'O(1)' },
  defaultInput: [2, 1, 5, 1, 3, 2],
  defaultArgs: [3],
  code: `function maxSum(arr, k) {
  let maxSum = 0, windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
  run: function*(arr: number[], k: number): Generator<StepState, void, unknown> {
    const data = [...arr];
    let maxSum = 0, windowSum = 0;
    
    for (let i = 0; i < k; i++) {
      windowSum += data[i];
      const active = Array.from({length: i + 1}, (_, idx) => idx);
      yield { line: 4, vars: { i, windowSum }, data: [...data], pointers: { i }, activeIndices: active, message: `Add arr[${i}] to windowSum` };
    }
    maxSum = windowSum;
    yield { line: 6, vars: { maxSum, windowSum }, data: [...data], message: `maxSum = ${maxSum}` };
    
    for (let i = k; i < data.length; i++) {
      const left = i - k;
      windowSum = windowSum - data[left] + data[i];
      const active = Array.from({length: k}, (_, idx) => left + 1 + idx);
      yield { line: 8, vars: { i, windowSum, left_element: data[left], right_element: data[i] }, data: [...data], pointers: { windowEnd: i, windowStart: left + 1 }, activeIndices: active, message: `Slide window: -arr[${left}] + arr[${i}]` };
      
      maxSum = Math.max(maxSum, windowSum);
      yield { line: 9, vars: { i, maxSum, windowSum }, data: [...data], pointers: { windowEnd: i }, activeIndices: active, message: `maxSum = Math.max(maxSum, windowSum)` };
    }
  }
};

export const kadaneOp: DsaOperation = {
  id: 'kadane',
  name: 'Kadane (Max Subarray)',
  complexities: { time: 'O(n)', space: 'O(1)' },
  defaultInput: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
  defaultArgs: [],
  code: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currentMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  return maxSoFar;
}`,
  run: function*(nums: number[]): Generator<StepState, void, unknown> {
    const data = [...nums];
    let maxSoFar = data[0];
    let currentMax = data[0];
    yield { line: 2, vars: { maxSoFar, currentMax }, data: [...data], pointers: { i: 0 }, activeIndices: [0], message: `Initialize with first element` };
    
    for (let i = 1; i < data.length; i++) {
      currentMax = Math.max(data[i], currentMax + data[i]);
      yield { line: 5, vars: { i, currentMax, maxSoFar }, data: [...data], pointers: { i }, activeIndices: [i], message: `currentMax = max(${data[i]}, ${currentMax})` };
      
      maxSoFar = Math.max(maxSoFar, currentMax);
      yield { line: 6, vars: { i, currentMax, maxSoFar }, data: [...data], pointers: { i }, activeIndices: [i], message: `maxSoFar = max(${maxSoFar}, ${currentMax})` };
    }
  }
};

export const greedyCoinChangeOp: DsaOperation = {
  id: 'greedy-coin',
  name: 'Greedy (Coin Change)',
  complexities: { time: 'O(n)', space: 'O(1)' },
  defaultInput: [25, 10, 5, 1], // Denominations sorted desc
  defaultArgs: [67], // Target amount
  code: `function coinChange(coins, amount) {
  let count = 0;
  for (let i = 0; i < coins.length; i++) {
    while (amount >= coins[i]) {
      amount -= coins[i];
      count++;
    }
  }
  return count;
}`,
  run: function*(coins: number[], amount: number): Generator<StepState, void, unknown> {
    const data = [...coins];
    let count = 0;
    yield { line: 2, vars: { count, amount }, data: [...data], message: `Initialize count=0, target amount=${amount}` };
    
    for (let i = 0; i < data.length; i++) {
      yield { line: 3, vars: { i, count, amount }, data: [...data], pointers: { coin_idx: i }, message: `Check coin ${data[i]}` };
      while (amount >= data[i]) {
        yield { line: 4, vars: { count, amount, coin: data[i] }, data: [...data], pointers: { coin_idx: i }, activeIndices: [i], message: `amount ${amount} >= coin ${data[i]}` };
        amount -= data[i];
        count++;
        yield { line: 6, vars: { count, amount, coin: data[i] }, data: [...data], pointers: { coin_idx: i }, activeIndices: [i], message: `amount = ${amount}, count = ${count}` };
      }
    }
  }
};

export const dpFibonacciOp: DsaOperation = {
  id: 'dp-fibonacci',
  name: 'Dynamic Programming (Fib)',
  complexities: { time: 'O(n)', space: 'O(n)' },
  defaultInput: [0, 0, 0, 0, 0, 0, 0, 0], // DP array sizes
  defaultArgs: [7], // calculate up to fib(7)
  code: `function fibonacci(n) {
  let dp = new Array(n + 1).fill(0);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
  run: function*(dpArray: number[], n: number): Generator<StepState, void, unknown> {
    const data = new Array(n + 1).fill(0);
    yield { line: 2, vars: { n }, data: [...data], message: `let dp = new Array(${n + 1})` };
    
    data[0] = 0;
    yield { line: 3, vars: { n }, data: [...data], pointers: { idx: 0 }, activeIndices: [0], message: `dp[0] = 0` };
    
    if (n >= 1) {
      data[1] = 1;
      yield { line: 4, vars: { n }, data: [...data], pointers: { idx: 1 }, activeIndices: [1], message: `dp[1] = 1` };
    }
    
    for (let i = 2; i <= n; i++) {
      yield { line: 5, vars: { i }, data: [...data], pointers: { i }, message: `Calculate dp[${i}]` };
      data[i] = data[i - 1] + data[i - 2];
      yield { line: 6, vars: { i, 'dp[i]': data[i] }, data: [...data], pointers: { i }, activeIndices: [i], message: `dp[${i}] = ${data[i-1]} + ${data[i-2]} = ${data[i]}` };
    }
  }
};

export const recursionFactorialOp: DsaOperation = {
  id: 'recursion-factorial',
  name: 'Recursion (Factorial)',
  complexities: { time: 'O(n)', space: 'O(n)' },
  defaultInput: null, // No array input needed
  defaultArgs: [5], // max 10
  code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
  run: function*(dmy: unknown, argStr: string | number): Generator<StepState, void, unknown> {
    let n = typeof argStr === 'number' ? argStr : parseInt(argStr as string);
    if (isNaN(n) || n < 1) n = 1;
    if (n > 10) n = 10;
    
    const stack: number[] = [];

    
    function* fact(curr: number): Generator<StepState, number, unknown> {
      stack.push(curr);
      yield { line: 1, vars: { n: curr }, data: [...stack], message: `Call factorial(${curr})` };
      
      if (curr <= 1) {
        yield { line: 2, vars: { n: curr }, data: [...stack], message: `Base case reached: n <= 1, return 1` };
        stack.pop();
        return 1;
      }
      
      yield { line: 3, vars: { n: curr }, data: [...stack], message: `Compute ${curr} * factorial(${curr - 1})` };
      const sub = yield* fact(curr - 1);
      
      const res = curr * sub;
      yield { line: 3, vars: { n: curr, factorial_n_minus_1: sub }, data: [...stack], message: `Return ${curr} * ${sub} = ${res}` };
      stack.pop();
      return res;
    }
    
    yield* fact(n);
  }
};

export const backtrackingPermutationsOp: DsaOperation = {
  id: 'backtracking-permutations',
  name: 'Backtracking (Permutations)',
  complexities: { time: 'O(n!)', space: 'O(n)' },
  defaultInput: [1, 2, 3],
  defaultArgs: [],
  code: `function permute(nums) {
  const result = [];
  function backtrack(path, used) {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      path.push(nums[i]);
      used[i] = true;
      backtrack(path, used);
      path.pop();
      used[i] = false;
    }
  }
  backtrack([], []);
  return result;
}`,
  run: function*(nums: number[]): Generator<StepState, void, unknown> {
    const data = [...nums];
    const path: number[] = [];
    const used: boolean[] = new Array(nums.length).fill(false);
    let permCount = 0;
    
    yield { line: 2, vars: {}, data: [...data], message: `Initialize result array` };
    
    function* backtrack(): Generator<StepState, void, unknown> {
      yield { line: 4, vars: { path: '[' + path.join(',') + ']' }, data: [...data], activeIndices: path.map(p => data.indexOf(p)), message: `backtrack call check` };
      if (path.length === data.length) {
        permCount++;
        yield { line: 5, vars: { path: '[' + path.join(',') + ']', perms: permCount }, data: [...data], activeIndices: path.map(p => data.indexOf(p)), message: `Found permutation: [${path.join(',')}]` };
        return;
      }
      
      for (let i = 0; i < data.length; i++) {
        yield { line: 8, vars: { i, num: data[i] }, data: [...data], pointers: { current: i }, message: `Check nums[${i}] = ${data[i]}` };
        if (used[i]) {
            yield { line: 9, vars: { i, num: data[i] }, data: [...data], pointers: { current: i }, message: `${data[i]} already in path` };
            continue;
        }
        
        path.push(data[i]);
        used[i] = true;
        yield { line: 10, vars: { i, num: data[i], path: '[' + path.join(',') + ']' }, data: [...data], pointers: { current: i }, message: `Add ${data[i]} to path` };
        
        yield* backtrack();
        
        const popped = path.pop();
        used[i] = false;
        yield { line: 13, vars: { i, popped }, data: [...data], pointers: { current: i }, message: `Backtrack: pop ${popped}` };
      }
    }
    
    yield* backtrack();
  }
};

export const divideAndConquerBinarySearchOp: DsaOperation = {
  id: 'divide-conquer-bs',
  name: 'Divide & Conquer (Binary Search)',
  complexities: { time: 'O(log n)', space: 'O(log n)' },
  defaultInput: [2, 4, 6, 8, 10, 12, 14, 16],
  defaultArgs: [10],
  code: `function binarySearchDnC(arr, target, left, right) {
  if (left > right) return -1;
  let mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) {
    return binarySearchDnC(arr, target, mid + 1, right);
  } else {
    return binarySearchDnC(arr, target, left, mid - 1);
  }
}`,
  run: function*(arr: number[], target: number): Generator<StepState, void, unknown> {
    const data = [...arr];
    
    function* search(left: number, right: number): Generator<StepState, number, unknown> {
      yield { line: 2, vars: { left, right, target }, data: [...data], pointers: { left, right }, message: `Check left <= right` };
      if (left > right) {
          yield { line: 2, vars: { left, right }, data: [...data], message: `left > right, return -1` };
          return -1;
      }
      
      const mid = Math.floor((left + right) / 2);
      yield { line: 3, vars: { left, right, mid }, data: [...data], pointers: { left, right, mid }, message: `mid = ${mid} (val: ${data[mid]})` };
      
      yield { line: 4, vars: { mid }, data: [...data], pointers: { left, right, mid }, activeIndices: [mid], message: `Check if ${data[mid]} === ${target}` };
      if (data[mid] === target) {
        yield { line: 4, vars: { mid }, data: [...data], pointers: { left, right, mid }, activeIndices: [mid], message: `Found target at ${mid}` };
        return mid;
      }
      
      yield { line: 5, vars: { mid }, data: [...data], pointers: { left, right, mid }, activeIndices: [mid], message: `Check if ${data[mid]} < ${target}` };
      if (data[mid] < target) {
        yield { line: 6, vars: { newLeft: mid + 1, right }, data: [...data], pointers: { left, right, mid }, message: `Search right half` };
        return yield* search(mid + 1, right);
      } else {
        yield { line: 8, vars: { left, newRight: mid - 1 }, data: [...data], pointers: { left, right, mid }, message: `Search left half` };
        return yield* search(left, mid - 1);
      }
    }
    
    yield* search(0, data.length - 1);
  }
};

export const hashingTwoSumOp: DsaOperation = {
  id: 'hashing-two-sum',
  name: 'Hashing (Two Sum)',
  complexities: { time: 'O(n)', space: 'O(n)' },
  defaultInput: [2, 7, 11, 15],
  defaultArgs: [9],
  code: `function twoSumHash(arr, target) {
  const map = new Map();
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(arr[i], i);
  }
  return null;
}`,
  run: function*(arr: number[], target: number): Generator<StepState, void, unknown> {
    const data = [...arr];
    const map = new Map<number, number>();
    
    yield { line: 2, vars: { target }, data: [...data], message: `Initialize map` };
    
    for (let i = 0; i < data.length; i++) {
      yield { line: 3, vars: { i, "arr[i]": data[i] }, data: [...data], pointers: { i }, message: `Check element ${data[i]}` };
      const complement = target - data[i];
      yield { line: 4, vars: { i, complement }, data: [...data], pointers: { i }, activeIndices: [i], message: `Complement = ${target} - ${data[i]} = ${complement}` };
      
      yield { line: 5, vars: { i, complement }, data: [...data], pointers: { i }, activeIndices: [i], message: `Does map have ${complement}?` };
      if (map.has(complement)) {
        const j = map.get(complement)!;
        yield { line: 6, vars: { i, j, complement }, data: [...data], pointers: { i, comp_idx: j }, activeIndices: [i, j], message: `Found ${complement} at index ${j}!` };
        return;
      }
      
      map.set(data[i], i);
      yield { line: 8, vars: { "map_keys": Array.from(map.keys()).join(',') }, data: [...data], pointers: { i }, message: `map.set(${data[i]}, ${i})` };
    }
  }
};
