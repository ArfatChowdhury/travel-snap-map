import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import MapView, { Callout, Marker } from 'react-native-maps'
import * as ImagePicker from 'expo-image-picker';
import { Entypo, Ionicons } from '@expo/vector-icons';


const HomeScreen = () => {

    const [location, setLocation] = useState(null)
    const [image, setImages] = useState(null)
    const [photoMarkers, setPhotoMarkers] = useState([])



    useEffect(() => {
        console.log(photoMarkers, 'hhhh');

    }, [photoMarkers])
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

    const handleTakePhoto = async () => {
        console.log('take photo func start');

        try {
            let { status } = await ImagePicker.requestCameraPermissionsAsync()
            console.log(status)
            console.log('btn pressed');

            if (status !== 'granted') {
                Alert.alert('permission required ')
                return;
            }
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                // allowsEditing: true,
                quality: 1
            })

            if (!result.canceled) {
                setImages(result.assets[0].uri)
                const newPhotoMarker = {
                    id: Date.now(),
                    coordinate: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    },
                    imageUri: result.assets[0].uri,
                    timestamp: new Date().toISOString()
                };

                setPhotoMarkers(prevMarkers => [...prevMarkers, newPhotoMarker]);
            }



        } catch (error) {
            console.log(error);
        }
    }

    const handlePickImage = async () => {

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImages(result.assets[0].uri);

                const newPhotoMarker = {
                    id: Date.now(),
                    coordinate: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    },
                    imageUri: result.assets[0].uri,
                    timestamp: new Date().toISOString()
                };

                setPhotoMarkers(prevMarkers => [...prevMarkers, newPhotoMarker]);
            }
        } catch (error) {
            console.log('Error picking image:', error);
        }
    }

    console.log(photoMarkers);

    // console.log('image location', photoMarkers);


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
            >
                {/* {
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
                } */}
                {/* {photoMarkers.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={marker.coordinate}
                        title="Photo Location"
                        description="Tap to view photo"
                        onPress={() => console.log('📌 Marker pressed:', marker.id)}
                    >
                    
                    </Marker>
                ))} */}
                {photoMarkers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={marker.coordinate}
                        tracksViewChanges={false}
                        onPress={() => console.log("📍 Marker pressed", marker.id)}
                    >
                        {/* Wrap callout content in an outer View + add minWidth */}
                        <Callout tooltip>
                            <View
                                style={{
                                    backgroundColor: "transparent",
                                    alignItems: "center",
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: "white",
                                        borderRadius: 12,
                                        padding: 8,
                                        width: 230,
                                        alignItems: "center",
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 3 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 5,
                                        elevation: 5,
                                    }}
                                >
                                    <Image
                                        source={{ uri: marker.imageUri }}
                                        style={{
                                            width: 210,
                                            height: 160,
                                            borderRadius: 8,
                                            resizeMode: "cover",
                                        }}
                                    />
                                    <Text
                                        style={{
                                            marginTop: 6,
                                            fontSize: 12,
                                            color: "#333",
                                            textAlign: "center",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {new Date(marker.timestamp).toLocaleString()}
                                    </Text>
                                </View>

                                {/* little tooltip triangle */}
                                <View
                                    style={{
                                        width: 0,
                                        height: 0,
                                        borderLeftWidth: 10,
                                        borderRightWidth: 10,
                                        borderTopWidth: 12,
                                        borderLeftColor: "transparent",
                                        borderRightColor: "transparent",
                                        borderTopColor: "white",
                                        marginTop: -1,
                                    }}
                                />
                            </View>
                        </Callout>
                    </Marker>
                ))}




            </MapView>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn} onPress={handlePickImage}>
                    <Ionicons name='camera' size={24} color='black' />
                    <Text>Choose from gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn2} onPress={handleTakePhoto}>
                    <Entypo name='image' size={24} color='black' />
                    <Text>Take photo</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        marginTop: '10%',
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    btnContainer: {
        pointerEvents: 'box-none',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 50,
        right: 20,
        left: 20,
    },

    btn: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderRightColor: '#8E8E93',
        borderRightWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    btn2: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#ffffff',
        borderTopEndRadius: 10,
        borderEndEndRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: "row",
        gap: 10,
        alignItems: 'center'
    },
    // Add button text styles
    btnText: {
        color: '#8E8E93',
        fontWeight: '500',
    },
    popupContainer: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        maxWidth: 220,
    },
    popupImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    timestamp: {
        marginTop: 8,
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    callout: {
        borderRadius: 10,
    },
    calloutContainer: {
        width: 200,
        padding: 8,
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: "#ddd",
        borderWidth: 1,
    },
    calloutImage: {
        width: 180,
        height: 120,
        borderRadius: 8,
    },
    calloutText: {
        marginTop: 5,
        fontSize: 12,
        color: "#333",
        textAlign: "center",
    },

});