import React from 'react'
import { StyleSheet, Text, View ,Image} from 'react-native'
import { Marker } from "react-native-maps";
const fetchedVehiclesArray = [
    {
        id: 0,
        icon: "https://i.ibb.co/Tkt0YK7/Black.png",
        location: {
            lat: 32.006030,
            lng: 34.817601
        }
    },
    {
        id: 1,
        icon: "https://i.ibb.co/kSx3LW6/Red.png",
        location: {
            lat: 32.340498,
            lng: 34.914016
        }
    },
    {
        id: 2,
        icon: "https://i.ibb.co/5WXtzSG/Box.png",
        location: {
            lat: 31.688372,
            lng: 34.583444
        }
    },
    {
        id: 3,
        icon: "https://i.ibb.co/VWTmv8P/Cyan.png",
        location: {
            lat: 31.733274,
            lng: 34.725836
        }
    },
]
const VehicleMarkers = () => {
    return (
        fetchedVehiclesArray.map(vehicle => <Marker
            key={vehicle.id}
            coordinate={{
                latitude: vehicle.location.lat,
                longitude: vehicle.location.lng,
            }}
        // icon={require('../assets/vehicleMapIcons/Blue.png')}
        // style={{ height: 100, width: 100 }}
        >
            <Image style={{height:35,width:35}} source={{uri:vehicle.icon}}/>
        </Marker>)

    )
}

export default VehicleMarkers

const styles = StyleSheet.create({})
