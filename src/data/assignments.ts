export interface TestCase {
  id: string;
  input: string; // JSON string format of array of arguments
  expectedOutput: string; // JSON string format of expected return value
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  marksPerTestCase: number;
  functionBodyTemplate: string;
  functionName: string;
  testCases: TestCase[];
}

export const dummyAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Reverse a String',
    description: 'Write a JavaScript function named `reverseString` that takes a single string and returns it reversed. For example, reversing "hello" should return "olleh".',
    marksPerTestCase: 10,
    functionName: 'reverseString',
    functionBodyTemplate: 'function reverseString(str) {\n  // write your code here\n  \n}',
    testCases: [
      { id: 't1', input: '["hello"]', expectedOutput: '"olleh"' },
      { id: 't2', input: '["world"]', expectedOutput: '"dlrow"' },
      { id: 't3', input: '["a"]', expectedOutput: '"a"' },
      { id: 't4', input: '[""]', expectedOutput: '""' },
    ],
  },
  {
    id: '2',
    title: 'Two Sum',
    description: 'Write a JavaScript function named `twoSum` that takes an array of numbers and a target number. It should return an array containing the indices of the two numbers that add up to the target.',
    marksPerTestCase: 15,
    functionName: 'twoSum',
    functionBodyTemplate: 'function twoSum(nums, target) {\n  // write your code here\n  \n}',
    testCases: [
      { id: 't1', input: '[[2, 7, 11, 15], 9]', expectedOutput: '[0, 1]' },
      { id: 't2', input: '[[3, 2, 4], 6]', expectedOutput: '[1, 2]' },
      { id: 't3', input: '[[3, 3], 6]', expectedOutput: '[0, 1]' },
    ],
  },
];
