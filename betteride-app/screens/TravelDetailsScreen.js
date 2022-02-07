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
const fakePhoneNumber = faker.phone.phoneNumber().split(' ')[0];

const TravelDetailsScreen = ({ navigation, route }) => {
    const { item } = route.params;

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

            <SharedElement id={`item.${item.key}.bg`}>
                <LinearGradient style={[StyleSheet.absoluteFillObject, { height: height / 2 }]}
                    start={[1, 1]} end={[0, 0]}
                    colors={item.color}
                />
            </SharedElement>

            <View style={[StyleSheet.absoluteFillObject, tw``]}>
                <View style={[{ height: TOP_HEADER_HEIGHT }, tw`flex-row mt-5`]}>
                    {/* Vehicle's image */}
                    <View style={[{ width: '50%', }, tw`h-full items-center justify-center`]}>
                        <SharedElement id={`item.${item.key}.image`}>
                            <Image style={[{ width: 180, height: 162, resizeMode: 'contain' }, tw``]} source={{ uri: 'https://links.papareact.com/3pn' }} />
                        </SharedElement>
                    </View>
                    {/* Ride's flat information */}
                    <Animated.View style={[{ width: '60%', opacity }, tw`justify-center`]}>
                        <View style={{ width: '75%', marginBottom: 4 }}>
                            <Text style={tw`font-bold`}>Date & Time:</Text>
                            <Text style={[tw`pl-3`]}>{getDateAndTime(item.date)}</Text>
                        </View>
                        <View style={{ width: '75%', marginBottom: 4 }}>
                            <Text style={tw`font-bold`}>Origin:</Text>
                            <Text style={[tw`pl-3`]}>{item.from}</Text>
                        </View>
                        <View style={{ width: '75%', marginBottom: 4 }}>
                            <Text style={tw`font-bold`}>Destination:</Text>
                            <Text style={[tw`pl-3`]}>{item.to}</Text>
                        </View>
                    </Animated.View>
                </View>
            </View>
            <SharedElement id={'general.bg'}>
                <View style={styles.bg}>
                    <ScrollView>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: SPACING, marginBottom: SPACING + 5 }}>
                            {detailsIcons.map((detail, index) => {
                                // Three icons in the bottom sheet
                                return <Animatable.View animation={'bounceIn'} delay={DURATION - 200 + index * 50} key={`${detail.icon} -${index} `}
                                    style={{ backgroundColor: detail.color, height: 64, width: 64, borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                    <AntDesign name={detail.icon} size={22} color={'#333'} />
                                </Animatable.View>
                            })}
                        </View>
                        <View >
                            {item.categories.map((category, index) => {
                                // Render the details for each category
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
                            <Animatable.View style={tw`mt-4`} animation={'bounceIn'} delay={1900}>
                                <Text style={tw`text-center text-gray-500`}>Anything seems wrong? Tell us at any time!</Text>
                                <TouchableOpacity onPress={() => Linking.openURL('mailto:betteride_support@gmail.com?subject=I have a problem')}>
                                    <Text style={tw`text-center text-gray-500`}>email: betteride_support@gmail.com</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Linking.openURL('tel:' + fakePhoneNumber)}>
                                    <Text style={tw`text-center text-gray-500`}>phone: {fakePhoneNumber}</Text>
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
    const { item } = route.params;
    return [
        {
            id: `item.${item.key}.bg`,
        },
        // {
        //     id: `item.${item.key}.date`,
        // },
        // {
        //     id: `item.${item.key}.origin`,
        // },
        // {
        //     id: `item.${item.key}.destination`,
        // },
        {
            id: `item.${item.key}.image`,
        },
        {
            id: `general.bg`,
        },
    ]
}