import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getUserAssignedVehicle, selectFirebaseRef, selectUserAssignedVehicle, setTabShown } from '../slices/navSlice'
import { selectTabShown } from '../slices/navSlice';
import tw from "tailwind-react-native-classnames";
import Map from "../components/Map";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import OrderRide from "../tabs/OrderRide";
import ConfirmOrder from "../tabs/ConfirmOrder";
import { useNavigation } from "@react-navigation/native";
import "react-native-gesture-handler";
import Menu from "../components/Menu";
import FulfilledOrder from "../tabs/FulfilledOrder";
import VehicleArrived from "../tabs/VehicleArrived";
import { selectUserInfo } from "../slices/userSlice";

const MapScreen = () => {
  const dispatch = useDispatch();
  const Stack = createStackNavigator();
  const user = useSelector(selectUserInfo);
  const tabShown = useSelector(selectTabShown);
  // const vehiclePlateNumber = useSelector(getUserAssignedVehicle);
  // const dbRef = useSelector(selectFirebaseRef);
  const [currentTab, setCurrentTab] = useState();


  useEffect(() => {
    switch (tabShown) {
      case 'order':
        setCurrentTab(<OrderRide />);
        break;
      case 'confirm':
        setCurrentTab(<ConfirmOrder />);
        break;
      case 'fulfilled':
        setCurrentTab(<FulfilledOrder />);
        break;
      case 'vehicleArrived':
        setCurrentTab(<VehicleArrived />);
        break;
      default: setCurrentTab(null);
        break;
    }
  }, [tabShown])

  return (
    <View style={[tw`relative`]}>
      <Menu />
      <Map />
      {currentTab}
    </View>
  );
};

export default MapScreen;