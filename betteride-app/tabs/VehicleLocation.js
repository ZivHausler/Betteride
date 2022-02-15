import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDatabase, ref, onValue } from 'firebase/database';
import { selectTabShown, selectUserAssignedVehicle } from '../slices/navSlice';
import { IP_ADDRESS } from "@env";

const VehicleLocation = () => {

  const [vehicleLocation, setVehicleLocation] = useState(null);
  const plateNumber = useSelector(selectUserAssignedVehicle);
  const tabShown = useSelector(selectTabShown);

  useEffect(() => {
    if (tabShown === 'vehicle_location') {
      onValue(ref(getDatabase(), `vehicles/${plateNumber}/currentLocation/`), (snapshot) => {
        fetch(`http://${IP_ADDRESS}:3001/api/translateCordsToAddress?lat=${snapshot.val().location.lat}&lng=${snapshot.val().location.lng}`, {
          method: 'GET',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        })
          .then(response => console.log(response))
          .catch((error) => console.log('error at vehicleLocation - 23:', error));
      });
    }
  }, []);

  useEffect(() => {

  }, [vehicleLocation])

  return (
    <View>
      <Text>{vehicleLocation}</Text>
    </View>
  )
}

export default VehicleLocation

const styles = StyleSheet.create({})