import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { Icon } from 'react-native-elements'
import { useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { selectDestination, selectOrigin, selectTravelTimeInformation, setDestination, setOrigin, setRouteShown, setUserAssignedVehicle } from '../slices/navSlice'
import { useDispatch } from "react-redux";
import { setTabShown } from '../slices/navSlice'
import Intl from 'intl/lib/core'
import { Platform } from 'react-native'
import { IP_ADDRESS } from "@env";


const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const [isSearchingVehicle, setIsSearchingVehicle] = useState(false)

  const milesToKM = (string) => {
    if (!string) return;
    return (parseInt(string.split(' ')[0]) * 1.6).toFixed(1);
  }
  const confirmRide = () => {
    // show loading animation
    setIsSearchingVehicle(true)
    // then fetch the nearest vehicle
    // then do this VV
    // const baseUrl = Platform.OS === 'android' ? 'http://'+IP_ADDRESS : 'http://localhost';
    const baseUrl = `http://10.0.0.8`;        //'http://'+IP_ADDRESS;
    fetch(baseUrl + `:3001/api/OrderVehicle?userOrigin=${origin.description}
    &userDestination=${destination.description}&userID=2`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(response => {
        dispatch(setUserAssignedVehicle(response));
        // create listener to the specific vehicle plate number
        // dispatch(setOrigin(null));
        dispatch(setDestination(null));
        dispatch(setRouteShown('vehicleToUser'));;
        dispatch(setTabShown('order'));
      })
      .catch(e => {
        console.log(e)
      })
      .finally(() => {
        setIsSearchingVehicle(false)
      })

  }

  return (
    <SafeAreaView style={[styles.orderContainer, tw`justify-between shadow-lg`]}>
      <View style={tw`p-3`}>
        <Text style={tw`text-xl font-bold text-center`}>Confirm your ride</Text>
        <Image style={styles.testImage} source={{ uri: 'https://i.ibb.co/vjxRvQK/Tesla-Electric-Car-PNG-Free-Download.png' }} />
        <View style={tw`px-4`}>
          {/* <FlatList style={tw`px-4`}> */}
          <View style={tw`flex-row justify-between`}>
            <Text style={tw`mb-3 text-lg font-semibold`}>Tesla Model S</Text>
          </View>
          <View style={tw`flex-row justify-between my-0.5`}>
            <Text style={tw`text-gray-600`}>Distance</Text>
            <Text style={tw`text-center pb-2 text-gray-600`}>{milesToKM(travelTimeInformation?.distance?.text)} km</Text>
          </View>
          <View style={tw`flex-row justify-between my-0.5`}>
            <Text style={tw`text-gray-600`}>Duration</Text>
            <Text style={tw`text-center pb-2 text-gray-600`}>{travelTimeInformation?.duration.text}</Text>
          </View>
          <View style={tw`flex-row justify-between my-0.5`}>
            <Text style={tw`text-gray-600`}>Price</Text>
            <Text style={tw`text-gray-600`}> {(travelTimeInformation?.duration.value * 1.5) / 300} ₪
            </Text>
          </View>
          {/* </FlatList> */}
        </View>
      </View>

      {!isSearchingVehicle ? <TouchableOpacity activeOpacity={.5} onPress={confirmRide} style={styles.appButtonContainer}>
        <Text style={styles.appButtonText}>Confirm order</Text>
      </TouchableOpacity>
        :
        <View style={styles.loadOrderContainer}>
          <Text style={styles.loadingText}>Completing your order</Text>
          <ActivityIndicator color={'white'} style={tw`mt-1`} />
        </View>}
    </SafeAreaView>
  )
}

export default ConfirmOrder

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
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: Platform.OS === "ios" ? 10 : 0,
    marginBottom: Platform.OS === "ios" ? 5 : 0,
    marginTop: 25,
  },
  loadOrderContainer: {
    backgroundColor: "#79aee2",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 5,
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
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 15,
    color: 'white',
    fontWeight: '500',
  }
});