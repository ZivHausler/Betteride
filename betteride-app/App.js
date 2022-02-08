import { KeyboardAvoidingView, Platform } from "react-native";
import * as Device from 'expo-device';
import tw from "tailwind-react-native-classnames";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from 'expo-notifications';
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const Stack = createSharedElementStackNavigator();
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => pushTokenToUser(token, 2)
      )

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const pushTokenToUser = (token, userID) => {
    // console.log(IP_ADDRESS);
    // const baseUrl = Platform.OS === 'android' ? 'http://'+IP_ADDRESS : 'http://localhost';
    fetch(`http://${'10.0.0.8'}:3000/pushTokenToUser?token=${token}&userID=${userID}`, {
      method: 'POST',
      // body: JSON.stringify({ token, userID })
    })
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      // alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  }


  // sendPushNotification('ExponentPushToken[ZZly2yKLcP_mztZO64VjRa]');

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

