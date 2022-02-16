import React, { useRef, useEffect } from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import tw from 'tailwind-react-native-classnames'
import { GOOGLE_MAPS_APIKEY } from '@env'
import { abs } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { selectClearGoogleInputs, setClearGoogleInputs } from '../slices/navSlice'

const GoogleAutocomplete = ({ validateRoute, text, dataType }) => {
    const ref = useRef();
    const clearGoogleInputs = useSelector(selectClearGoogleInputs);
    const dispatch = useDispatch();

    useEffect(() => {
        if (clearGoogleInputs)
        {
            ref.current?.clear();
            dispatch(setClearGoogleInputs(false));
        }
    }, [clearGoogleInputs]);
    
    return (
        <View style={tw`my-2`}>
            <Text style={styles.orderAction}>{text[0]}</Text>
            <GooglePlacesAutocomplete ref={ref} placeholder={text[1]} minLength={2} nearbyPlacesAPI='GooglePlacesSearch' debounce={400}
                styles={toInputBoxStyles} enablePoweredByContainer={false} query={{ key: GOOGLE_MAPS_APIKEY, language: 'en', components: 'country:il' }}
                returnKeyType={'search'} fetchDetails={true} onPress={(data, details = null) => {
                    validateRoute(dataType, {
                        location: details.geometry.location,
                        description: data.description,
                    })
                }} />
        </View>
    )
}


export default GoogleAutocomplete

const toInputBoxStyles = StyleSheet.create({
    container: {
        width: '90%',
        maxHeight: 118,
        backgroundColor: 'transparent',
        overflow: 'hidden',
        flex: 0,
        paddingRight: 20,

    },
    poweredContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderColor: '#c8c7cc',
        borderTopWidth: 0.5,

    },
    powered: {

    },
    listView: {
        borderRadius: 10,

    },
    row: {
        padding: 10,
        height: 44,
        flexDirection: 'row',
        backgroundColor: '#d3d6d5',
    },
    separator: {
        height: 0.5,
        backgroundColor: '#c8c7cc',
    },
    description: {
        color: 'black',
        opacity: 0.8,
        paddingRight: 30,
    },
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
    textInput: {
        marginLeft: -10,
        height: 25,
        fontSize: 16,
        backgroundColor: "transparent",


    },
    textInputContainer: {
        backgroundColor: 'transparent',
        paddingBottom: 1,

    },
})

const styles = StyleSheet.create({
    orderAction: {
        fontSize: 12,
        color: '#474c48',
    },
});