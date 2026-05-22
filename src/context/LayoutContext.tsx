/**
 * LayoutContext — provides sidebar toggle state for legacy Navbar/Sidebar components.
 * The main AppLayout.tsx manages its own sidebar state, but these legacy components
 * reference this context. This shim ensures they compile without errors.
 */

import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextValue>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  toggleSidebar: () => {},
});

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  return (
    <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
