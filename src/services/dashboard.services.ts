import { AxiosError, AxiosResponse } from "axios";
import api from "../api/axios";

export const DashboardService = {
    getTodayHabits: async () : Promise<AxiosResponse> => {
        try {
            const response = await api.get('/dashboard/today-habits');

            return response.data;
        } catch (error) {
            const err = error as AxiosError;

            console.log("api error registration", err)

            if (err.response) {
                throw err.response.data;
            } else if (err.request) {
                throw new Error("No response from server");
            } else {
                throw new Error(err.message);
            }
        }

    },



    getWeeklyHabits: async () : Promise<AxiosResponse> => {
        try {
            const response = await api.get('/dashboard/weekly');

            return response.data;
        } catch (error) {
            const err = error as AxiosError;

            console.log("api error registration", err)

            if (err.response) {
                throw err.response.data;
            } else if (err.request) {
                throw new Error("No response from server");
            } else {
                throw new Error(err.message);
            }
        }

    },


    getSummaryHabits: async () : Promise<AxiosResponse> => {
        try {
            const response = await api.get('/dashboard/summary');

            return response.data;
        } catch (error) {
            const err = error as AxiosError;

            console.log("api error registration", err)

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