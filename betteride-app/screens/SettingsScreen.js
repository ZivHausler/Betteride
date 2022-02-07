import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Switch } from 'react-native'
import tw from 'tailwind-react-native-classnames'
import { useNavigation } from '@react-navigation/native'
import { Icon } from 'react-native-elements';

const tabs = [
    {
        name: 'Notifications',
        screen: 'Notifications'
    },
    {
        name: 'NUDES',
        screen: 'Notifications'
    },
    {
        name: 'isSea?',
        screen: 'Notifications'
    }
]

const data =
    [
        {
            section: 'General',
            features: [
                {
                    name: 'Show notifications',
                    value: false
                }
            ]
        },
        {
            section: 'Alerts',
            features: [
                {
                    name: 'Show on Lock Screen',
                    value: true
                },
                {
                    name: 'Show in History',
                    value: false
                },
                {
                    name: 'Show as Banners',
                    value: true
                },
            ]
        },
        {
            section: 'More',
            features: [
                {
                    name: 'Vibration',
                    value: true
                },
                {
                    name: 'Notification light',
                    value: true
                },
            ]
        }
    ]

const SettingsScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={tw`bg-gray-100 h-full w-full`}>
            <FlatList style={tw``} data={data} keyExtractor={(item) => item.section}
                renderItem={({ item: { section, features } }) => (
                    <View style={tw`mb-6 mt-4`}>
                        <Text style={tw`pl-4 text-lg text-gray-500`}>{section}</Text>
                        <View style={tw`rounded-xl overflow-hidden mx-3`}>
                            <FlatList style={tw``} data={features} keyExtractor={(item) => item.name} ItemSeparatorComponent={() =>
                                <View style={[tw`rounded-full bg-gray-100 self-center`, { height: 1, width: '100%' }]} />}
                                renderItem={({ item: { name, value } }) => (
                                    <View style={tw`bg-white flex-row justify-between px-4 h-11 items-center`}>
                                        <Text style={tw``}>{name}</Text>
                                        <Switch
                                            trackColor={{ false: "#EFEFF4", true: "#74D671" }}
                                            thumbColor={'white'}
                                            ios_backgroundColor="#EFEFF4"
                                            value={value}
                                        />
                                    </View>
                                )} />
                        </View>

                    </View>
                )} />
        </View>
    )
}

export default SettingsScreen
const styles = StyleSheet.create({})
