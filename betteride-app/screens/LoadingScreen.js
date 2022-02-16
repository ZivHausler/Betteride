import React, { useEffect, useState, useRef } from 'react'
import { Image, StyleSheet, Text, View, ActivityIndicator, Animated, Button, Easing, TouchableOpacity } from 'react-native'
import tw from 'tailwind-react-native-classnames'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from 'firebase/app';
import { selectUserAssignedVehicle, setDestination, setOrigin, setRouteShown, setTabShown, setUserAssignedVehicle } from '../slices/navSlice';
import { useDispatch, useSelector } from 'react-redux';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectUserInfo, setUserInfo, setUserLocation } from '../slices/userSlice';
import LoginButton from '../components/LoginButton';
import * as Google from 'expo-google-app-auth';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { IP_ADDRESS } from '@env'
import * as Location from 'expo-location';
import { setVehiclePlateNumber } from '../slices/vehicleSlice';


const LoadingScreen = ({ navigation, route }) => {

    useEffect(() => {
        if (route.params)
            setTimeout(() => animateLoginPage(), 500)
    }, [route.params])

    const firebaseConfig = {
        apiKey: "AIzaSyAEDK9co1lmhgQ2yyb6C0iko4HE7sXaK38",
        authDomain: "betteride.firebaseapp.com",
        databaseURL: "https://betteride-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "betteride",
        storageBucket: "betteride.appspot.com",
        messagingSenderId: "826611003690",
        appId: "1:826611003690:web:5f6c6634e3c51cf4a52e53",
        measurementId: "G-SW32RTSRPW"
    };
    // Initialize Firebase
    initializeApp(firebaseConfig);

    const dispatch = useDispatch();
    const vehiclePlateNumber = useSelector(selectUserAssignedVehicle);
    // const user = useSelector(selectUserInfo);
    const yAnimation = useRef(new Animated.Value(0)).current;
    const translateY = yAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, -150] })
    const translateLogo = yAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 75] })
    const opacity = yAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
    const borderRadius = yAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 30] })
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // push notification
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });

    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [token, setToken] = useState(null);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            setToken(token);
            AsyncStorage.getItem('Users')
                .then(result => {
                    if (!result) {
                        setTimeout(() => animateLoginPage(), 1)
                    }
                    else {
                        let user = JSON.parse(result).user;
                        user['token'] = token;
                        fetch(`https://betteride-firebase-server-3mmcqmln7a-ew.a.run.app/loginUser`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ user })
                        })
                            .then(response => response.json())
                            .then(response => {
                                let savedData = {
                                    id: user.id,
                                    email: user.email,
                                    givenName: response.givenName,
                                    familyName: response.familyName,
                                    photoUrl: response.photoUrl
                                }
                                switch (response?.trip?.state?.type) {
                                    case 'TOWARDS_VEHICLE':
                                        dispatch(setTabShown('arrived_to_user'));
                                        dispatch(setUserAssignedVehicle(response.trip.state.assigned));
                                        break;
                                    case 'WAITING_FOR_VEHICLE':
                                        dispatch(setTabShown('fulfilled'));
                                        dispatch(setUserAssignedVehicle(response.trip.state.assigned));
                                        fetch(`https://betteride-firebase-server-3mmcqmln7a-ew.a.run.app/getVehicleCurrentRoute?plateNumber=${response.trip.state.assigned}`)
                                            .then(response => response.json())
                                            .then(vehicleResponse => {
                                                dispatch(setRouteShown('vehicleToUser'));
                                                dispatch(setOrigin(vehicleResponse.origin));
                                                dispatch(setDestination(vehicleResponse.destination));
                                            })
                                            .catch(error => console.log('error', error))
                                        break;
                                    case 'WAIT_TO_EXIT':
                                        dispatch(setTabShown('arrived_to_destination'));
                                        dispatch(setUserAssignedVehicle(response.trip.state.assigned));
                                        fetch(`https://betteride-firebase-server-3mmcqmln7a-ew.a.run.app/getVehicleCurrentRoute?plateNumber=${response.trip.state.assigned}`)
                                            .then(response => response.json())
                                            .then(vehicleResponse => {
                                                dispatch(setRouteShown(null))
                                                dispatch(setOrigin(vehicleResponse.destination));
                                                dispatch(setDestination(vehicleResponse.destination));
                                            })
                                            .catch(error => console.log('error', error))
                                        break;
                                    case 'TOWARDS_DESTINATION':
                                        dispatch(setTabShown('with_user'));
                                        dispatch(setUserAssignedVehicle(response.trip.state.assigned));
                                        fetch(`https://betteride-firebase-server-3mmcqmln7a-ew.a.run.app/getVehicleCurrentRoute?plateNumber=${response.trip.state.assigned}`)
                                            .then(response => response.json())
                                            .then(vehicleResponse => {
                                                dispatch(setRouteShown('userToDestination'))
                                                dispatch(setOrigin(vehicleResponse.origin));
                                                dispatch(setDestination(vehicleResponse.destination));
                                            })
                                            .catch(error => console.log('error', error))
                                        break;
                                    default:
                                        dispatch(setTabShown('order'));
                                        dispatch(setOrigin(null));
                                        dispatch(setDestination(null));
                                        break;
                                }
                                dispatch(setUserInfo(savedData));
                            })
                            .catch(e => alert('inside fetch error', e))
                        setTimeout(() => navigation.navigate('Map'),1);
                    }
                })
                .catch(error => console.log('error', error))
        })

        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            switch (notification.request.content.data.type) {
                case "TOWARDS_USER":
                    dispatch(setTabShown('arrived_to_user'));
                    break;
                case 'WITH_USER':
                    dispatch(setTabShown('arrived_to_destination'));
                    break;
                default:
                    break;
            }
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("User clicked on the notification")
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const registerForPushNotificationsAsync = async () => {
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
            // console.log(token);
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


    const handleGoogleSignin = () => {
        setIsGoogleLoading(true);
        const config = {
            iosClientId: `826611003690-t8vsfq83kh3m7s7komjrcj9trb5nn0nr.apps.googleusercontent.com`,
            androidClientId: `826611003690-drnln24p7oc78s2s7dk1me9a84uasg0q.apps.googleusercontent.com`,
            scope: ['profile', 'email'],
        };

        Google.logInAsync(config)
            .then(result => {
                const { type, user } = result;
                if (type === 'success') {
                    // generate token before pushing information
                    if (Device.isDevice) {
                        user['token'] = token;
                        // get higher photo quality
                        user.photoUrl = user.photoUrl.replace('96', '500')
                        fetch(`https://betteride-firebase-server-3mmcqmln7a-ew.a.run.app/loginUser`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ user })
                        })
                            .then(response => response.json())
                            .then(response => {
                                let savedData = {
                                    id: user.id,
                                    email: user.email,
                                    givenName: response.givenName,
                                    familyName: response.familyName,
                                    photoUrl: response.photoUrl,
                                }
                                try {
                                    if (response?.trip?.state?.type === 'TOWARDS_VEHICLE') dispatch(setTabShown('arrived_to_user'));
                                    else if (response?.trip?.state?.type === 'WAITING_FOR_VEHICLE') dispatch(setTabShown('null'));
                                    else if (response?.trip?.state?.type === 'WAIT_TO_EXIT') dispatch(setTabShown('arrived_to_destination'));
                                    else dispatch(setTabShown('order'));
                                }
                                catch (e) { console.log(e) }
                                storeUserData(savedData);
                                navigation.navigate('Map');
                            })
                            .catch(e => alert(e))
                    }
                    else {
                        storeUserData(user);
                        navigation.navigate('Map');
                    }
                }
                else console.log('Google signin was canceled');
            })
            .catch(error => console.log('error', error))
            .finally(() => { setTimeout(() => setIsGoogleLoading(false), 500) });
    }
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            dispatch(setUserLocation(location));
        })();
    }, []);

    const storeUserData = (user) => {
        dispatch(setUserInfo(user));
        AsyncStorage.setItem('Users', JSON.stringify({ user }))
            .catch(error => console.log('error', error));
    }

    const animateLoginPage = () => {
        Animated.timing(yAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }

    return (
        <View style={tw``}>
            <Animated.View style={[tw`h-full w-full z-10 overflow-hidden `, { borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius, transform: [{ translateY }] }]}>
                <Animated.View style={[styles.logoTextContainer, tw``, { transform: [{ translateY: translateLogo }] }]}>
                    <Text style={styles.title}>Betteride</Text>
                    <Text style={styles.subTitle}>Get there.</Text>
                </Animated.View>
                <Animated.View style={[styles.loadingDiv, { opacity }]}>
                    <Text style={styles.loadingText}>Give us a second to load the data for you</Text>
                    <ActivityIndicator color={'white'} style={tw`mt-2`} />
                </Animated.View>
                <LinearGradient
                    start={[0, 0]} end={[1, 1]}
                    colors={['#84b6ea', '#49739c']}
                    style={tw`w-full h-full`}
                />
                <Animated.Image style={[styles.carIcon, { transform: [{ translateY: translateLogo }] }]} source={{ uri: 'https://www.unlimitedtuning.nl/media/catalog/product/t/e/teslaaaa_5.png' }} />
            </Animated.View>
            <View style={[tw`bg-white absolute bottom-0  w-full z-0 justify-center items-center`, { height: 160, }]}>
                <LoginButton isGoogleLoading={isGoogleLoading} onPress={handleGoogleSignin} color={['gray-300', 'black']} text={'Login with Google'} url={'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png'} />
            </View>
        </View>
    )
}

export default LoadingScreen

const styles = StyleSheet.create({
    carIcon: {
        height: 300,
        width: 500,
        position: 'absolute',
        bottom: '15%',
        right: '-50%',
    },
    logoTextContainer: {
        position: 'absolute',
        width: '100%',
        top: '20%',
        zIndex: 1,
    },
    title: {
        textAlign: 'center',
        fontSize: 70,
        color: 'white',
        fontWeight: '500',
    },
    subTitle: {
        textAlign: 'center',
        fontSize: 25,
        color: 'white',
        fontWeight: '600',
    },
    loadingDiv: {
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: '5%',
        zIndex: 1,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 15,
        color: 'white',
        fontWeight: '500',
    }
})
