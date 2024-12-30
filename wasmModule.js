import { generateMockResult } from './src/mocks/mockData.js';

export async function initializeWasmModule() {
  console.log('Mock WASM module initialized');
  return true;
}

export function processTask(task) {
  // Simulate processing delay
  const result = generateMockResult();
  console.log('Processed task:', task.id, 'Result:', result);
  return result;
}