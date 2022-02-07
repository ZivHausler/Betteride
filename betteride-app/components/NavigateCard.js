import React from 'react'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import tw from 'tailwind-react-native-classnames'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAPS_APIKEY } from '@env'
import { useDispatch } from 'react-redux'
import { setDestination } from '../slices/navSlice'
import { useNavigation } from '@react-navigation/native'
import NavFavourites from './NavFavourites'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from 'react-native-elements';


const NavigateCard = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    return (
        <SafeAreaView style={tw`bg-white z-10`}>
            {/* <Text style={tw`text-center py-5 text-xl font-semibold`}>Good Morning, Ziv!</Text> */}
            <View style={tw`border-t border-gray-200 flex-shrink`}>
                <View>
                    <GooglePlacesAutocomplete placeholder='Where to?' nearbyPlacesAPI='GooglePlacesSearch' debounce={400}
                        styles={toInputBoxStyles} enablePoweredByContainer={false} query={{ key: GOOGLE_MAPS_APIKEY, language: 'en', }}
                        returnKeyType={'search'} fetchDetails={true} onPress={(data, details = null) => {
                            dispatch(
                                setDestination({
                                    location: details.geometry.location,
                                    description: data.description,
                                }));
                            // navigation.navigate('RideOptionsCard');
                        }} />
                </View>
                <NavFavourites />
            </View>
            {/* <View style={tw`flex-row justify-evenly pt-3 pb-6 mt-auto border-t border-gray-100`}>
                <TouchableOpacity onPress={()=> navigation.navigate('RideOptionsCard')} style={tw`flex flex-row justify-between bg-black w-24 px-4 py-3 rounded-full`}>
                    <Icon name="car" type="font-awesome" color="white" size={16}/>
                    <Text style={tw`text-white text-center`}>Rides</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> navigation.navigate('RideOptionsCard')} style={tw`flex flex-row justify-between bg-black w-24 px-4 py-3 rounded-full`}>
                    <Icon name="fast-food" type="ionicon" color="white" size={16}/>
                    <Text style={tw`text-white text-center`}>Food</Text>
                </TouchableOpacity>
            </View> */}
        </SafeAreaView>
    )
}

export default NavigateCard

const toInputBoxStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: 20,
        flex: 0,
    },
    textInput: {
        backgroundColor: '#DDDDDF',
        borderRadius: 10,
        fontSize: 18,
    },
    textInputContainer: {
        paddingHorizontal: 20,
        paddingBottom: 0,
    },
})
