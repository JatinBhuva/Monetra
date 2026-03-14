type NavigationTarget = {
  name: string;
  params?: Record<string, unknown>;
};

let lastNavigation: NavigationTarget | null = null;

export const navigate = (name: string, params?: Record<string, unknown>) => {
  lastNavigation = { name, params };
};

export const getLastNavigation = () => lastNavigation;
