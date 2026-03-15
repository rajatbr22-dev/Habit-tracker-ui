/**
 * HabitTracker – Navigation Setup
 *
 * Root → Auth (Login ↔ Register) and Root → Main (Habits list).
 * Uses @react-navigation/native-stack for native transitions.
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import type {RootStackParamList, AuthStackParamList} from '../types/navigation';
import {SplashScreen, LoginScreen, RegisterScreen, HabitsListScreen} from '../screens';

// ──────────────────────────────────────────────
// Auth Stack
// ──────────────────────────────────────────────

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => (
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// ──────────────────────────────────────────────
// Root Stack
// ──────────────────────────────────────────────

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => (
  <RootStack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
    <RootStack.Screen name="Splash" component={SplashScreen} />
    <RootStack.Screen name="Auth" component={AuthNavigator} />
    <RootStack.Screen name="Main" component={HabitsListScreen} />
  </RootStack.Navigator>
);

// ──────────────────────────────────────────────
// App Navigation (wraps everything in NavigationContainer)
// ──────────────────────────────────────────────

const AppNavigation: React.FC = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default AppNavigation;
