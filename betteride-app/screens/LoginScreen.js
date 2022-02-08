import { SafeAreaView, StyleSheet, Text, View, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'tailwind-react-native-classnames'
import { useNavigation } from "@react-navigation/native";
import * as Google from 'expo-google-app-auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo, setUserInfo } from '../slices/userSlice';

const LoginScreen = () => {
   

    return (
        <SafeAreaView style={tw`flex-1 justify-between items-center`}>
            <Text style={{ fontSize: 45 }}>
                Login Screen
            </Text>
            <View>
                <Button onPress={handleGoogleSignin} title='Login with Google' />
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({});
