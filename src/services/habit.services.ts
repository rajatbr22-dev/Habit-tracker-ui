import { AxiosError, AxiosResponse } from "axios";
import api from "../api/axios";
import { CheckInPayload, GetAllHabitParams, HabitFormValues, UpdateHabitFormData } from "../types";

const HabitService = {

    addNewHabit: async (formData: HabitFormValues) : Promise<AxiosResponse> => {

        try {
            const response = await api.post('/habits', formData);

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

    getAllHabits: async ({
        page,
        pageSize,
        search,
        categoryFrequency,
        date
    } : GetAllHabitParams) : Promise<AxiosResponse> => {

        const params: Record<string, any> = {};


        if(page) params.page = page;
        if(pageSize) params.pageSize = pageSize;
        if(search) params.search = search;
        if(categoryFrequency) params.categoryFrequency = categoryFrequency;
        if(date) params.date = date;
        

        console.log("params", params);
        
        try {
            const response = await api.get('/habits', {
                params
            });

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


    habitCheckIn: async (formData: CheckInPayload) : Promise<AxiosResponse> => {

        try {
            const response = await api.post('/habits/checkin', formData);

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


    getHabitByID: async (id: string) : Promise<AxiosResponse> => {
        
        try {
            const response = await api.get(`/habits/${id}`);

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


    updateHabit: async (id: string, formData: Partial<HabitFormValues>) : Promise<AxiosResponse> => {
        
        try {
            const response = await api.patch(`/habits/${id}`, formData);

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


    archiveHabit: async (id: string) : Promise<AxiosResponse> => {
        
        try {
            const response = await api.patch(`/habits/${id}/archive`);

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


    getAllArchivedHabits: async () : Promise<AxiosResponse> => {
        
        try {
            const response = await api.get('/habits/archived');

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


    unarchiveHabit: async (id: string) : Promise<AxiosResponse> => {
        
        try {
            const response = await api.patch(`/habits/${id}/unarchive`);

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


    deleteHabit: async (id: string) : Promise<AxiosResponse> => {
        
        try {
            const response = await api.patch(`/habits/${id}/delete`);

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


    getDetailedHabit: async (id: string) : Promise<AxiosResponse> => {
        try {
            const response = await api.get(`/habits/${id}/detail`);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.log("api error getting detailed habit", err)
            if (err.response) {
                throw err.response.data;
            } else if (err.request) {
                throw new Error("No response from server");
            } else {
                throw new Error(err.message);
            }
        }
    },

    exportHabitsCSV: async () : Promise<AxiosResponse> => {
        try {
            const response = await api.get('/habits/export');
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


export default HabitService;