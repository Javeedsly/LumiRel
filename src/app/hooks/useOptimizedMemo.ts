import { useMemo } from "react";

export const useOptimizedMemo = <T>(callback: () => T, dependencies: any[]): T => {
  return useMemo(callback, dependencies);
};
