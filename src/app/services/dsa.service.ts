import { Injectable } from '@angular/core';
import { DsaOperation, DsaTopic, TopicId } from '../core/models';
import { bubbleSortOp, selectionSortOp, insertionSortOp, mergeSortOp, quickSortOp } from '../core/algorithms/sorting';
import { binarySearchOp, linearSearchOp, exponentialSearchOp } from '../core/algorithms/searching';
import { arrayInsertOp, arrayDeleteOp, arrayAccessOp, arrayUpdateOp } from '../core/algorithms/arrays';
import { stackPushOp, stackPopOp, stackPeekOp, queueEnqueueOp, queueDequeueOp, queuePeekOp, circularQueueEnqueueOp, circularQueueDequeueOp, stackCreateFromArrayOp, queueCreateFromArrayOp, circularQueueCreateFromArrayOp } from '../core/algorithms/stack_queue';
import { llInsertHeadOp, llInsertTailOp, dllInsertHeadOp, dllDeleteNodeOp, llDeleteOp, llSearchOp, llCreateFromArrayOp, dllCreateFromArrayOp } from '../core/algorithms/linked_list';
import { minHeapInsertOp, minHeapSearchOp, minHeapExtractOp, minHeapPeekOp, maxHeapInsertOp, maxHeapSearchOp, maxHeapExtractOp, maxHeapPeekOp, minHeapCreateFromArrayOp, maxHeapCreateFromArrayOp } from '../core/algorithms/heap';
import { graphBfsOp, graphDfsOp, graphCreateFromArrayOp, btCreateFromArrayOp } from '../core/algorithms/graph';
import { twoPointersOp, slidingWindowOp, kadaneOp, greedyCoinChangeOp, dpFibonacciOp, recursionFactorialOp, backtrackingPermutationsOp, divideAndConquerBinarySearchOp, hashingTwoSumOp } from '../core/algorithms/techniques';

@Injectable({
  providedIn: 'root'
})
export class DsaService {
  private topics: DsaTopic[] = [
    {
      id: 'arrays',
      name: 'Arrays',
      description: 'An array is a collection of items stored at contiguous memory locations.',
      operations: [arrayInsertOp, arrayDeleteOp, arrayAccessOp, arrayUpdateOp]
    },
    {
      id: 'linked-list',
      name: 'Linked List',
      description: 'Elements are linked using pointers.',
      operations: [llInsertHeadOp, llInsertTailOp, llDeleteOp, llSearchOp, llCreateFromArrayOp]
    },
    {
      id: 'doubly-linked-list',
      name: 'Doubly Linked List',
      description: 'Nodes carry pointers to both next and previous elements.',
      operations: [dllInsertHeadOp, dllDeleteNodeOp, dllCreateFromArrayOp]
    },
    {
      id: 'stack',
      name: 'Stack',
      description: 'A linear data structure which follows the LIFO (Last In First Out) principle.',
      operations: [stackPushOp, stackPopOp, stackPeekOp, stackCreateFromArrayOp]
    },
    {
      id: 'queue',
      name: 'Queue',
      description: 'A linear data structure which follows the FIFO (First In First Out) principle.',
      operations: [queueEnqueueOp, queueDequeueOp, queuePeekOp, circularQueueEnqueueOp, circularQueueDequeueOp, queueCreateFromArrayOp, circularQueueCreateFromArrayOp]
    },
    {
      id: 'min-heap',
      name: 'Min Heap',
      description: 'A complete binary tree suitable for priority queues where parent is smaller than children.',
      operations: [minHeapSearchOp, minHeapInsertOp, minHeapExtractOp, minHeapPeekOp, minHeapCreateFromArrayOp]
    },
    {
      id: 'max-heap',
      name: 'Max Heap',
      description: 'A complete binary tree suitable for priority queues where parent is larger than children.',
      operations: [maxHeapSearchOp, maxHeapInsertOp, maxHeapExtractOp, maxHeapPeekOp, maxHeapCreateFromArrayOp]
    },
    {
      id: 'graph',
      name: 'Graph / Tree',
      description: 'A collection of nodes and edges determining relationships.',
      operations: [graphBfsOp, graphDfsOp, graphCreateFromArrayOp, btCreateFromArrayOp]
    },
    {
      id: 'searching',
      name: 'Searching',
      description: 'Algorithms to find elements in a data structure.',
      operations: [linearSearchOp, binarySearchOp, exponentialSearchOp]
    },
    {
      id: 'sorting',
      name: 'Sorting',
      description: 'Algorithms to rearrange elements in a specific order.',
      operations: [bubbleSortOp, selectionSortOp, insertionSortOp, mergeSortOp, quickSortOp]
    },
    {
      id: 'techniques',
      name: 'Techniques',
      description: 'Common algorithmic techniques.',
      operations: [twoPointersOp, slidingWindowOp, kadaneOp, greedyCoinChangeOp, dpFibonacciOp, recursionFactorialOp, backtrackingPermutationsOp, divideAndConquerBinarySearchOp, hashingTwoSumOp]
    }
  ];

  getTopics(): DsaTopic[] {
    return this.topics;
  }

  getTopicById(id: string): DsaTopic | undefined {
    return this.topics.find(t => t.id === id);
  }
}
