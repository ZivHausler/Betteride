import React, { useEffect, useState } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View, Modal, Image } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { Platform } from 'react-native'
import { selectVehicleETA, selectVehicleKMLeft, selectVehicleLocation, selectVehicleTimeLeft, setVehicleLocation } from '../slices/vehicleSlice'
import { selectUserAssignedVehicle, setDestination, setOrigin, setRouteShown, setTabShown, setUserAssignedVehicle } from '../slices/navSlice'
import { IP_ADDRESS } from "@env";
import { selectUserInfo, } from '../slices/userSlice'
import lightIcon from '../assets/lightIcon.png'


const WithUser = () => {
  const vehicleLocation = useSelector(selectVehicleLocation);
  const userData = useSelector(selectUserInfo);
  const userAssignedVehicle = useSelector(selectUserAssignedVehicle);
  const dispatch = useDispatch();
  const vehicleEta = useSelector(selectVehicleETA);
  const vehicleKMLeft = useSelector(selectVehicleKMLeft);
  const vehicleTimeLeft = useSelector(selectVehicleTimeLeft);

  return (
    <Animated.View style={[tw`bg-white items-center justify-between`, { width: '100%', height: '92%' }]}>
      <Text style={[{ height: 35 }, tw` text-3xl font-bold`]}>Driving to destination</Text>
      <View style={[tw`justify-around w-5/6`, { height: 150 }]}>
        <View style={tw`items-center`}>
          <Text style={tw`text-gray-600 mb-0.5 `}>
            Current location
          </Text>
          <Text style={[tw`text-center text-gray-900 font-semibold`, { fontSize: 18 }]}>
            {vehicleLocation?.address}
          </Text>
        </View>
        <View style={tw`flex-row items-center my-0.5 justify-around`}>
          <View style={tw`items-center  flex-1 justify-between`}>
            <Text style={tw`text-gray-600 mb-0.5`}>
              Time left
            </Text>
            <Text style={[tw`text-center text-gray-900 font-semibold`, { fontSize: 16 }]}>
              {vehicleTimeLeft ? (vehicleTimeLeft / 60).toFixed(0) + ' min' : 'calculating'}
            </Text>
          </View>
          <View style={tw`flex-col flex-1 items-center my-0.5 `}>
            <Text style={tw`text-gray-600 mb-0.5`}>ETA</Text>
            <Text style={[tw`text-center text-gray-900 font-semibold`, { fontSize: 22 }]}>{vehicleEta ? vehicleEta.split(' ')[1].split(':').slice(0, 2).join(':') : 'calculating'}</Text>
          </View>
          <View style={tw`items-center flex-1 justify-between`}>
            <Text style={tw`text-gray-600 mb-0.5`}>
              KM left
            </Text>
            <Text style={[tw`text-center text-gray-900 font-semibold`, { fontSize: 16 }]}>
              {vehicleKMLeft ? (vehicleKMLeft / 1000).toFixed(2) : 'calculating'}
            </Text>
          </View>
        </View>
      </View>
      <View style={tw` w-5/6  bg-gray-600 rounded-xl p-2 items-center shadow-lg`}>
        <Text style={tw`text-white mb-2 font-semibold`}>Adjust vehicle functionality</Text>
        <View style={tw`flex-row justify-around w-full`}>
          <TouchableOpacity activeOpacity={0.7} style={[tw`items-center justify-center bg-gray-900 rounded-full`,{width: 50, height: 50}]}>
            <Image style={[{ width: 40, height: 40, resizeMode: 'contain' }, tw``]} source={require('../assets/acIcon.png')} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={[tw`items-center justify-center bg-gray-900 rounded-full`,{width: 50, height: 50}]}>
            <Image style={[{ width: 40, height: 40, resizeMode: 'contain' }, tw``]} source={require('../assets/musicIcon.png')} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={[tw`items-center justify-center bg-gray-900 rounded-full`,{width: 50, height: 50}]}>
          <Image style={[{ width: 40, height: 40, resizeMode: 'contain' }, tw``]} source={require('../assets/lightIcon.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View >
  )
}

export default WithUser

const styles = StyleSheet.create({

});