import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getUserAssignedVehicle, selectFirebaseRef, selectUserAssignedVehicle, setDestination, setOrigin, setRouteShown, setTabShown } from '../slices/navSlice'
import tw from "tailwind-react-native-classnames";
import Map from "../components/Map";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import "react-native-gesture-handler";
import Menu from "../components/Menu";
// import OrderRide from "../tabs/OrderRide";
// import ConfirmOrder from "../tabs/ConfirmOrder";
// import FulfilledOrder from "../tabs/FulfilledOrder";
// import ArrivedToUser from "../tabs/ArrivedToUser";
// import ArrivedToDestination from "../tabs/ArrivedToDestination";
import ToUserBottomSheet from '../tabs/ToUserBottomSheet'

const MapScreen = () => {
  const Stack = createStackNavigator();
  // const vehiclePlateNumber = useSelector(getUserAssignedVehicle);
  // const dbRef = useSelector(selectFirebaseRef);
  const [currentTab, setCurrentTab] = useState(null);

  return (
    <View style={[tw`relative flex-1`]}>
      <Menu />
      <Map />
      <ToUserBottomSheet />
    </View>
  );
};

export default MapScreen;