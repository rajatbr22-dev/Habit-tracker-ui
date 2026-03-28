/**
 * HabitTracker – Navigation Setup
 *
 * Root → Auth (Login ↔ Register) and Root → Main (Habits list).
 * Uses @react-navigation/native-stack for native transitions.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import type { RootStackParamList, AuthStackParamList, MainTabParamList } from '../types/navigation';
import {
  SplashScreen,
  LoginScreen,
  RegisterScreen,
  HabitsListScreen,
  AddHabitScreen,
  AnalyticsScreen,
  HabitDetailScreen,
  SettingsScreen,
  OnboardingScreen,
  DashboardScreen,
  PaywallScreen,
  ForgotPasswordScreen,
  NotificationScreen,
} from '../screens';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query';

// ──────────────────────────────────────────────
// Auth Stack
// ──────────────────────────────────────────────

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

import { LayoutDashboard, Calendar, BarChart3, User } from 'lucide-react-native';
import { useTheme } from '../theme';
import DynamicLogo from '../components/DynamicLogo';

// ──────────────────────────────────────────────
// Main Tab Stack
// ──────────────────────────────────────────────

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          // borderTopColor: colors.border,
          // height: 60,
          // paddingBottom: 8,
          // paddingTop: 8,
          // elevation: 0,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsListScreen}
        options={{
          tabBarLabel: 'Habits',
          tabBarIcon: ({ color }) => <DynamicLogo color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// ──────────────────────────────────────────────
// Root Stack
// ──────────────────────────────────────────────

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }} initialRouteName="Splash">
    <RootStack.Screen name="Splash" component={SplashScreen} />
    <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
    <RootStack.Screen name="Auth" component={AuthNavigator} />
    <RootStack.Screen name="Main" component={MainTabNavigator} />
    <RootStack.Screen name="HabitDetail" component={HabitDetailScreen} />
    <RootStack.Screen name="AddHabit" component={AddHabitScreen} />
    <RootStack.Screen name="Notifications" component={NotificationScreen} />
    <RootStack.Screen name="Paywall" component={PaywallScreen} />
  </RootStack.Navigator>
);

// ──────────────────────────────────────────────
// App Navigation (wraps everything in NavigationContainer)
// ──────────────────────────────────────────────

import { navigationRef } from './NavigationService';

const AppNavigation: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <NavigationContainer ref={navigationRef}>
      <RootNavigator />
    </NavigationContainer>
  </QueryClientProvider>
);

export default AppNavigation;
