import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useSelector } from 'react-redux';
import { selectUserInfo, setUserInfo } from '../slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const intensity = 10;

const features = [
    {
        id: 1,
        name: 'Travel History',
        icon: 'history',
        link: 'Travel History'
    },
    {
        id: 2,
        name: 'Settings',
        icon: 'settings',
        link: 'Settings'
    },
    {
        id: 3,
        name: 'Log out',
        icon: 'logout',
        link: 'Logout'
    },
]
const link = 'Profile Screen'

const MenuBar = ({ openCloseMenuBar }) => {
    const navigation = useNavigation();
    const user = useSelector(selectUserInfo);
    
    const redirectHandler = (link) => {
        if (link === 'Logout') {
            AsyncStorage.removeItem('Users')
                .then(res => navigation.navigate('Loading',true))
                .catch(error => console.log(`Couldn't remove user`));
        }
        else navigation.navigate(link)
    }

    return (
        <View style={tw`w-full h-full z-0 flex-row`}>
            <BlurView intensity={60} tint='light' style={tw`w-full h-full shadow-2xl `}>
                <SafeAreaView>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => redirectHandler('Profile Screen')} style={tw`flex justify-center items-center h-1/3 mt-4`}>
                        <View style={[tw`h-40 w-40 rounded-full`, styles.profilePicture]}>
                            <Image style={tw`h-40 w-40 rounded-full`} source={{ uri: user?.photoUrl }} />
                        </View>
                        <Text style={tw`font-bold text-lg mt-2`}>{user?.givenName} {user?.familyName}</Text>
                        <Text style={tw`text-gray-600 mb-5`}>{user?.email}</Text>
                        <View style={[tw`bg-gray-300 rounded-full`, { height: 0.8, width: '80%' }]} />
                    </TouchableOpacity>
                    <FlatList style={tw`flex h-2/3 pl-2`} data={features} keyExtractor={(item) => item.id}
                        renderItem={({ item: { name, icon, link } }) => (
                            <TouchableOpacity onPress={() => redirectHandler(link)} style={tw`flex-row items-center p-5 shadow-xl`}>
                                <Icon
                                    style={[tw`mr-4 rounded-2xl p-3`, { backgroundColor: '#79aee2' }]} name={icon} type="material" color='black' size={25}/>
                                <View>
                                    <Text style={tw`font-bold text-lg`}>{name}</Text>
                                </View>
                            </TouchableOpacity>
                        )} />
                </SafeAreaView>
            </BlurView>
            {/* <BlurView intensity={10} tint={'light'} style={tw`w-1/3 h-full`}>
                <TouchableOpacity style={tw`h-full w-full`} onPress={openCloseMenuBar}>
                </TouchableOpacity>
            </BlurView> */}
        </View>
    )
}

export default MenuBar

const styles = StyleSheet.create({
    menuIcon: {
        backgroundColor: "#79aee2"
    },
    profilePicture: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.7,
        shadowRadius: 5.00,
    }
})
