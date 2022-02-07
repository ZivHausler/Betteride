import React, { useEffect } from 'react'
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import tw from 'tailwind-react-native-classnames'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, child, ref, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { selectUserAssignedVehicle, setUserAssignedVehicle } from '../slices/navSlice';
import { useDispatch, useSelector } from 'react-redux';

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
    const vehiclePlateNumber = useSelector(selectUserAssignedVehicle)

    const getUserAssignedVehicle = async () => {
        let plateNumber = null;
        await get(child(ref(getDatabase()), `users/1/trip/vehiclePlateNumber`)).then((snapshot) => {
            plateNumber = snapshot.val();
        })
        dispatch(setUserAssignedVehicle(plateNumber));
    };
    getUserAssignedVehicle();

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Map');
        }, 1000);
    }, [])

    return (
        <View style={tw`h-full w-full`}>
            <View style={styles.logoTextContainer}>
                <Text style={styles.title}>Betteride</Text>
                <Text style={styles.subTitle}>Get there.</Text>
            </View>
            <View style={styles.loadingDiv}>
                <Text style={styles.loadingText}>Give us a second to load the data for you</Text>
                <ActivityIndicator color={'white'} style={tw`mt-2`} />
            </View>
            <LinearGradient
                start={[0, 0]} end={[1, 1]}
                colors={['#84b6ea', '#49739c']}
                style={tw`w-full h-full`}
            />
            <Image style={styles.carIcon} source={{ uri: 'https://www.unlimitedtuning.nl/media/catalog/product/t/e/teslaaaa_5.png' }} />
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
