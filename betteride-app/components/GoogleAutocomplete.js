import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import tw from 'tailwind-react-native-classnames'
import { GOOGLE_MAPS_APIKEY } from '@env'

const GoogleAutocomplete = ({ validateRoute, text,dataType }) => {

    return (
        <View style={tw`my-2`}>
            <Text style={styles.orderAction}>{text[0]}</Text>
            <GooglePlacesAutocomplete placeholder={text[1]} minLength={2} nearbyPlacesAPI='GooglePlacesSearch' debounce={400}
                styles={toInputBoxStyles} enablePoweredByContainer={false} query={{ key: GOOGLE_MAPS_APIKEY, language: 'en' }}
                returnKeyType={'search'} fetchDetails={true} onPress={(data, details = null) => {
                    validateRoute(dataType,{
                        location: details.geometry.location,
                        description: data.description,
                    })
                    // navigation.navigate('RideOptionsCard');
                }} />
        </View>
    )
}

export default GoogleAutocomplete

const toInputBoxStyles = StyleSheet.create({
    container: {
        width: '90%',
        flex: 0,
    },
    textInput: {
        marginLeft: -10,
        height: 25,
        fontSize: 16,
        backgroundColor: "transparent"
    },
    textInputContainer: {
        paddingBottom: 1,
    },
})

const styles = StyleSheet.create({
    orderAction: {
        fontSize: 12,
        color: 'gray',
    },
});
