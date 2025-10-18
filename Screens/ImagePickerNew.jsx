import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ImagePickerNew = () => {
    const [image, setImage] = useState(null)

    let imagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })
        console.log(result);
        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }

    }

    let takePhoto = async () =>{
        const { status } = await ImagePicker.requestCameraPermissionsAsync()

        if( status !== 'granted'){
            Alert.alert('Permission required', 'We need camera access to take photos');
            return;
        }
         let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4,3],
            quality: 1
         })
         console.log(result);
         if(!result.canceled){
            setImage(result.assets[0].uri)
         }
         
    }

    return (
        <View style={styles.container}>
            <Button title="Pick an image from camera roll" onPress={imagePick} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <TouchableOpacity onPress={imagePick}>
                <Text>Open gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto}>
                <Text>Take photo</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ImagePickerNew

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
})