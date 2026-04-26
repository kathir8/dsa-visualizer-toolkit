export type TopicId = 'arrays' | 'linked-list' | 'doubly-linked-list' | 'stack' | 'queue' | 'circular-queue' | 'heap' | 'min-heap' | 'max-heap' | 'graph' | 'searching' | 'sorting' | 'techniques';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface StepState {
  line: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vars: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // Elements payload
  message?: string;
  activeIndices?: number[]; // indices currently being touched
  swappedIndices?: number[]; // indices being swapped
  pointers?: Record<string, number | string>; // custom pointers (name -> id/idx)
}

export interface DsaOperation {
  id: string;
  name: string;
  code: string;
  complexities: { time: string; space: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  run: (input: any, ...args: any[]) => Generator<StepState, void, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultInput: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultArgs?: any[];
}

export interface DsaTopic {
  id: TopicId;
  name: string;
  description: string;
  operations: DsaOperation[];
}
