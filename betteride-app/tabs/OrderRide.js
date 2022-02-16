import React, { useCallback,useState, useEffect,useRef } from 'react'
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Button, Pressable } from 'react-native'
import tw from 'tailwind-react-native-classnames';
import GoogleAutocomplete from "../components/GoogleAutocomplete";
import { selectDestination, selectOrigin, selectRouteShown, selectTabShown, setDestination, setOrigin, setTabShown, setRouteShown } from '../slices/navSlice'
import DotsAndLines from "../components/DotsAndLines";
import { useDispatch, useSelector } from "react-redux";
import { Platform } from 'react-native'
import { GOOGLE_MAPS_APIKEY } from '@env';
import * as Animatable from 'react-native-animatable'

const OrderRide = () => {
    const axios = require("axios");
    const dispatch = useDispatch();
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const [isRouteValid, setIsRouteValid] = useState(false);
    const originInputRef = useRef();
    const destinationInputRef = useRef();

   

    const findRide = () => {
        if (!origin && !destination) {
            alert('Make sure to fill in both pick up and drop off locations');
            return;
        };
        dispatch(setTabShown('confirm'));
    }

    useEffect(() => {

    }, [isRouteValid])

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
        <View style={[tw`bg-white items-center justify-between`, { width: '100%', height: '92%' }]}>
            <Text style={[{ height: 35 }, tw`text-3xl font-bold mb-3`]}>Order a ride</Text>
            <View style={[tw`shadow-md flex-col px-4`]}>
                <Text style={[tw`text-center mb-3`, { fontSize: 16 }]}>To place a vehicle reservation, make sure you insert source and destination.</Text>
                <View style={[tw`flex-row rounded-xl pt-2 bg-gray-200`, { backgroundColor: '#b6b9b8' }]}>
                    <DotsAndLines amountOfLines={13} />
                    <View style={tw`w-5/6 flex flex-col justify-between`}>
                        <GoogleAutocomplete dataType={"origin"} validateRoute={validateRoute} text={['PICK UP', 'Where from?']} />
                        <GoogleAutocomplete dataType={"destination"} validateRoute={validateRoute} text={['DROP OFF', 'Where to?']} />
                    </View>
                </View>
            </View>
            <View style={tw`h-14`}>
                {isRouteValid &&
                    <Animatable.View style={tw``} animation={'bounceIn'} delay={0}>
                        <TouchableOpacity disabled={!isRouteValid} activeOpacity={.5} onPress={findRide} style={[{
                            backgroundColor: "#79aee2", borderRadius: 15, paddingVertical: 16, paddingHorizontal: 12
                        }, tw`${isRouteValid ? null : 'bg-gray-300'}`]}>
                            <Text style={styles.appButtonText}>Send Request</Text>
                        </TouchableOpacity>
                    </Animatable.View>}
            </View>
                        
        </View>
    )
}

export default OrderRide

const styles = StyleSheet.create({
    appButtonContainer: {
        backgroundColor: "#79aee2",
        borderRadius: 15,
        paddingVertical: 16,
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
})