import { KeyboardAvoidingView, Platform } from "react-native";
import { Provider } from "react-redux";
import { store } from "./store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

// Import Screens --- 
import MapScreen from "./screens/MapScreen";
import TravelHistoryScreen from "./screens/TravelHistoryScreen";
import TravelDetailsScreen from "./screens/TravelDetailsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CreditCardScreen from "./screens/CreditCardScreen";
import LoadingScreen from "./screens/LoadingScreen";

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
            </Stack.Navigator>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

