import React, { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const ToUserBottomSheet = () => {
  // hooks
  const sheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["15%", "30%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // render
  return (
    <View style={styles.container}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <BottomSheetView>
          <Text>Awesome 🔥</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    height: '100%',
    width: '100%',
    flex: 1,
    paddingTop: 200,
  },
});

export default ToUserBottomSheet;