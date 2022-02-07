import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { selectCurrentLocation, selectDestination, selectOrigin, selectRouteShown, selectUserAssignedVehicle, setDestination, setOrigin, setTravelTimeInformation, setUserAssignedVehicle } from '../slices/navSlice';
import { useSelector } from 'react-redux';
import { GOOGLE_MAPS_APIKEY } from '@env';
import { useDispatch } from 'react-redux';
import RenderRoute from "./RenderRoute";
import VehicleMarkers from "./VehicleMarkers";
import { getDatabase, child, ref, get, onValue } from 'firebase/database';

const Map = () => {
  const currentLocation = useSelector(selectCurrentLocation);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const routeShown = useSelector(selectRouteShown);
  const userAssignedVehicle = useSelector(selectUserAssignedVehicle);
  const [vehicleLocation, setVehicleLocation] = useState(null);
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const atlit = { location: { lat: 32.690918, lng: 34.942981 }, description: 'Atlit, Israel' }
  const [showLocation, setShowLocation] = useState({
    latitude: atlit.location.lat,
    longitude: atlit.location.lng,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  useEffect(() => {
    if (!userAssignedVehicle) return;
    onValue(ref(getDatabase(), `vehicles/${userAssignedVehicle}/currentLocation/`), (snapshot) => {
      setVehicleLocation(snapshot.val());
      setShowLocation({
        latitude: snapshot.val().location.lat,
        longitude: snapshot.val().location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      })
    });
  }, [userAssignedVehicle]);

  useEffect(() => {
    if (origin && destination) {
      mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: { top: 50, bottom: 400, left: 10, right: 10 }, animated: true,
      });
    }
    else if (origin && !destination) {
      setShowLocation({
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      })
    }
    else if (destination && !origin) {
      setShowLocation({
        latitude: destination.location.lat,
        longitude: destination.location.lng,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      })
    }
  }, [origin, destination])

  useEffect(() => {
    if (!origin || !destination) return;
    const getTravelTime = async () => {
      fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_APIKEY}`)
        .then(res => res.json())
        .then(data => dispatch(setTravelTimeInformation(data.rows[0].elements[0])))
    }
    getTravelTime();
  }, [origin, destination, GOOGLE_MAPS_APIKEY])

  return (
    <View style={tw`h-full`}>
      <MapView
        ref={mapRef}
        style={tw`flex-1`}
        mapType="mutedStandard"
        region={showLocation}>
        {routeShown === 'userToDestination' && origin && destination &&
          <RenderRoute origin={origin} destination={destination} color={'#0088ff'} />}
        {routeShown === 'vehicleToUser' && origin && vehicleLocation &&
          <RenderRoute origin={vehicleLocation} destination={origin} color={'green'} />}
        {origin && !destination && <Marker coordinate={{
          latitude: origin.location.lat,
          longitude: origin.location.lng,
        }}
          title="Origin"
          description={origin.description}
          identifier="origin" />}
        {destination && !origin && <Marker coordinate={{
          latitude: destination.location.lat,
          longitude: destination.location.lng,
        }}
          title="Destination"
          description={destination.description}
          identifier="destination" />}

        {/* assigned vehicle marker */}
        {vehicleLocation != null && <Marker
          coordinate={{
            latitude: vehicleLocation.location.lat,
            longitude: vehicleLocation.location.lng,
          }}
        >
          <Image style={{ height: 35, width: 35 }} source={{ uri: 'https://i.ibb.co/kSx3LW6/Red.png' }} />
        </Marker>}

        {/* <VehicleMarkers /> */}
      </MapView>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({});
