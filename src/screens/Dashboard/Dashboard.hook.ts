import { useMemo } from 'react';

export const useDashboard = () => {
  const greeting = useMemo(() => 'Welcome', []);

  return {
    greeting,
  };
};
