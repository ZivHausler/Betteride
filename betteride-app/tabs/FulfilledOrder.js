import React, { useEffect, useState } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { Platform } from 'react-native'
import { selectVehicleETA, selectVehicleKMLeft, selectVehicleLocation, selectVehicleTimeLeft, setVehicleLocation } from '../slices/vehicleSlice'
import { selectTabShown, selectUserAssignedVehicle, setDestination, setOrigin, setRouteShown, setTabShown, setUserAssignedVehicle } from '../slices/navSlice'
import { IP_ADDRESS } from "@env";
import { selectUserInfo, } from '../slices/userSlice'


const FulfilledOrder = () => {
    const vehicleLocation = useSelector(selectVehicleLocation);
    const [modalVisible, setModalVisible] = useState(false);
    const userData = useSelector(selectUserInfo);
    const userAssignedVehicle = useSelector(selectUserAssignedVehicle);
    const dispatch = useDispatch();
    const vehicleEta = useSelector(selectVehicleETA);
    const vehicleKMLeft = useSelector(selectVehicleKMLeft);
    const vehicleTimeLeft = useSelector(selectVehicleTimeLeft);
    const [isLoading, setIsLoading] = useState(false);
    const tabShown = useSelector(selectTabShown);


    const cancelTrip = async () => {
        setIsLoading(true);
        setModalVisible(false);
        let response = await fetch(`https://betteride-firebase-server-3mmcqmln7a-ew.a.run.app/finishTrip?userID=${userData.id}&plateNumber=${userAssignedVehicle}&canceled=${true}`, {
            method: "PUT",
        })
        //reset all fields
        dispatch(setOrigin(null));
        dispatch(setDestination(null));
        dispatch(setRouteShown('userToDestination'));
        dispatch(setUserAssignedVehicle(null));
        dispatch(setVehicleLocation(null));
        setIsLoading(false);
        dispatch(setTabShown('order'));
    }

    return (
        <Animated.View style={[tw`bg-white items-center justify-between`, { width: '100%', height: '92%' }]}>
            {tabShown === 'fulfilled' && <View style={styles.centeredView}>
                <Modal animationType="slide" transparent={true} visible={modalVisible} >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={[tw`font-bold text-lg`, styles.modalText]}>Are you sure?</Text>
                            <Text style={[tw``, styles.modalText]}>Be aware you will be charged for half the fare</Text>
                            <View style={tw`flex-row`}>
                                <TouchableOpacity
                                    style={[tw`bg-red-400 flex-1 p-2 m-2 rounded-xl shadow-sm`]}
                                    onPress={() => cancelTrip()}>
                                    <Text style={styles.textStyle}>Cancel Trip</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[tw`bg-green-400 flex-1 p-2 m-2 rounded-xl shadow-sm`,]}
                                    onPress={() => setModalVisible(false)}>
                                    <Text style={styles.textStyle}>Continue Trip</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>}
            <Text style={[{ height: 35 }, tw` text-3xl font-bold`]}>Order fulfilled</Text>
            <View style={[tw` h-2/3 justify-around`]}>
                <Text style={[tw`text-blue-400 font-bold mb-1 text-center`, { fontSize: 16 }]}>Your order has been successfully registered</Text>
                <View style={tw`items-center`}>
                    <Text style={tw`text-gray-600 mb-0.5 `}>
                        Vehicle current location
                    </Text>
                    <Text style={[tw`text-center text-gray-900 font-semibold`, { fontSize: 18 }]}>
                        {vehicleLocation?.address}
                    </Text>
                </View>
                <View style={tw`flex-row items-center my-0.5 justify-around`}>
                    <View style={tw`items-center  flex-1 justify-between`}>
                        <Text style={tw`text-gray-600 mb-0.5`}>
                            Time left
                        </Text>
                        <Text style={[tw`text-center text-gray-900 font-semibold`, { fontSize: 16 }]}>
                            {vehicleTimeLeft ? (vehicleTimeLeft / 60).toFixed(0) + ' min' : 'calculating'}
                        </Text>
                    </View>
                    <View style={tw`flex-col flex-1 items-center my-0.5 `}>
                        <Text style={tw`text-gray-600 mb-0.5`}>ETA</Text>
                        <Text style={[tw`text-center text-gray-900 font-semibold`, { fontSize: 22 }]}>{vehicleEta ? vehicleEta.split(' ')[1].split(':').slice(0, 2).join(':') : 'calculating'}</Text>
                    </View>
                    <View style={tw`items-center flex-1 justify-between`}>
                        <Text style={tw`text-gray-600 mb-0.5`}>
                            KM left
                        </Text>
                        <Text style={[tw`text-center text-gray-900 font-semibold`, { fontSize: 16 }]}>
                            {vehicleKMLeft ? (vehicleKMLeft / 1000).toFixed(2) : 'calculating'}
                        </Text>
                    </View>
                </View>
            </View>
            {!isLoading ?
                <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7} style={tw`p-3 bg-gray-800  rounded-xl shadow-sm`}>
                    <Text style={tw`text-white font-bold`}>CANCEL TRIP</Text>
                </TouchableOpacity>
                :
                <View style={tw`p-3 bg-gray-800  rounded-xl shadow-sm`}>
                    <ActivityIndicator color={'white'} style={tw``} />
                </View>}
        </Animated.View >
    )
}

export default FulfilledOrder

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -150 }],
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "#C7CAC8",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    orderContainer: {
        position: 'absolute',
        bottom: Platform.OS === "ios" ? 30 : 20,
        left: 0,
        padding: 10,
        borderRadius: 20,
        width: '95%',
        marginLeft: '2.5%',
        backgroundColor: 'white',
    },
    appButtonContainer: {
        backgroundColor: "#79aee2",
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 12,
        marginHorizontal: Platform.OS === "ios" ? 10 : 0,
        marginBottom: Platform.OS === "ios" ? 5 : 0,
        marginTop: 25,
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
    },
    testImage: {
        resizeMode: 'cover',
        height: 120,
    }
});