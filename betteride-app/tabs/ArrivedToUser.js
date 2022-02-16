import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { selectDestination, selectOrigin, selectTravelTimeInformation, setDestination, setOrigin, setRouteShown, setUserAssignedVehicle } from '../slices/navSlice'
import { useDispatch } from "react-redux";
import { setTabShown } from '../slices/navSlice'
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
        setIsSearchingVehicle(true);
        let response = await fetch(`https://betteride-main-server-3mmcqmln7a-ew.a.run.app/api/generateRouteToVehicle?userID=${userData.id}`, {
            method: "PUT",
        })
        response = await response.json();
        dispatch(setTabShown('with_user'));
        dispatch(setOrigin(response.origin));
        dispatch(setDestination(response.destination));
        setIsSearchingVehicle(false);
        dispatch(setRouteShown('userToDestination'));
    }

    return (
        <View style={[tw`bg-white items-center justify-between`, { width: '100%', height: '92%' }]}>
            <Text style={[{ height: 35 }, tw`text-3xl font-bold`]}>Vehicle has arrived</Text>
            <View style={tw`px-4`}>
                <Text style={[tw`text-blue-400 font-semibold mb-1 text-center`, { fontSize: 16 }]}>A vehicle with a plate number of 8XB-345 has just arrived to the requested location</Text>
                <View style={tw`justify-center items-center my-1 px-2`}>
                    <Text style={[tw`text-center my-1`, { fontSize: 16 }]}>Please confirm your presence inside the vehicle to begin the journey.</Text>
                    <Text style={[tw`text-center my-1`, { fontSize: 16 }]}>Make sure you are buckled up and ready to ride.</Text>
                </View>
            </View>

            {!isSearchingVehicle ?
                <TouchableOpacity activeOpacity={.5} onPress={startRide} style={styles.appButtonContainer}>
                    <Text style={styles.appButtonText}>I'm inside and ready. Let's go!</Text>
                </TouchableOpacity>
                :
                <View style={[styles.loadOrderContainer, tw`flex-row w-1/2 justify-center items-center p-3`]}>
                    <ActivityIndicator color={'white'} style={tw``} />
                </View>}
        </View >
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
        marginTop: 0,
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