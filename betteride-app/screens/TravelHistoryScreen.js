import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, SafeAreaView, Animated } from 'react-native';
import React, { useRef, useEffect } from 'react';
import prevRides from '../assets/data/prevRides';
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import tw from 'tailwind-react-native-classnames';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const ITEM_HEIGHT = height * 0.18;
const SPACING = 10;

const TravelHistoryScreen = () => {
    const navigation = useNavigation();

    const getDateAndTime = (date) => {
        const newDate = date.split(' ').slice(1, 4).join('-');
        const newTime = date.split(' ').slice(4, 5).join(' ').split(':').slice(0, 2).join(':');
        return `${newDate}, ${newTime}`;
    }

    return (
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
            <FlatList
                contentContainerStyle={{ padding: SPACING }}
                data={prevRides}
                keyExtractor={item => item.key}
                renderItem={({ item, index }) => {
                    return <TouchableOpacity onPress={() => { navigation.navigate('Travel Details', { item }) }} style={{ marginBottom: SPACING, height: ITEM_HEIGHT }}>
                        <Animatable.View animation={'fadeInUp'}
                            delay={index * 2 * 65} style={[tw`w-full h-full flex-row items-center`, {}]}>
                            <SharedElement id={`item.${item.key}.bg`} style={StyleSheet.absoluteFillObject} >
                                <LinearGradient style={[StyleSheet.absoluteFillObject, { borderRadius: 16, padding: SPACING }]}
                                    start={[1, 1]} end={[0, 0]}
                                    colors={item.color}
                                />
                            </SharedElement>
                            <Animated.View style={{ padding: 12, width: '78%', }}>
                                <View style={{ width: '100%', marginBottom: 4 }}>
                                    <Text style={tw`font-bold`}>Date & Time:</Text>
                                    <Text style={[tw`pl-3`]}>{getDateAndTime(item.date)}</Text>
                                </View>
                                <View style={{ width: '100%', marginBottom: 4 }}>
                                    <Text style={tw`font-bold`}>Origin:</Text>
                                    <Text style={[tw`pl-3`]}>{item.from}</Text>
                                </View>
                                <View style={{ width: '100%', marginBottom: 4 }}>
                                    <Text style={tw`font-bold`}>Destination:</Text>
                                    <Text style={[tw`pl-3`]}>{item.to}</Text>
                                </View>
                            </Animated.View>
                            <SharedElement id={`item.${item.key}.image`} style={[{ width: '22%', justifyContent: 'center' }, styles.image]}>
                                <Image style={[{ width: 90, height: 60, resizeMode: 'contain' }, tw``]} source={{ uri: 'https://links.papareact.com/3pn' }} />
                            </SharedElement>
                        </Animatable.View>
                    </TouchableOpacity>
                }}
            />
            <SharedElement id={'general.bg'}>
                <View style={styles.bg} />
            </SharedElement>
        </SafeAreaView >
    );
};

export default TravelHistoryScreen;

const styles = StyleSheet.create({
    name: {
        fontWeight: '700',
        fontSize: 18,
        position: 'absolute',
    },
    jobTitle: {
        fontSize: 14,
        opacity: 0.7,
        marginTop: 18 * 1.3,
    },
    image: {
        width: ITEM_HEIGHT * 0.8,
        height: ITEM_HEIGHT * 0.8,
        resizeMode: 'cover',
    },
    bg: {
        position: 'absolute',
        width, height,
        transform: [{ translateY: height / 2 }],
        borderRadius: 32,
    }
});
