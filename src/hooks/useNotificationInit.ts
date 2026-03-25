import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useUIStore } from '../store/useUIStore';
import { NotificationService } from '../services/notification.services';

export const useNotificationInit = () => {
  const token = useAuthStore(state => state.token);
  const addNotification = useNotificationStore(state => state.addNotification);
  const showAlert = useUIStore(state => state.showAlert);

  useEffect(() => {
    if (token) {
      const socket = NotificationService.initSocket(token);

      console.log("token:", token)

      socket.on('notification:new', (notif: any) => {
        console.log('New notification received:', notif);
        
        // Add to persistent store
        addNotification({
            id: notif.id,
            title: notif.title,
            message: notif.message,
            type: notif.type || 'info', // Map server type or default to info
            timestamp: Date.now(),
            read: false
        });

        // Show global alert (toast)
        showAlert({
          title: notif.title,
          message: notif.message,
          type: notif.type || 'info',
        });
      });


      return () => {
        NotificationService.disconnectSocket();
      };
    }
  }, [token, addNotification, showAlert]);
};
