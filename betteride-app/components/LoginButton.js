import { Image,StyleSheet, Text, View ,TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'tailwind-react-native-classnames';

const LoginButton = ({color,text,url,onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={tw`relative w-5/6 h-10 bg-${color} flex-row items-center rounded-xl p-2 shadow-md`}>
            <View style={tw`w-10 absolute`}>
                <Image style={tw`w-8 h-8 left-1`} source={ {uri:url}} />
            </View>
            <View style={tw`flex-1 items-center `}>
                <Text style={{}}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default LoginButton;

const styles = StyleSheet.create({});
