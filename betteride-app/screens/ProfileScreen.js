import { BlurView } from 'expo-blur'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { KeyboardAvoidingView, Platform } from "react-native";
// import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'tailwind-react-native-classnames'
import { CreditCardInput } from "react-native-credit-card-input";
import { useNavigation } from "@react-navigation/native";
import { useSelector,useDispatch } from 'react-redux';
import { selectUserInfo, setUserInfo } from '../slices/userSlice';
import {IP_ADDRESS} from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';


const ProfileScreen = () => {
    const userData = useSelector(selectUserInfo)
    const [firstName, setFirstName] = useState(userData.firstName);
    const [lastName, setLastName] = useState(userData.lastName);
    const [email, setEmail] = useState(userData.email);
    const [creditCard, setCreditCard] = useState({ number: '** ** ** 4011', expiry: '03 / 25', cvc: '062' });
    const navigation = useNavigation();
    const dispatch = useDispatch();



    // Object {
    //     "email": "danielezraa@gmail.com",
    //     "firstName": "Daniel",
    //     "id": "106239502123201988788",
    //     "lastName": "Ezra",
    //     "photoUrl": "https://lh3.googleusercontent.com/a/AATXAJzu50b4W0ztsJh6RwNnoMfSPN6J0fix2Mkb1yt8r2c=s96-c",
    //   }
    const data = [
        {
            id: 0,
            label: 'First Name',
            userField: 'firstName',
            keyboardType: 'default',
            value: firstName,
            setValue: setFirstName
        },
        {
            id: 1,
            label: 'Last Name',
            userField: 'lastName',
            keyboardType: 'default',
            value: lastName,
            setValue: setLastName
        },
        {
            id: 2,
            label: 'Email',
            userField: 'email',
            keyboardType: 'email-address',
            value: email,
            setValue: setEmail
        },
        {
            id: 3,
            label: 'Credit Card',
            userField: 'creditCard',
            keyboardType: 'numeric',
            value: creditCard,
            setValue: setCreditCard
        }

    ]
    const updateUserInfo = async () => {
        const tempUser = {
            id: userData.id,
            firstName,
            lastName,
        }
        await fetch(`https://betteride-firebase-server-3mmcqmln7a-ew.a.run.app/updateUserInfo`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({tempUser})
        })
        storeAndDispatchUserData({
            id: userData.id,
            firstName,
            lastName,
            email:userData.email,
            photoUrl:userData.photoUrl,
        })
        console.log("f")
        alert("Profile has been updated!")
    }
    const cardInputChange = (form) => {
        return false;
    };
    const storeAndDispatchUserData = (user) => {
        dispatch(setUserInfo(user));
        AsyncStorage.setItem('Users', JSON.stringify({ user }))
            .catch(error => console.log('error', error));
    }

    // // will print:
    // {
    //   valid: true, // will be true once all fields are "valid" (time to enable the submit button)
    //   values: { // will be in the sanitized and formatted form
    //   	number: "4242 4242",
    //   	expiry: "06/19",
    //   	cvc: "300",
    //   	type: "visa", // will be one of [null, "visa", "master-card", "american-express", "diners-club", "discover", "jcb", "unionpay", "maestro"]
    //   	name: "Sam",
    //   	postalCode: "34567",
    //   },
    //   status: {  // will be one of ["incomplete", "invalid", and "valid"]
    //     number: "incomplete",
    //     expiry: "incomplete",
    //     cvc: "incomplete",
    //     name: "incomplete", 
    //     postalCode: "incomplete",
    //   },
    // };

    return (
        <View style={tw`bg-white h-full w-full pt-2 pb-10`}>
            <TouchableOpacity style={tw`items-center`}>
                <View style={tw`shadow w-40 h-40`}>
                    <Image style={[tw`h-40 w-40 rounded-full shadow-xl`]} source={{ uri: userData.photoUrl }} />
                </View>
            </TouchableOpacity>
            <FlatList style={tw`flex mt-4 h-2/3 `} data={data} keyExtractor={(item) => item.id}
                renderItem={({ item: { value, setValue, label, keyboardType, userField } }) => (
                    userField === 'creditCard' ?
                        <TouchableOpacity onPress={() => navigation.navigate('Credit Card')} style={tw`px-5 py-3 h-48 overflow-hidden`}>
                            <Text style={tw`pl-1 pb-1 font-bold`}>{label}</Text>
                            <CreditCardInput cardFontFamily={'System'} onChange={cardInputChange} cardScale={0.8} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={tw`flex-row items-center px-5 py-3`}>
                            <View style={tw`w-full`}>
                                <Text style={tw`pl-1 pb-1 font-bold`}>{label}</Text>
                                <TextInput
                                    style={tw`bg-gray-100 p-2 w-full rounded-lg shadow`}
                                    onChangeText={setValue}
                                    placeholder={userField === "creditCard" ? '*-*-**-' + value.substr(value.length - 4) : value}
                                    keyboardType={keyboardType}
                                    value={value}
                                />
                            </View>
                        </TouchableOpacity>
                )} />

            <TouchableOpacity onPress={() => updateUserInfo()} style={tw`items-center justify-center pt-2 overflow-hidden`}>
                <Text style={tw`bg-blue-200 rounded-full py-2 px-4`}>Apply Changes</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({})