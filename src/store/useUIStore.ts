import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

interface UIState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  
  // Alert State (Global) - Used for toast-like notifications
  activeAlert: (Omit<Notification, 'id' | 'timestamp' | 'read'> & { visible: boolean }) | null;
  showAlert: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  hideAlert: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),

      activeAlert: null,
      showAlert: (notif) => set({ activeAlert: { ...notif, visible: true } }),
      hideAlert: () => set((state) => ({ 
        activeAlert: state.activeAlert ? { ...state.activeAlert, visible: false } : null 
      })),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

