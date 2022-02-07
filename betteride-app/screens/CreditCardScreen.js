import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import tw from 'tailwind-react-native-classnames'
import { CreditCardInput } from "react-native-credit-card-input";

const CreditCardScreen = () => {


    const cardInputChange = (form) => {
        return;
    }

    return (
        <View style={tw`h-full w-full justify-center items-center pt-10 bg-white`}>
            <CreditCardInput cardFontFamily={'System'} onChange={cardInputChange} cardScale={1} />
        </View>
    )
}

export default CreditCardScreen

const styles = StyleSheet.create({})
