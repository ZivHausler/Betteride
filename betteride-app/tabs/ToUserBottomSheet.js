import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import tw from 'tailwind-react-native-classnames';
import { useSelector } from "react-redux";
import OrderRide from "../tabs/OrderRide";
import ConfirmOrder from "../tabs/ConfirmOrder";
import FulfilledOrder from "../tabs/FulfilledOrder";
import ArrivedToUser from "../tabs/ArrivedToUser";
import ArrivedToDestination from "../tabs/ArrivedToDestination";
import VehicleLocation from './VehicleLocation';
import WithUser from "../tabs/WithUser";
import { selectTabShown, setClearGoogleInputs, setRouteShown, setTabShown } from '../slices/navSlice';
import { useDispatch } from "react-redux";
import { setOrigin, setDestination } from '../slices/navSlice';
import Map from '../components/Map';
import { setVehicleLocation } from '../slices/vehicleSlice';

const width = Dimensions.get('window').width;
//create your forceUpdate hook

const ToUserBottomSheet = () => {
  const dispatch = useDispatch();
  const tabShown = useSelector(selectTabShown);

  useEffect(() => {
    let index;
    switch (tabShown) {
      case 'order':
        index = 0;
        dispatch(setClearGoogleInputs(true));
        dispatch(setOrigin(null));
        dispatch(setDestination(null));
        dispatch(setRouteShown('userToDestination'))
        dispatch(setVehicleLocation(null))
        break;
      case 'confirm':
        index = 1;
        break;
      case 'fulfilled':
        index = 2;
        break;
      case 'vehicle_location':
        index = 3;
        break;
      case 'arrived_to_user':
        index = 4;
        break;
      case 'with_user':
        index = 5;
        break;
      case 'arrived_to_destination':
        index = 6;
        break;
      default: index = 0;
        break;
    }
    scrolltoActiveCardShown(index)
  }, [tabShown])

  // ref
  const bottomSheetRef = useRef(null);
  const listRef = useRef();

  // variables
  const snapPoints = useMemo(() => [80, 350], []);

  // callbacks
  // const handleSheetChanges = useCallback((index) => {
  //   console.log('handleSheetChanges', index);
  // }, []);

  const scrolltoActiveCardShown = (index) => {
    listRef?.current?.scrollToOffset({
      offset: index * width * 0.9,
      animated: true,
    })
  }

  return (
    <View style={styles.container}>
      <BottomSheet
        // onChange={handleSheetChanges}
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}>
        <View style={styles.contentContainer}>
          <FlatList style={{}}
            keyboardShouldPersistTaps='handled'
            ref={listRef}
            data={[<OrderRide key={0} />, <ConfirmOrder key={1} />, <FulfilledOrder key={2} />, <VehicleLocation key={3} />, <ArrivedToUser key={4} />, <WithUser key={5} />, <ArrivedToDestination key={6} />]}
            keyExtractor={item => item.key}
            horizontal
            pagingEnabled={true}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return <View style={{ width: width * 0.9 + 1 }}>{item}</View>;
            }} />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '90%',
    height: '100%',
    marginLeft: '5%',
    flex: 1,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  sheetContainer: {
    // add horizontal space
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    alignItems: "center",
  },
});

export default ToUserBottomSheet;