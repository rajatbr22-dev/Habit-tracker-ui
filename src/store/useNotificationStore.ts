import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationService } from '../services/notification.services';
import { Notification } from './useUIStore';

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  addNotification: (notif: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      loading: false,
      error: null,
      unreadCount: 0,

      fetchNotifications: async () => {
        set({ loading: true });
        try {
          const notifications = await NotificationService.getAllNotifications();
          set({ 
            notifications, 
            unreadCount: notifications.filter((n: Notification) => !n.read).length,
            loading: false 
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      addNotification: (notif) => {
        set((state) => {
          const newNotifications = [notif, ...state.notifications];
          return {
            notifications: newNotifications,
            unreadCount: newNotifications.filter(n => !n.read).length
          };
        });
      },

      markAsRead: async (id) => {
        try {
          await NotificationService.markAsReadNotification(id);
          set((state) => {
            const newNotifications = state.notifications.map(n => 
              n.id === id ? { ...n, read: true } : n
            );
            return {
              notifications: newNotifications,
              unreadCount: newNotifications.filter(n => !n.read).length
            };
          });
        } catch (error: any) {
          console.error("Failed to mark notification as read:", error);
        }
      },

      markAllAsRead: async () => {
        try {
          await NotificationService.markAllAsReadNotifications();
          set((state) => ({
            notifications: state.notifications.map(n => ({ ...n, read: true })),
            unreadCount: 0
          }));
        } catch (error: any) {
          console.error("Failed to mark all as read:", error);
        }
      },

      deleteNotification: async (id) => {
        try {
          await NotificationService.deleteNotification(id);
          set((state) => {
            const newNotifications = state.notifications.filter(n => n.id !== id);
            return {
              notifications: newNotifications,
              unreadCount: newNotifications.filter(n => !n.read).length
            };
          });
        } catch (error: any) {
          console.error("Failed to delete notification:", error);
        }
      },

      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
