import { AxiosError, AxiosResponse } from "axios";
import api from "../api/axios";

export const AnalyticsService = {

    getAnalyticsSummary: async () : Promise<AxiosResponse> => {
        try {
            const response = await api.get('/analytics/summary');
            return response;
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