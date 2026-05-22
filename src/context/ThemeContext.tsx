/**
 * ThemeContext — thin wrapper around the Zustand themeStore.
 * The Sidebar.tsx legacy component imports `useTheme` from here.
 * This shim delegates to the existing themeStore.
 */

import { useThemeStore } from '@/store/themeStore';

export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  return { theme, setTheme, toggleTheme };
}
