import { AxiosError, AxiosResponse } from "axios";
import api from "../api/axios";

export const AnalyticsService = {

    getAnalyticsSummary: async () : Promise<AxiosResponse> => {
        try {
            const response = await api.get('/analytics/summary');
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.log("api error export habits", err)
            if (err.response) {
                throw err.response.data;
            } else if (err.request) {
                throw new Error("No response from server");
            } else {
                throw new Error(err.message);
            }
        }
    },


    getWeeklyAnalyticsSummary: async () : Promise<AxiosResponse> => {
        try {
            const response = await api.get('/analytics/weekly-overview');
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.log("api error export habits", err)
            if (err.response) {
                throw err.response.data;
            } else if (err.request) {
                throw new Error("No response from server");
            } else {
                throw new Error(err.message);
            }
        }
    },


    getHeatmapAnalyticsSummary: async () : Promise<AxiosResponse> => {
        try {
            const response = await api.get('/analytics/activity-heatmap');
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.log("api error export habits", err)
            if (err.response) {
                throw err.response.data;
            } else if (err.request) {
                throw new Error("No response from server");
            } else {
                throw new Error(err.message);
            }
        }
    },


    getHabitsWiseAnalyticsSummary: async () : Promise<AxiosResponse> => {
        try {
            const response = await api.get('/analytics/habit-performance');
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.log("api error export habits", err)
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