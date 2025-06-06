declare global {
    interface Ethereum extends Record<string, unknown> {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, listener: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
    }
  
    interface Window {
      ethereum?: Ethereum;
    }
  }
  
  export {};
  