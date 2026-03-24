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
  
  // Notification State
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Alert State (Global)
  activeAlert: (Omit<Notification, 'id' | 'timestamp' | 'read'> & { visible: boolean }) | null;
  showAlert: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  hideAlert: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),

      notifications: [],
      addNotification: (notif) => set((state) => ({
        notifications: [
          {
            ...notif,
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            read: false,
          },
          ...state.notifications
        ]
      })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      clearNotifications: () => set({ notifications: [] }),

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
