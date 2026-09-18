import React from "react";

export const useOptimizedComponent = <T extends React.ComponentType<any>>(Component: T): T => {
  return React.memo(Component) as T;
};
