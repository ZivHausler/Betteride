import { SafeAreaView, StyleSheet, Text, View, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'tailwind-react-native-classnames'
import * as Google from 'expo-google-app-auth'
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo, setUserInfo } from '../slices/userSlice';

const LoginScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (user) {
            dispatch(setUserInfo(user));
            setTimeout(() => navigation.navigate('Map'), 1000)
        }
    }, [user]);

    const handleGoogleSignin = () => {
        const config = {
            iosClientId: `826611003690-t8vsfq83kh3m7s7komjrcj9trb5nn0nr.apps.googleusercontent.com`,
            androidClientId: `826611003690-drnln24p7oc78s2s7dk1me9a84uasg0q.apps.googleusercontent.com`,
            scope: ['profile', 'email'],
        };

        Google.logInAsync(config)
            .then(result => {
                const { type, user } = result;
                if (type === 'success') {
                    AsyncStorage.setItem('Betteride', JSON.stringify(user))
                        .catch(error => console.log('error', error));
                    setUser(user);
                }
                else console.log('Google signin was canceled');
            })
            .catch(error => console.log('error', error));
    }

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
