import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { selectTravelTimeInformation } from '../slices/navSlice'

const SURGE_CHANGE_RATE = 1.5;
const data = [
    {
        id: 'Uber-X-123',
        title: 'Uber X',
        multiplier: 0.7,
        image: 'https://links.papareact.com/3pn'
    },
    {
        id: 'Uber-XL-456',
        title: 'Uber XL',
        multiplier: 1,
        image: 'https://links.papareact.com/5w8'
    },
    {
        id: 'Uber-LUX-789',
        title: 'Uber LUX',
        multiplier: 1.4,
        image: 'https://links.papareact.com/7pf'
    },
]

const RideOptionsCard = () => {
    const navigation = useNavigation();
    const [selected, setSelected] = useState(null);
    const travelTimeInformation = useSelector(selectTravelTimeInformation);

    const milesToKM = (string) => {
        if(!string) return;
        return parseInt(string.split(' ')[0]) * 1.6;
    }


    return (
        <SafeAreaView style={tw`bg-white flex-grow h-full`}>
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('NavigateCard')}
                    style={[tw`absolute top-2 left-5 p-2 rounded-full`]}>
                    {/* <Icon name='chevron-left' type='fontawesome' /> */}
                </TouchableOpacity>
                <View style={tw`border-b border-gray-200 mb-1`}>
                    <Text style={tw`text-center py-1 pt-2 text-xl`}>Select a Ride</Text>
                    <Text style={tw`text-center pb-2`}>Distance: {milesToKM(travelTimeInformation?.distance?.text)} km, Time: {travelTimeInformation?.duration.text}</Text>
                </View>
            </View>

            <FlatList data={data} keyExtractor={item => item.id} renderItem={({ item: { id, title, multiplier, image }, item }) => (
                <TouchableOpacity style={tw`flex-row items-center justify-between px-10 mx-2 ${id === selected?.id && 'bg-gray-200 rounded-xl'}`} onPress={() => setSelected(item)}>
                    <Image style={[{ width: 90, height: 90, resizeMode: 'contain' }]} source={{ uri: image }} />
                    <View style={tw`-ml-6`}>
                        <Text style={tw`text-lg font-semibold`}>{title}</Text>
                    </View>
                    <Text style={tw`text-lg`}> {new Intl.NumberFormat('en-gb', {
                        style: 'currency',
                        currency: 'NIS',
                    }).format((travelTimeInformation?.duration.value * SURGE_CHANGE_RATE * multiplier) / 300 )}
                    </Text>

                </TouchableOpacity>
            )} />

            <View>
                <TouchableOpacity disabled={!selected} style={tw`bg-black py-2 m-1 mb-0 rounded-xl ${!selected && 'bg-gray-300'}`}>
                    <Text style={tw`text-center text-white text-lg`}>Choose {selected?.title}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default RideOptionsCard

const styles = StyleSheet.create({})