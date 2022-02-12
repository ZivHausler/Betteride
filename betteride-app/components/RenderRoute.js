import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapViewDirections from 'react-native-maps-directions';
import { Marker } from "react-native-maps";
import { GOOGLE_MAPS_APIKEY } from '@env';

const RenderRoute = ({ origin, destination, color }) => {
    // console.log("RenderRoute origin",origin)
    // console.log("RenderRoute destination",destination)
    return (
        <>
            <MapViewDirections origin={{latitude:origin.location.lat,longitude:origin.location.lng}} destination={{latitude:destination.location.lat,longitude:destination.location.lng}}
                apikey={GOOGLE_MAPS_APIKEY} strokeWidth={5} strokeColor={color} />
            <Marker coordinate={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
            }}
                title="Origin"
                description={origin.description}
                identifier="origin" />
            <Marker coordinate={{
                latitude: destination.location.lat,
                longitude: destination.location.lng,
            }}
                title="Destination"
                description={destination.description}
                identifier="destination" />
        </>
    )
}

export default RenderRoute

const styles = StyleSheet.create({})
