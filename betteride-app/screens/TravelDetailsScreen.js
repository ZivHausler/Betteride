import { Animated, StyleSheet, Text, View, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import React, { useRef, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { detailsIcons } from '../assets/data/prevRides';
import * as Animatable from 'react-native-animatable'
import { SharedElement } from 'react-navigation-shared-element';
import tw from 'tailwind-react-native-classnames';
import { faker } from '@faker-js/faker';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const ITEM_HEIGHT = height * 0.18;
const SPACING = 10;
const TOP_HEADER_HEIGHT = height * 0.3;
const DURATION = 1000;

const TravelDetailsScreen = ({ navigation, route }) => {
    const { item, index, pickedColor } = route.params;

    const opacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 600,
            delay: 400,
            useNativeDriver: true,
        }).start();
    }, []);

    const getDateAndTime = (date) => {
        const newDate = date.split(' ').slice(1, 4).join('-');
        const newTime = date.split(' ').slice(4, 5).join(' ').split(':').slice(0, 2).join(':');
        return `${newDate}, ${newTime}`;
    }

    return (
        <View style={{ flex: 1 }}>
            <AntDesign name='left' size={28}
                style={{ padding: 12, position: 'absolute', top: SPACING * 4, left: SPACING, zIndex: 2 }}
                color={'#333'} onPress={() => navigation.goBack()} />

            <SharedElement id={`item.${index}.bg`}>
                <LinearGradient style={[StyleSheet.absoluteFillObject, { height: height / 2 }]}
                    start={[1, 1]} end={[0, 0]}
                    colors={pickedColor}
                />
            </SharedElement>

            <View style={[StyleSheet.absoluteFillObject, tw``]}>
                <View style={[{ height: TOP_HEADER_HEIGHT }, tw`flex-row mt-5`]}>
                    <View style={[{ width: '50%', }, tw`h-full items-center justify-center`]}>
                        <SharedElement id={`item.${index}.image`}>
                            <Image style={[{ width: 180, height: 162, resizeMode: 'contain' }, tw``]} source={{ uri: 'https://links.papareact.com/3pn' }} />
                        </SharedElement>
                        {item.canceled &&
                            <SharedElement id={`item.${index}.canceled`} style={[StyleSheet.absoluteFillObject,tw`z-20`]} >
                                <Image style={[tw`h-32 absolute w-32 left-1/2 top-1/2`, { transform: [{ translateX: -70 }, { translateY: -65 }], resizeMode: 'contain' }, tw``]} source={require('../assets/cancelledIcon.png')} />
                            </SharedElement>}
                    </View>
                    <Animated.View style={[{ width: '60%', opacity }, tw`justify-center`]}>
                        <View style={{ width: '75%', marginBottom: 4 }}>
                            <Text style={tw`font-bold`}>Date & Time:</Text>
                            <Text style={[tw`pl-3`]}>{getDateAndTime(item.date)}</Text>
                        </View>
                        <View style={{ width: '75%', marginBottom: 4 }}>
                            <Text style={tw`font-bold`}>Origin:</Text>
                            <Text style={[tw`pl-3`]}>{item.start_address}</Text>
                        </View>
                        <View style={{ width: '75%', marginBottom: 4 }}>
                            <Text style={tw`font-bold`}>Destination:</Text>
                            <Text style={[tw`pl-3`]}>{item.end_address}</Text>
                        </View>
                    </Animated.View>
                </View>
            </View>
            <SharedElement id={'general.bg'}>
                <View style={[, styles.bg]}>
                    <ScrollView>
                        <View style={tw`pt-5`} >
                            {item.fakerData.map((category, index) => {
                                return <Animatable.View key={category.key} animation={'fadeInUp'}
                                    delay={DURATION + index * 2 * 50}
                                    style={{ marginVertical: SPACING, paddingHorizontal: SPACING }}>
                                    <Text style={styles.title}>{category.title}</Text>
                                    {category?.info.map((subcat, index) => {
                                        return <View key={index}
                                            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING / 2, marginLeft: SPACING }}>
                                            <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: 'gold', marginRight: SPACING }} />
                                            <View style={tw`flex-row`}>
                                                <Text style={[styles.subTitle, tw`underline`]}>{subcat.title}</Text>
                                                <Text style={{ opacity: 0.7 }}>{subcat.text}</Text>
                                            </View>
                                        </View>
                                    })}
                                </Animatable.View>
                            })}
                            <Animatable.View style={tw`mt-10`} animation={'bounceIn'} delay={1900}>
                                <Text style={tw`text-center text-gray-500`}>Anything seems wrong? Tell us at any time!</Text>
                                <TouchableOpacity onPress={() => Linking.openURL('mailto:betteride_support@gmail.com?subject=I have a problem')}>
                                    <Text style={tw`text-center text-gray-500`}>email: betteride_support@gmail.com</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Linking.openURL('tel:' + fakePhoneNumber)}>
                                    <Text style={tw`text-center text-gray-500`}>phone: +972-545-76504</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>
                    </ScrollView>
                </View>
            </SharedElement>
        </View>
    );
};

export default TravelDetailsScreen;

const styles = StyleSheet.create({
    date: {
        fontWeight: '700',
        fontSize: 15,
        width: '100%',
        textAlign: 'left'
    },
    jobTitle: {
        fontSize: 14,
        opacity: 0.7,
    },
    image: {
        width: ITEM_HEIGHT * 0.8,
        height: ITEM_HEIGHT * 0.8,
        resizeMode: 'contain',
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,

    },
    bg: {
        position: 'absolute',
        width, height,
        backgroundColor: 'white',
        transform: [{ translateY: TOP_HEADER_HEIGHT }],
        borderRadius: 32,
        padding: SPACING,
        paddingTop: SPACING,
    },
    title: {
        fontWeight: '700',
        fontSize: 18,
        marginBottom: SPACING,
    },
    subTitle: {
        fontSize: 14,
        opacity: 0.9,
    },
});

TravelDetailsScreen.sharedElements = (route) => {
    const { item, index, pickedColor } = route.params;
    return [
        {
            id: `item.${index}.bg`,
        },
        {
            id: `item.${index}.canceled`,
        },
        {
            id: `item.${index}.image`,
        },
        {
            id: `general.bg`,
        },
    ]
}