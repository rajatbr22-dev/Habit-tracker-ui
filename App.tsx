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
import Alert from './src/components/Alert';
import { useNotificationInit } from './src/hooks/useNotificationInit';

function App(): React.JSX.Element {
  // 1. Hooks first, in a stable order
  const { themeMode, activeAlert, hideAlert } = useUIStore();
  const systemScheme = useColorScheme();
  
  // 2. Custom initialization hooks
  useNotificationInit();

  const isDarkMode = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider themeMode={themeMode}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigation />
        
        {/* Global Alert */}
        {activeAlert && (
          <Alert
            visible={activeAlert.visible}
            type={activeAlert.type}
            title={activeAlert.title}
            message={activeAlert.message}
            onClose={hideAlert}
          />
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}


export default App;
