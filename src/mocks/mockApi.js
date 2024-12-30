import { generateMockTask } from './mockData.js';

export async function fetchMockTask() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateMockTask();
}

export async function submitMockResult(result) {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}