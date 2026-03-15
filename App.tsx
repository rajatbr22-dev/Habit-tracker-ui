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

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider themeMode="system">
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
