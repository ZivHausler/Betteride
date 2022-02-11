import { useNavigation } from '@react-navigation/native'
import React, { useState, useRef } from 'react'
import { FlatList, Image, Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { selectTravelTimeInformation, setRouteShown } from '../slices/navSlice'
import { useDispatch } from "react-redux";
import { setTabShown } from '../slices/navSlice'
import { Platform } from 'react-native'

const VehicleArrived = () => {
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

    return (
        <Animated.View style={[styles.orderContainer, { opacity: fadeAnim }, tw`shadow-lg`]} >
            <TouchableOpacity style={tw` px-1 justify-around items-center `} onPress={fadeOut} activeOpacity={1}>
                <Text style={tw`text-blue-400 font-bold text-xl my-1 `}>Your vehicle has arrived</Text>
                <View style={tw`justify-center items-center my-1`}>
                    <Text style={tw`text-center mb-1`}>Vehicle with plate number: (plate number) </Text>
                    <Text style={tw`text-center`}>To start the trip, you must confirm your presence inside the vehicle. </Text>
                </View>
                <TouchableOpacity activeOpacity={.5} onPress={() => alert('daniel ata be mute')} style={styles.appButtonContainer}>
                    <Text style={styles.appButtonText}>Get there!</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View >
    )
}

export default VehicleArrived;

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
        marginTop: 10,
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

});