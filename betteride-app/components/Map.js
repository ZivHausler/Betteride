import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { selectDestination, selectOrigin, selectRouteShown, selectUserAssignedVehicle, setTravelTimeInformation } from '../slices/navSlice';
import { selectVehicleETA, selectVehicleKMLeft, selectVehicleLocation, selectVehicleTimeLeft, setVehicleETA, setVehicleKMLeft, setVehicleLocation, setVehicleTimeLeft } from '../slices/vehicleSlice';
import { useSelector } from 'react-redux';
import { GOOGLE_MAPS_APIKEY } from '@env';
import { useDispatch } from 'react-redux';
import RenderRoute from "./RenderRoute";
import { getDatabase, ref, onValue } from 'firebase/database';
import { selectUserLocation } from "../slices/userSlice";


const Map = () => {
  const dispatch = useDispatch();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const userLocation = useSelector(selectUserLocation);
  const routeShown = useSelector(selectRouteShown);
  const userAssignedVehicle = useSelector(selectUserAssignedVehicle);
  const vehicleLocation = useSelector(selectVehicleLocation);
  
  const mapRef = useRef(null);
  const [showLocation, setShowLocation] = useState({
    latitude: 32.690918, // atlit lat
    longitude: 34.942981, // atlit lng
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  useEffect(() => {
    if (userLocation) {
      setShowLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      })
    }
  }, [userLocation])

  useEffect(() => {
    if (!userAssignedVehicle) return;
    onValue(ref(getDatabase(), `vehicles/${userAssignedVehicle}`), (snapshot) => {
      dispatch(setVehicleLocation(snapshot.val().currentLocation))
      dispatch(setVehicleETA(snapshot.val()?.route?.eta))
      dispatch(setVehicleKMLeft(snapshot.val()?.route?.km_left))
      dispatch(setVehicleTimeLeft(snapshot.val()?.route?.time_left))
      setShowLocation({
        latitude: snapshot.val().currentLocation.location.lat,
        longitude: snapshot.val().currentLocation.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
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
        {routeShown === 'vehicleToUser' && origin && (vehicleLocation != null) &&
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
        {(vehicleLocation != null) && <Marker
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
