import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import tw from 'tailwind-react-native-classnames';

import OrderRide from "../tabs/OrderRide";
import ConfirmOrder from "../tabs/ConfirmOrder";
import FulfilledOrder from "../tabs/FulfilledOrder";
import ArrivedToUser from "../tabs/ArrivedToUser";
import ArrivedToDestination from "../tabs/ArrivedToDestination";

const ToUserBottomSheet = ({ cardShown }) => {

  // ref
  const bottomSheetRef = useRef(null);
  const listRef = useRef();
  const width = Dimensions.get('window').width;
  // variables
  const snapPoints = useMemo(() => [150, 400], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const scrolltoActiveCardShown = () => {
    listRef?.current?.scrollToOffset({
      offset: cardShown * width * 0.88,
      animated: true,
    })
  }

  useEffect(() => {
    scrolltoActiveCardShown();
  }, [cardShown])

  // render
  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <View style={styles.contentContainer}>
          <Text style={[tw`font-bold text-lg`]}>Vehicle's current ocation</Text>
          <FlatList style={{ width: '100%' }}
            ref={listRef}
            data={[<OrderRide key={0}/>, <ConfirmOrder key={1}/>, <FulfilledOrder key={2}/>, <ArrivedToUser key={3}/>, <ArrivedToDestination key={4}/>]}
            keyExtractor={item => item.key}
            horizontal
            pagingEnabled={true}
            // scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return <View style={{width: width*0.88}}>{item}</View>;
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
    width: '88%',
    height: '100%',
    marginLeft: '6%',
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
    flex: 1,
    alignItems: "center",
    paddingVertical: 5,
  },
});

export default ToUserBottomSheet;