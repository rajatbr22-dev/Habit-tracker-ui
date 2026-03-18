const AuthService = {

    loginUser: async (formData: LoginFormData) : Promise<AxiosResponse> => {
        const response = await api.post('/auth/signin', formData);
        return response.data;
    }
} 


export default AuthService;