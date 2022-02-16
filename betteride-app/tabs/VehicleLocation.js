import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectVehicleLocation } from '../slices/vehicleSlice';

const VehicleLocation = () => {
  // const [vehicleLocation, setVehicleLocation] = useState(null);
  const vehicleLocation = useSelector(selectVehicleLocation);

  return (
    <View>
      <Text>{JSON.stringify(vehicleLocation)}</Text>
      <Text>VEHICLE LOCATION TAB</Text>
    </View>
  )
}

export default VehicleLocation

const styles = StyleSheet.create({})