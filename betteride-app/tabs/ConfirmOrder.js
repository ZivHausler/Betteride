import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Icon } from 'react-native-elements'
import { useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { selectDestination, selectOrigin, selectTravelTimeInformation, setDestination, setOrigin, setRouteShown, setUserAssignedVehicle } from '../slices/navSlice'
import { useDispatch } from "react-redux";
import { setTabShown } from '../slices/navSlice'
import { Platform } from 'react-native'
import { IP_ADDRESS } from "@env";
import { selectUserInfo } from '../slices/userSlice'


const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const [isSearchingVehicle, setIsSearchingVehicle] = useState(false);
  const userData = useSelector(selectUserInfo);

  const milesToKM = (string) => {
    if (!string) return;
    return (parseInt(string.split(' ')[0]) * 1.6).toFixed(1);
  }
  const confirmRide = () => {
    if (!userData) return;
    // show loading animation
    setIsSearchingVehicle(true)
    // then fetch the nearest vehicle
    // then do this VV
    // const baseUrl = Platform.OS === 'android' ? 'http://'+IP_ADDRESS : 'http://localhost';
    fetch(`https://betteride-main-server-3mmcqmln7a-ew.a.run.app/api/OrderVehicle?userOrigin=${origin.description}
    &userDestination=${destination.description}&userID=${userData.id}`, {
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
        dispatch(setTabShown('fulfilled'));
      })
      .catch(e => {
        console.log(e)
      })
      .finally(() => {
        setIsSearchingVehicle(false)
      })
  }

  return (
    <View style={[tw`bg-white items-center justify-between`, { width: '100%', height: '92%' }]}>
      <Text style={[{ height: 35 }, tw`text-3xl font-bold`]}>Confirm order</Text>
      {!isSearchingVehicle &&
        <TouchableOpacity style={{ position: 'absolute', top: 8, left: 7, zIndex: 2 }} activeOpacity={0.3}
          onPress={() => dispatch(setTabShown('order'))}>
          <AntDesign name='left' size={20} color={'#333'} />
        </TouchableOpacity>}
      <Image style={[tw`w-full h-24`, { resizeMode: 'cover' }]} source={{ uri: 'https://i.ibb.co/vjxRvQK/Tesla-Electric-Car-PNG-Free-Download.png' }} />
      <View style={tw`mb-2`}>
        <View style={tw`px-4 w-full`}>
          <View style={tw`items-center`}>
            <Text style={tw`-mt-2 mb-1 text-lg font-semibold`}>Tesla Model S</Text>
          </View>
          <View style={[tw`flex-row justify-around w-full items-center `]}>
            <View style={tw`flex-col flex-1 items-center my-0.5 `}>
              <Text style={tw`text-gray-600 mb-0.5`}>Distance</Text>
              <Text style={[tw`text-center text-gray-900 font-semibold`, { fontSize: 16 }]}>{milesToKM(travelTimeInformation?.distance?.text)} km</Text>
            </View>
            <View style={tw`flex-col flex-1 my-0.5 items-center `}>
              <Text style={tw`text-gray-600 mb-0.5`}>Duration</Text>
              <Text style={[tw`text-center text-gray-900 font-semibold`, { fontSize: 16 }]}>{travelTimeInformation?.duration.text}</Text>
            </View>
            <View style={tw`flex-col flex-1 my-0.5 items-center `}>
              <Text style={tw`text-gray-600 mb-0.5`}>Price</Text>
              <Text style={[tw`text-center text-gray-900 font-semibold`, { fontSize: 16 }]}> {((travelTimeInformation?.duration.value * 1.5) / 300)} ₪</Text>
            </View>
          </View>
        </View>
      </View>

      {!isSearchingVehicle ? <TouchableOpacity activeOpacity={.5} onPress={confirmRide} style={styles.appButtonContainer}>
        <Text style={[styles.appButtonText]}>Confirm order</Text>
      </TouchableOpacity>
        :
        <View style={[styles.appButtonContainer, tw`bg-gray-400`]}>
          <Text style={[styles.appButtonText]}>Completing your order</Text>
          <ActivityIndicator color={'white'} style={tw`pl-4`} />
        </View>}
    </View>
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
    flexDirection: 'row',
    backgroundColor: "#79aee2",
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: Platform.OS === "ios" ? 10 : 0,
    marginBottom: Platform.OS === "ios" ? 5 : 0,
    marginTop: 0,
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