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

const ArrivedToDestination = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [selected, setSelected] = useState(null);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);
    const origin = useSelector(selectOrigin)
    const destination = useSelector(selectDestination)
    const userData = useSelector(selectUserInfo);
    const userAssignedVehicle = useSelector(selectUserAssignedVehicle)

    const finishTrip = async () => {
        let response = await fetch(`http://${IP_ADDRESS}:3000/finishTrip?userID=${userData.id}&plateNumber=${userAssignedVehicle}`, {
            method: "PUT",
        })
        // clear data -
        dispatch(setRouteShown(null))
        dispatch(setOrigin(null))
        dispatch(setDestination(null))
        dispatch(setTabShown('order'))
    }

    return (
        <SafeAreaView style={[styles.orderContainer, tw`justify-between shadow-lg`]}>
            <Text style={tw`text-blue-400 font-bold text-xl my-4 text-center`}>You have arrived to {'destination'}!</Text>
            <View style={tw`justify-center items-center my-1 px-2`}>
                <Text style={[tw`text-center my-1`, { fontSize: 15 }]}>Please step outside of the vehicle.</Text>
            </View>
            <TouchableOpacity activeOpacity={.5} onPress={finishTrip} style={styles.appButtonContainer}>
                <Text style={styles.appButtonText}>I'm outside!</Text>
            </TouchableOpacity>
        </SafeAreaView >
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