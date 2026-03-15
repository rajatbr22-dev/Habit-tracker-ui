/**
 * HabitTracker – Navigation Setup
 *
 * Root → Auth (Login ↔ Register) and Root → Main (Habits list).
 * Uses @react-navigation/native-stack for native transitions.
 */

import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import type {RootStackParamList, AuthStackParamList, MainTabParamList} from '../types/navigation';
import {
  SplashScreen,
  LoginScreen,
  RegisterScreen,
  HabitsListScreen,
  AddHabitScreen,
  AnalyticsScreen,
  HabitDetailScreen,
} from '../screens';

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
// Main Tab Stack
// ──────────────────────────────────────────────

const PlaceholderSettings: React.FC = () => <View style={{flex: 1}} />;

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#6C5CE7',
      tabBarInactiveTintColor: '#8E8E93',
    }}>
    <Tab.Screen
      name="Habits"
      component={HabitsListScreen}
      options={{
        tabBarLabel: 'Today',
        tabBarIcon: ({color}) => <Text style={{color, fontSize: 20}}>📅</Text>,
      }}
    />
    <Tab.Screen
      name="Analytics"
      component={AnalyticsScreen}
      options={{
        tabBarLabel: 'Analytics',
        tabBarIcon: ({color}) => <Text style={{color, fontSize: 20}}>📊</Text>,
      }}
    />
    <Tab.Screen
      name="Settings"
      component={PlaceholderSettings}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({color}) => <Text style={{color, fontSize: 20}}>👤</Text>,
      }}
    />
  </Tab.Navigator>
);

// ──────────────────────────────────────────────
// Root Stack
// ──────────────────────────────────────────────

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => (
  <RootStack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
    <RootStack.Screen name="Splash" component={SplashScreen} />
    <RootStack.Screen name="Auth" component={AuthNavigator} />
    <RootStack.Screen name="Main" component={MainTabNavigator} />
    <RootStack.Screen name="HabitDetail" component={HabitDetailScreen} />
    <RootStack.Screen name="AddHabit" component={AddHabitScreen} />
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
