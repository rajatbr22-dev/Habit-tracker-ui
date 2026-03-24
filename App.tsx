/**
 * HabitTracker – App Root
 *
 * Wraps the app with SafeAreaProvider, ThemeProvider, and Navigation.
 */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/theme';
import AppNavigation from './src/navigation';
import { useUIStore } from './src/store/useUIStore';

function App(): React.JSX.Element {
  const { themeMode } = useUIStore();
  const systemScheme = useColorScheme();
  const isDarkMode = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider themeMode={themeMode}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
