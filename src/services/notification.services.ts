import { AxiosError, AxiosResponse } from "axios";
import api from "../api/axios";
import { io, Socket } from "socket.io-client";
import { WS_URL } from '@env';

const SOCKET_URL = WS_URL; // Should be moved to config/env

let socket: Socket | null = null;

export const NotificationService = {
    
    // Socket Logic
    initSocket: (token: string) => {
        if (!socket) {
            socket = io(SOCKET_URL, {
                auth: {
                    token: token
                },
                transports: ['websocket'], // Force WebSocket to avoid polling issues in React Native
            });


            socket.on("connect", () => {
                console.log("Connected to notification socket server");
            });

            socket.on("connect_error", (err) => {
                console.error("Socket connection error details:", {
                    message: err.message,
                    context: (err as any).context, // Some socket errors provide additional context
                    description: (err as any).description, // Description often contains lower-level error
                });

            });

        }
        return socket;
    },

    getSocket: () => socket,

    disconnectSocket: () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    },

    // API Logic
    getAllNotifications: async () : Promise<any> => {
        try {
            const response = await api.get('/notifications');
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.log("api error getting all notifications", err)
            if (err.response) {
                throw err.response.data;
            } else if (err.request) {
                throw new Error("No response from server");
            } else {
                throw new Error(err.message);
            }
        }
    },

    markAsReadNotification: async (id: string) : Promise<any> => {
        try {
            const response = await api.patch(`/notifications/${id}/read`);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.log("api error marking notification as read", err)
            if (err.response) {
                throw err.response.data;
            } else if (err.request) {
                throw new Error("No response from server");
            } else {
                throw new Error(err.message);
            }
        }
    },

    markAllAsReadNotifications: async () : Promise<any> => {
        try {
            const response = await api.patch('/notifications/read-all');
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.log("api error marking all as read", err)
            if (err.response) {
                throw err.response.data;
            } else if (err.request) {
                throw new Error("No response from server");
            } else {
                throw new Error(err.message);
            }
        }
    },

    deleteNotification: async (id: string) : Promise<any> => {
        try {
            const response = await api.delete(`/notifications/${id}`);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.log("api error delete notification", err)
            if (err.response) {
                throw err.response.data;
            } else if (err.request) {
                throw new Error("No response from server");
            } else {
                throw new Error(err.message);
            }
        }
    },
}