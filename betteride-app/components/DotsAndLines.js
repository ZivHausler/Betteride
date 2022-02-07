import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const DotsAndLines = ({ amountOfLines }) => {

    const renderThem = () => {
        let list = [];
        for (let index = 0; index < amountOfLines; index++) {
            list.push(<View key={index} style={tw`h-1 w-0.5 bg-gray-900 opacity-60 rounded-full`}></View>
            )
        }
        return list;
    }

    return (
        <View style={tw`w-1/6 flex items-center pl-4 pt-2.5`}>
            <View style={tw`h-2.5 w-2.5 bg-blue-400 rounded-full`}></View>
            {renderThem()}
            <View style={tw`h-2.5 w-2.5 bg-green-700 opacity-60 rounded-full`}></View>
        </View>
    )
}

export default DotsAndLines

const styles = StyleSheet.create({})
