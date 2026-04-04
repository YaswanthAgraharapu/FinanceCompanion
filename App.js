import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_ICONS = {
  Home: '🏠', Transactions: '💸', Goals: '🎯', Insights: '📊',
};

const TabBarIcon = ({ focused, color, iconName }) => (
  <Text style={{ fontSize: focused ? 26 : 22 }}>{iconName}</Text>
);
TabBarIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
};

const renderTabBarLabel = (route) => (props) => <TabBarLabel {...props} routeName={route.name} />;

const TabBarLabel = ({ focused, color, routeName }) => (
  <Text style={{ fontSize: 10, color, fontWeight: focused ? '700' : '400', marginBottom: 2 }}>
    {routeName}
  </Text>
);
TabBarLabel.propTypes = {
  focused: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  routeName: PropTypes.string.isRequired,
};


function TransactionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TransactionsList" component={TransactionsScreen} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: focused ? 26 : 22 }}>{TAB_ICONS[route.name]}</Text>
          ),
          tabBarLabel: renderTabBarLabel(route),
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopWidth: 0,
            elevation: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            height: 70,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.tabActive,
          tabBarInactiveTintColor: colors.tabInactive,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Transactions" component={TransactionsStack} />
        <Tab.Screen name="Goals" component={GoalsScreen} />
        <Tab.Screen name="Insights" component={InsightsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}