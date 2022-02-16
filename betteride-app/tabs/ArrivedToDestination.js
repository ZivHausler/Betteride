import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { Icon } from 'react-native-elements'
import { useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { selectDestination, selectOrigin, selectTravelTimeInformation, selectUserAssignedVehicle, setDestination, setOrigin, setRouteShown, setUserAssignedVehicle } from '../slices/navSlice'
import { useDispatch } from "react-redux";
import { setTabShown } from '../slices/navSlice'
import Intl from 'intl/lib/core'
import { Platform } from 'react-native'
import { IP_ADDRESS } from "@env";
import { selectUserInfo } from '../slices/userSlice'
import { setVehicleLocation } from '../slices/vehicleSlice'

const ArrivedToDestination = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [selected, setSelected] = useState(null);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);
    const origin = useSelector(selectOrigin)
    const destination = useSelector(selectDestination)
    const userData = useSelector(selectUserInfo);
    const userAssignedVehicle = useSelector(selectUserAssignedVehicle)
    const [isLoading, setIsLoading] = useState(false);

    const finishTrip = async () => {
        setIsLoading(true);
        let response = await fetch(`https://betteride-firebase-server-3mmcqmln7a-ew.a.run.app/finishTrip?userID=${userData.id}&plateNumber=${userAssignedVehicle}&canceled=${false}`, {
            method: "PUT",
        })
        // clear data -
        dispatch(setOrigin(null));
        dispatch(setDestination(null));
        dispatch(setRouteShown('userToDestination'));
        dispatch(setUserAssignedVehicle(null));
        dispatch(setVehicleLocation(null));
        setIsLoading(false);
        dispatch(setTabShown('order'));
    }

    return (
        <View style={[tw`bg-white items-center justify-between`, { width: '100%', height: '92%' }]}>
            <Text style={[{ height: 35 }, tw`text-3xl font-bold`]}>Arrived to destination</Text>
            <View style={tw`justify-center items-center my-1 px-2`}>
                <Text style={[tw`text-blue-400 font-semibold mb-1 text-center`, { fontSize: 16 }]}>You have arrived to {'destination'}!</Text>
                <Text style={[tw`text-center my-1`, { fontSize: 16 }]}>To release the vehicle, please exit the right side of the it.</Text>
                <Text style={[tw`text-center my-1`, { fontSize: 16 }]}>Once you have safely got out of the vehicle, press the button to release the vehicle.</Text>
            </View>
            {!isLoading ?
                <TouchableOpacity activeOpacity={.5} onPress={finishTrip} style={styles.appButtonContainer}>
                    <Text style={styles.appButtonText}>I'm outside. You are free!</Text>
                </TouchableOpacity>
                :
                <View style={[styles.loadOrderContainer, tw`flex-row w-1/2 justify-center items-center p-3`]}>
                    <ActivityIndicator color={'white'} style={tw``} />
                </View>}
        </View >
    )
}

export default ArrivedToDestination;

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