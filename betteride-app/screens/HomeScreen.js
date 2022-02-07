import React from "react";
import { StyleSheet, SafeAreaView, StatusBar, View, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import NavFavourites from "../components/NavFavourites";

const HomeScreen = () => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={[styles.safeAreaView, tw`h-full bg-white`]}>
      <View style={tw`p-5`}>
        <Image
          style={{ width: 100, height: 100, resizeMode: "contain" }}
          source={{ uri: "https://links.papareact.com/gzs" }}
        />

        <GooglePlacesAutocomplete
          placeholder="Where from?"
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          minLength={2}
          enablePoweredByContainer={false}
          styles={{ container: { flex: 0 }, textInput: { fontSize: 18 } }}
          query={{ key: GOOGLE_MAPS_APIKEY, language: "en" }}
          fetchDetails={true}
          returnKeyType={"search"}
          onPress={(data, details = null) => {
            dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              })
            );
            dispatch(setDestination(null));
          }}
        />
        <NavOptions />
        <NavFavourites/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    paddingTop: StatusBar.currentHeight,
  },
});

export default HomeScreen;
