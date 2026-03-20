import { AxiosError, AxiosResponse } from "axios";
import api from "../api/axios";
import { LoginFormValues, RegisterFormValues } from "../types";

const AuthService = {

    loginUser: async (formData: LoginFormValues) : Promise<AxiosResponse> => {

        try {
            const response = await api.post('/auth/login', formData);

            return response.data;
        } catch (error: any) {
            return error;
        }

    },


    registerUser: async (formData: RegisterFormValues) : Promise<AxiosResponse> => {

        try {
            const response = await api.post('/auth/register', formData);

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

    forgotPassword: async (formData: { email: string; newPassword: string }) : Promise<AxiosResponse> => {

        try {
            const response = await api.post('/auth/forgot-password', formData);

            return response.data;
        } catch (error) {
            const err = error as AxiosError;

            console.log("api error forgot password", err)

            if (err.response) {
                throw err.response.data;
            } else if (err.request) {
                throw new Error("No response from server");
            } else {
                throw new Error(err.message);
            }
        }

    }
} 


export default AuthService;