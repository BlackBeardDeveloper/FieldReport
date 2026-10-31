import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/report';

import { DashboardScreen } from '../screens/DashboardScreen';
import { CreateReportScreen } from '../screens/CreateReportScreen';
import { ReportDetailsScreen } from '../screens/ReportDetailsScreen';
import { ServerReportsScreen } from '../screens/ServerReportsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E40AF', // Professional deep blue header
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          contentStyle: {
            backgroundColor: '#F8FAFC',
          },
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerShown: false, // Custom dashboard header with offline badge & settings button
          }}
        />
        <Stack.Screen
          name="CreateReport"
          component={CreateReportScreen}
          options={{
            title: 'New Field Report',
          }}
        />
        <Stack.Screen
          name="ReportDetails"
          component={ReportDetailsScreen}
          options={{
            title: 'Report Details',
          }}
        />
        <Stack.Screen
          name="ServerReports"
          component={ServerReportsScreen}
          options={{
            title: 'Server Reports',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings & Data',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
