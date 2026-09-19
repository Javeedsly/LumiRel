import React from "react";

export const useOptimizedComponent = <
  T extends React.ComponentType<any>
>(
  Component: T
): React.MemoExoticComponent<T> => {
  return React.memo(Component);
};