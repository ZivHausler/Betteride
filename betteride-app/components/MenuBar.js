import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React, { useRef, useState } from 'react'
import { Animated, StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native'
import { Icon } from 'react-native-elements'
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames'

const features = [
    {
        id: 0,
        name: 'Profile Info',
        icon: 'person',
        link: 'Profile Screen'
    },
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

    const navigation = useNavigation()

    return (
        <View style={tw`w-full h-full z-0 flex-row`}>
            <BlurView intensity={100} tint='light' style={tw`w-2/3 h-full shadow-2xl `}>
                <SafeAreaView>
                    <View style={tw`flex justify-center items-center h-1/3 mt-4`}>
                        <View style={[tw`h-40 w-40 rounded-full`, styles.profilePicture]}>
                            <Image style={tw`h-40 w-40 rounded-full`} source={{ uri: 'https://i.imgur.com/bKApbFk.png' }} />
                        </View>
                        <Text style={tw`font-bold text-lg mt-2`}>Tamir Ganem</Text>
                        <Text style={tw`text-gray-600 mb-5`}>tamirg@gmail.com</Text>
                        <View style={[tw`bg-gray-300 rounded-full`, { height: 0.8, width: '80%' }]} />
                    </View>
                    <FlatList style={tw`flex h-2/3 pl-2`} data={features} keyExtractor={(item) => item.id}
                        renderItem={({ item: { name, icon, link } }) => (
                            <TouchableOpacity onPress={() => navigation.navigate(link)} style={tw`flex-row items-center p-5`}>
                                <Icon
                                    style={[tw`mr-4 rounded-2xl p-3`, { backgroundColor: '#79aee2' }]} name={icon} type="material" color='black' size={25}
                                />
                                <View>
                                    <Text style={tw`font-bold text-lg`}>{name}</Text>
                                </View>
                            </TouchableOpacity>
                        )} />
                </SafeAreaView>
            </BlurView>
            <BlurView intensity={10} tint={'light'} style={tw`w-1/3 h-full`}>
                <TouchableOpacity style={tw`h-full w-full`} onPress={openCloseMenuBar}>
                </TouchableOpacity>
            </BlurView>
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