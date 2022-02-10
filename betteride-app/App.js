import { KeyboardAvoidingView, Platform } from "react-native";
import * as Device from 'expo-device';
import tw from "tailwind-react-native-classnames";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { useRef, useEffect, useState } from "react";
import { IP_ADDRESS } from "@env";
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

// Import Screens --- 
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import TravelHistoryScreen from "./screens/TravelHistoryScreen";
import TravelDetailsScreen from "./screens/TravelDetailsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LogoutScreen from "./screens/LogoutScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CreditCardScreen from "./screens/CreditCardScreen";
import LoadingScreen from "./screens/LoadingScreen";
import LoginScreen from './screens/LoginScreen';



export default function App() {
  const Stack = createSharedElementStackNavigator();


  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? -20 : 0}>
            <Stack.Navigator>
              <Stack.Screen name='Loading' component={LoadingScreen} options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="Profile Screen" component={ProfileScreen} options={{ headerShown: true }} />
              <Stack.Screen name="Travel History" component={TravelHistoryScreen} options={{ headerShown: true }} />
              <Stack.Screen name="Travel Details" component={TravelDetailsScreen} options={() =>
              ({
                headerShown: false,
                gestureEnabled: false,
                transitionSpec: {
                  open: { animation: 'timing', config: { duration: 400 } },
                  close: { animation: 'timing', config: { duration: 400 } }
                },
                cardStyleInterpolator: ({ current: { progress } }) =>
                  ({ cardStyle: { opacity: progress } })
              })} />
              <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />
              <Stack.Screen name="Credit Card" component={CreditCardScreen} options={{ headerShown: true }} />
              <Stack.Screen name="Logout" component={LogoutScreen} options={{ headerShown: true }} />
            </Stack.Navigator>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

