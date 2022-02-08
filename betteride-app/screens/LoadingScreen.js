import React, { useEffect, useState, useRef } from 'react'
import { Image, StyleSheet, Text, View, ActivityIndicator, Animated, Button, Easing, TouchableOpacity } from 'react-native'
import tw from 'tailwind-react-native-classnames'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
// import { getDatabase, child, ref, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { selectUserAssignedVehicle, setUserAssignedVehicle } from '../slices/navSlice';
import { useDispatch, useSelector } from 'react-redux';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectUserInfo, setUserInfo } from '../slices/userSlice';
import LoginButton from '../components/LoginButton'
import * as Google from 'expo-google-app-auth'

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

const LoadingScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const vehiclePlateNumber = useSelector(selectUserAssignedVehicle);
    // const user = useSelector(selectUserInfo);
    const [user, setUser] = useState(null);
    const yAnimation = useRef(new Animated.Value(0)).current;
    const translateY = yAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, -150] })
    const translateLogo = yAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 75] })
    const opacity = yAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
    const borderRadius = yAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 30] })


    useEffect(() => {
        //Update the state you want to be updated
        const rerender = navigation.addListener('focus', () => {
            AsyncStorage.getItem('Users')
                .then(result => {
                    if (!result) {
                        console.log('There is no logged user...');
                        setTimeout(() => animateLoginPage(), 2000)
                        // navigation.navigate('Login');
                    }
                    else {
                        console.log('There is already a logged user!');
                        dispatch(setUserInfo(JSON.parse(result)));
                        setTimeout(() => navigation.navigate('Map'), 2000)
                    }
                })
                .catch(error => console.log('error', error))
        })
        return rerender;
    }, [navigation])
    // const getUserAssignedVehicle = async () => {
    //     let plateNumber = null;
    //     await get(child(ref(getDatabase()), `users/1/trip/vehiclePlateNumber`)).then((snapshot) => {
    //         plateNumber = snapshot.val();
    //     })
    //     dispatch(setUserAssignedVehicle(plateNumber));
    // };
    // getUserAssignedVehicle();



    useEffect(() => {
        if (user) {
            dispatch(setUserInfo(user));
            setTimeout(() => navigation.navigate('Map'), 1000)
        }
    }, [user]);

    const handleGoogleSignin = () => {
        const config = {
            iosClientId: `826611003690-t8vsfq83kh3m7s7komjrcj9trb5nn0nr.apps.googleusercontent.com`,
            androidClientId: `826611003690-drnln24p7oc78s2s7dk1me9a84uasg0q.apps.googleusercontent.com`,
            scope: ['profile', 'email'],
        };

        Google.logInAsync(config)
            .then(result => {
                const { type, user } = result;
                if (type === 'success') {
                    fetch("http://10.100.102.233:3000/loginUser", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user })
                    })
                        .then(response => response.json())
                        .then(response => {
                            savedData = {
                                id:user.id,
                                email:user.email,
                                firstName:response.firstName,
                                lastName:response.lastName,
                                photoUrl:response.photoUrl
                            }
                            AsyncStorage.setItem('Users', JSON.stringify({id:user.id}))
                                .catch(error => console.log('error', error));
                            setUser(savedData);
                        })
                        .catch(e => console.log(e))
                }
                else console.log('Google signin was canceled');
            })
            .catch(error => console.log('error', error));
    }

    const animateLoginPage = () => {
        Animated.timing(yAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,

        }).start();
    }

    return (
        <View style={tw``}>
            <Animated.View style={[tw`h-full w-full z-10 overflow-hidden `, { borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius, transform: [{ translateY }] }]}>
                <Animated.View style={[styles.logoTextContainer, { transform: [{ translateY: translateLogo }] }]}>
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
            <View style={[tw`bg-white absolute bottom-0  w-full z-0 justify-center items-center`, { height: 200, }]}>
                <LoginButton onPress={handleGoogleSignin} color={'gray-200'} text={'Login with Google'} url={'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png'} />
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
