import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'
import { Icon } from 'react-native-elements'
import { useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { selectTabShown, selectTravelTimeInformation } from '../slices/navSlice'
import { useDispatch } from "react-redux";
import { setTabShown } from '../slices/navSlice'
import { Platform } from 'react-native'

const FulfilledOrder = () => {
    const dispatch = useDispatch();
    const tabShown = useSelector(selectTabShown)
    const navigation = useNavigation();
    const travelTimeInformation = useSelector(selectTravelTimeInformation);

    useEffect(() => {
        if (tabShown !== 'fulfilled') return;
        setTimeout(() => { skipNext() }, 3000);
    }, [tabShown])

    const skipNext = () => { dispatch(setTabShown('vehicle_location')); }

    return (
        <Animated.View style={[tw`bg-white items-center justify-between`, { width: '100%', height: '92%' }]}>
            <Text style={[{ height: 35 }, tw`text-3xl font-bold`]}>Order fulfilled</Text>
            <Text style={[tw`absolute bottom-14`, { left: '20%', fontSize: 36 }]}>🎉</Text>
            <Text style={[tw`absolute bottom-0`, { right: '20%', fontSize: 36, transform: [{ translateX: 8 }] }]}>🥳</Text>
            <View style={tw`px-3 items-center w-full`}>
                <Text style={[tw`text-blue-400 font-bold mb-1 text-center`, { fontSize: 16 }]}>Your order has been successfully registered</Text>
                <View style={tw`justify-center items-center my-1 w-full`}>
                    <Text style={[tw`text-center my-1`, { fontSize: 16 }]}>The estimated time of arrival of the vehicle is 15 minutes and will arrive at 10:15</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => skipNext()} style={tw` justify-around items-center px-4 mt-5`} activeOpacity={1}>
                <View style={tw`p-1 h-20 w-20 bg-green-300 rounded-full shadow-md justify-center items-center my-2`}>
                    <Icon name="done" type="material" color={'green'} size={64} />
                </View>
            </TouchableOpacity>
        </Animated.View >
    )
}

export default FulfilledOrder

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
    },
    appButtonContainer: {
        backgroundColor: "#79aee2",
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 12,
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
    }
});