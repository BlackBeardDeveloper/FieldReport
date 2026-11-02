import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ReportsProvider } from './src/context/ReportsContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <ReportsProvider>
        <AppNavigator />
      </ReportsProvider>
    </SafeAreaProvider>
  );
}

export default App;
