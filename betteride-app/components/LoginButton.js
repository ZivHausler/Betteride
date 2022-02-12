import { Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import tw from 'tailwind-react-native-classnames';

const LoginButton = ({ color, text, url, onPress,isGoogleLoading  }) => {
    return (
        <TouchableOpacity onPress={onPress} style={tw`relative w-5/6 m-1 h-10 bg-${color[0]} flex-row items-center rounded-xl p-2 shadow-md`}>
            <View style={tw`w-10 absolute`}>
                <Image style={tw`w-8 h-8 left-1`} source={{ uri: url }} />
            </View>
            <View style={tw`flex-1 items-center `}>
                {!isGoogleLoading ?
                    <Text style={[tw`text-${color[1]}`,]}>{text}</Text>
                    :
                    <ActivityIndicator color={'gray'} style={tw``} />
                }
            </View>
        </TouchableOpacity>
    );
};

export default LoginButton;

const styles = StyleSheet.create({});
