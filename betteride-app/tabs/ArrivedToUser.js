import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { Icon } from 'react-native-elements'
import { useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { selectDestination, selectOrigin, selectTravelTimeInformation, setDestination, setOrigin, setRouteShown, setUserAssignedVehicle } from '../slices/navSlice'
import { useDispatch } from "react-redux";
import { setTabShown } from '../slices/navSlice'
import Intl from 'intl/lib/core'
import { Platform } from 'react-native'
import { IP_ADDRESS } from "@env";
import { selectUserInfo } from '../slices/userSlice'

const ArrivedToUser = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [selected, setSelected] = useState(null);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);
    const origin = useSelector(selectOrigin)
    const destination = useSelector(selectDestination)
    const [isSearchingVehicle, setIsSearchingVehicle] = useState(false)
    const userData = useSelector(selectUserInfo);

    const startRide = async () => {
        // dispatch(setTabShown('null'));

        const userDirections = await fetch(`http://${IP_ADDRESS}:3000/getUserDirections?userID=${userData.id}`)
        const origin_destination = await userDirections.json();
        fetch(`http://${IP_ADDRESS}:3001/api/getUserDirections?origin=${origin_destination.userOrigin}
        &destination=${origin_destination.userDestination}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(response => {
                alert(JSON.stringify(response));
                // dispatch(setUserAssignedVehicle(response));
                // // create listener to the specific vehicle plate number
                // // dispatch(setOrigin(null));
                // dispatch(setDestination(null));
                // dispatch(setRouteShown('vehicleToUser'));;
                // dispatch(setTabShown('fulfilled'));
            })
            .catch(e => {
                console.log(e)
            })
            .finally(() => {
                setIsSearchingVehicle(false)
            })
    }

    return (
        <SafeAreaView style={[styles.orderContainer, tw`justify-between shadow-lg`]}>
            <Text style={tw`text-blue-400 font-bold text-xl my-4 text-center`}>Your vehicle has arrived!</Text>
            <View style={tw`justify-center items-center my-1 px-2`}>
                <Text style={[tw`text-center my-1`, { fontSize: 15 }]}>Make sure you are buckled up and ready to ride.</Text>
                <Text style={[tw`text-center my-1`, { fontSize: 15 }]}>Please confirm your presence inside the vehicle to begin the journey.</Text>
            </View>

            {!isSearchingVehicle ?
                <TouchableOpacity activeOpacity={.5} onPress={startRide} style={styles.appButtonContainer}>
                    <Text style={styles.appButtonText}>I'm in. Let's go!</Text>
                </TouchableOpacity>
                :
                <View style={styles.loadOrderContainer}>
                    <Text style={styles.loadingText}>Completing your order</Text>
                    <ActivityIndicator color={'white'} style={tw`mt-1`} />
                </View>}
        </SafeAreaView >
    )
}

export default ArrivedToUser;

const styles = StyleSheet.create({
    orderContainer: {
        position: 'absolute',
        bottom: Platform.OS === "ios" ? 30 : 20,
        left: 0,
        padding: 10,
        borderRadius: 20,
        width: '95%',
        marginLeft: '2.5%',
        backgroundColor: 'white',
        paddingVertical: 10,
    },
    appButtonContainer: {
        backgroundColor: "#79aee2",
        borderRadius: 15,
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginHorizontal: Platform.OS === "ios" ? 10 : 0,
        marginBottom: Platform.OS === "ios" ? 5 : 0,
        marginTop: 25,
    },
    loadOrderContainer: {
        backgroundColor: "#79aee2",
        borderRadius: 15,
        paddingVertical: 6,
        paddingHorizontal: 5,
        marginHorizontal: Platform.OS === "ios" ? 10 : 0,
        marginBottom: Platform.OS === "ios" ? 5 : 0,
        marginTop: 25,
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
    },
    testImage: {
        resizeMode: 'cover',
        height: 120,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 15,
        color: 'white',
        fontWeight: '500',
    }
});