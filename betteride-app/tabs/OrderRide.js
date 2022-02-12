import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import tw from 'tailwind-react-native-classnames';
import GoogleAutocomplete from "../components/GoogleAutocomplete";
import { selectDestination, selectOrigin, selectRouteShown, selectTabShown, setDestination, setOrigin, setTabShown, setRouteShown } from '../slices/navSlice'
import DotsAndLines from "../components/DotsAndLines";
import { useDispatch, useSelector } from "react-redux";
import { Platform } from 'react-native'
import { GOOGLE_MAPS_APIKEY } from '@env';


const OrderRide = () => {
    const axios = require("axios");
    const dispatch = useDispatch();
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const [isRouteValid, setIsRouteValid] = useState(false);

    const findRide = () => {
        if (!origin && !destination) {
            alert('Make sure to fill in both pick up and drop off locations');
            return;
        };
        dispatch(setTabShown('confirm'));
    }

    const validateRoute = async (dataType, object) => {
        if (dataType === "origin" && destination || dataType === "destination" && origin) {
            if (dataType === 'origin' && object.location.lat === destination.location.lat && object.location.lng === destination.location.lng) {
                alert("Make sure that your origin is different then destination")
                return
            }
            else if (dataType === 'destination' && object.location.lat === origin.location.lat && object.location.lng === origin.location.lng) {
                alert("Make sure that your origin is different then destination")
                return
            }
            await axios
                .get(
                    `https://maps.googleapis.com/maps/api/directions/json?origin=${origin ? origin.description : destination.description}&destination=${object.description}&key=${GOOGLE_MAPS_APIKEY}`
                )
                .then((response) => response.data)
                .then(response => {
                    if (response.status === "ZERO_RESULTS") {
                        alert("There is no route from your origin to destination")
                        dispatch(setDestination(null))
                        dispatch(setOrigin(null))
                    }
                })
                .catch((error) => console.log("error", error));
        }
        if (dataType === "origin")
            dispatch(setOrigin(object))
        else dispatch(setDestination(object))
    }
    useEffect(() => {
        if (origin && destination)
            setIsRouteValid(true);
        else setIsRouteValid(false)
    }, [origin, destination])

    return (
        <View style={[styles.orderContainer, tw`bg-white shadow-lg`, { width: '100%' }]}>
            <View style={[styles.orderBox, tw`shadow-lg`]}>
                <DotsAndLines amountOfLines={13} />
                <View style={tw`w-5/6 flex flex-col justify-between`}>
                    <GoogleAutocomplete dataType={"origin"} validateRoute={validateRoute} text={['PICK UP', 'Where from?']} />
                    <GoogleAutocomplete dataType={"destination"} validateRoute={validateRoute} text={['DROP OFF', 'Where to?']} />
                </View>
            </View>
            <View style={tw``}>
                <TouchableOpacity disabled={!isRouteValid} activeOpacity={.5} onPress={findRide} style={[styles.appButtonContainer, tw`${isRouteValid ? null : 'bg-gray-300'}`]}>
                    <Text style={styles.appButtonText}>Send Request</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OrderRide

const styles = StyleSheet.create({
    orderContainer: {
        bottom: Platform.OS === "ios" ? 30 : 20,
        left: 0,
        padding: 10,
        borderRadius: 20,
        width: '95%',
        marginLeft: '2.5%',
        display: 'flex',
    },
    orderBox: {
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: -5,
    },
    orderAction: {
        fontSize: 12,
        color: 'gray',
    },
    orderInput: {
        fontSize: 18,
        color: 'black',
    },
    appButtonContainer: {
        backgroundColor: "#79aee2",
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 12
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
    }
});