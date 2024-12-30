// Mock data generation utilities
export function generateMockTask() {
  return {
    id: Math.random().toString(36).substr(2, 9),
    data: new Uint8Array(100).fill(Math.random() * 255)
  };
}

export function generateMockResult() {
  return {
    complexity: Math.random(),
    iterations: Math.floor(Math.random() * 1000),
    accuracy: 0.85 + (Math.random() * 0.1)
  };
}