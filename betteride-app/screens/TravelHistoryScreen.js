// import React, { useState, useRef, useEffect } from 'react'
// import { Animated, StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Easing } from 'react-native'
// import tw from 'tailwind-react-native-classnames'
// import { LinearGradient } from 'expo-linear-gradient';


// const data = [
//     {
//         id: 0,
//         from: 'Haifa, Israel',
//         to: 'Tel Aviv, Israel',
//         price: 45,
//         distance: 22,
//         duration: 13,
//         vehicleID: '184-225-262',
//     },
//     {
//         id: 1,
//         from: 'Eilat, Israel',
//         to: 'Qiryat Shmona, Israel',
//         price: 47,
//         distance: 22,
//         duration: 13,
//         vehicleID: '189-66-931',
//     },
//     {
//         id: 2,
//         from: 'Haifa, Israel',
//         to: 'Haifa, Israel',
//         price: 12,
//         distance: 22,
//         duration: 13,
//         vehicleID: '724-68-225',
//     },
//     {
//         id: 3,
//         from: "Ruppin Academic Center, Israel",
//         to: 'Ruppin Academic Center, Israel',
//         price: 45,
//         distance: 21,
//         duration: 32,
//         vehicleID: '162-37-333',
//     },
//     {
//         id: 4,
//         from: "Be'er Sheva, Israel",
//         to: 'Jerusalem, Israel',
//         price: 654,
//         distance: 22,
//         duration: 13,
//         vehicleID: '684-52-817',
//     },
// ]


// const TravelHistoryScreen = () => {

//     const [selected, setSelected] = useState([]);
//     const [lastSelected, setLastSelected] = useState(null);
//     const animationHeight = useRef(new Animated.Value(2)).current;

//     const toggleSelected = (item) => {
//         let tempArray = [...selected];
//         // if the object is already included, we want to remove it from the array
//         if (tempArray.includes(item.id)) {
//             tempArray.splice(tempArray.indexOf(item.id), 1);
//             setLastSelected(null);
//         }
//         // else, we want to add it to the array
//         else {
//             tempArray.push(item.id);
//             setLastSelected(item.id);
//         }
//         setSelected([...tempArray]);
//         // item.id === selected?.id ? setSelected(null) : setSelected(item)
//     }

//     useEffect(() => {
//         if (selected) {
//             animationHeight.setValue(125);
//             Animated.timing(animationHeight, {
//                 duration: 500,
//                 toValue: 220,
//                 easing: Easing.elastic(2),
//                 useNativeDriver: false,
//             }).start();
//         }
//         else {
//             Animated.timing(animationHeight, {
//                 duration: 400,
//                 toValue: 125,
//                 easing: Easing.elastic(2),
//                 useNativeDriver: false,
//             }).start();
//         }
//     }, [selected]);


//     return (
//         <View style={tw`bg-white h-full pb-6 rounded-xl`}>
//             <FlatList style={tw``} data={data} keyExtractor={(ride) => ride.id}
//                 renderItem={({ item: { id, from, to, price, distance, duration, vehicleID }, item }) => (
//                     <TouchableOpacity activeOpacity={0.2} onPress={(e) => toggleSelected(item)} style={tw`flex-row justify-between bg-white mx-4 my-2 items-center rounded-xl shadow-md`}>
//                         <Animated.View style={[tw`w-full overflow-hidden rounded-xl justify-center`, { height: selected.includes(id) ? lastSelected === id ? animationHeight : 220 : 125 }]} >
//                             <LinearGradient
//                                 start={[1, 1]} end={[0, 0]}
//                                 // Background Linear Gradient
//                                 colors={colors[id % colors.length]}
//                                 style={styles.background}
//                             />
//                             <View style={tw`flex-row w-full items-center px-4 py-2`}>
//                                 <Image style={[{ width: 80, height: 80, resizeMode: 'contain' }, tw``]} source={{ uri: 'https://links.papareact.com/3pn' }} />
//                                 <View style={tw`w-2/3`}>
//                                     <View style={tw`flex-row items-start my-0.5`}>
//                                         <Text style={tw`pr-1 font-bold text-right  w-1/4`}>From</Text>
//                                         <Text style={tw`pl-2  w-3/4`}>{from}</Text>
//                                     </View>
//                                     <View style={tw`flex-row items-start my-0.5`}>
//                                         <Text style={tw`pr-1 font-bold text-right  w-1/4`}>To</Text>
//                                         <Text style={tw`pl-2  w-3/4`}>{to}</Text>
//                                     </View>
//                                     <View style={tw`flex-row items-start my-0.5`}>
//                                         <Text style={tw`pr-1 font-bold text-right  w-1/4`}>Price</Text>
//                                         <Text style={tw`pl-2  w-3/4`}>{price} ₪</Text>
//                                     </View>
//                                 </View>
//                             </View>
//                             {selected.includes(id) &&
//                                 <View style={tw`flex-col`}>
//                                     <View style={[tw`bg-gray-300 rounded-full my-2`, { height: 0.8, width: '80%', marginLeft: '10%' }]} />
//                                     <View style={tw`flex-row justify-evenly items-center py-2`}>
//                                         <View style={tw` items-center justify-center`}>
//                                             <Text style={tw`font-bold`}>Duration</Text>
//                                             <Text style={tw``}>{duration}min</Text>
//                                         </View>
//                                         <View style={tw`items-center justify-center`}>
//                                             <Text style={tw`font-bold`}>Distance</Text>
//                                             <Text style={tw``}>{distance}km</Text>
//                                         </View>
//                                         <View style={tw`items-center justify-center`}>
//                                             <Text style={tw`font-bold`}>VehicleID</Text>
//                                             <Text style={tw``}>{vehicleID}</Text>
//                                         </View>
//                                     </View>
//                                 </View>
//                             }
//                         </Animated.View>
//                     </TouchableOpacity>
//                 )
//                 } />
//         </View >
//     )
// }

// export default TravelHistoryScreen

// const styles = StyleSheet.create({
//     background: {
//         position: 'absolute',
//         left: 0,
//         right: 0,
//         top: 0,
//         height: '100%',
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: 'black',
//     },
//     info: {
//         fontSize: 20,
//         color: 'black',
//     }
// });

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
