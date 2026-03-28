import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStore } from '../types';


export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,

        setAuth: ({ user, token }) =>
          set(
            { user, token },
            false,
            'auth/setAuth'
          ),

        logout: () =>
          set(
            { user: null, token: null },
            false,
            'auth/logout'
          ),

        updateUser: (user) =>
          set(
            (state) => ({ user: { ...state.user, ...user } }),
            false,
            'auth/updateUser'
          ),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => AsyncStorage),
      }
    ),
    {
      name: 'AuthStore',
    }
  )
);