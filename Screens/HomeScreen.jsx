import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import MapView, { Marker } from 'react-native-maps'
const HomeScreen = () => {

    const [location, setLocation] = useState(null)

    console.log(location);

    useEffect(() => {
        const geoLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            console.log(status, 'stata');

            if (status !== 'granted') {
                Alert.alert('permission was denied')
            }

            let location = await Location.getCurrentPositionAsync()
            // setLocation(location.coords.latitude + ' ' + location.coords.longitude)
            setLocation(location)
        }
        geoLocation()
    }, [])


    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={location ? {
                    longitude: location?.coords.longitude,
                    latitude: location?.coords.latitude,
                    latitudeDelta: 0.0900,
                    longitudeDelta: 0.0400
                } : {
                    longitude: 78.2090, //
                    latitude: 28.6139,
                    latitudeDelta: 0.0900,
                    longitudeDelta: 0.0400
                }

                }
                showsUserLocation={true}
                showsMyLocationButton={true}
            >{
                    location && (
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                            title='Your location '
                            description='you are here'
                        />
                    )
                }

            </MapView>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn}>
                    <Text>Choose from gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn2}>
                    <Text>Take photo</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        // paddingTop: '10%',
        marginTop: '10%',
        // paddingHorizontal: '4%',
        flex: 1,
        // backgroundColor: 'red'
    },
    map: {
        width: '100%',
        height:'100%',

    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 40,
        right: 60,
        left: 60
        
    },
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#C7C7CC',
        color: 'gray',
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        borderRightColor: '#8E8E93',
        borderRightWidth:1
    },
    btn2: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#C7C7CC',
        color: 'gray',
        borderTopEndRadius: 10,
        borderEndEndRadius:10
    }
})