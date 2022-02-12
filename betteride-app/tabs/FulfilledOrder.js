import { useNavigation } from '@react-navigation/native'
import React, { useState, useRef, useEffect } from 'react'
import { FlatList, Image, Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { selectTravelTimeInformation, setRouteShown } from '../slices/navSlice'
import { useDispatch } from "react-redux";
import { setTabShown } from '../slices/navSlice'
import Intl from 'intl/lib/core'
import { Platform } from 'react-native'

const FulfilledOrder = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [selected, setSelected] = useState(null);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);

    // animation vars
    const fadeAnim = useRef(new Animated.Value(1)).current;
    // animation function
    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            dispatch(setTabShown(null))
        });
    };

    useEffect(() => {
        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                dispatch(setTabShown(null))
            });
        }, 4000)
    }, [])

    return (
        <Animated.View style={[styles.orderContainer, { opacity: fadeAnim }, tw`shadow-lg`]} >
            <TouchableOpacity style={tw` px-1 justify-around items-center `} onPress={fadeOut} activeOpacity={1}>
                <Text style={tw`text-blue-400 font-bold text-xl my-1`}>Booking successful</Text>
                <View style={tw`justify-center items-center my-1`}>
                    <Text style={tw`text-center`}>Your booking has been confirmed!</Text>
                    <Text style={tw`text-center`}>Your ride will be waiting for you approximately at 10:15</Text>
                </View>
                <View style={tw`p-1 h-10 w-10 bg-green-300 rounded-full shadow justify-center items-center my-2`}>
                    <Icon name="done" type="material" color={'green'} size={30} />
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