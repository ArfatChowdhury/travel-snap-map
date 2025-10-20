import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { Entypo, Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [photoMarkers, setPhotoMarkers] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Request location + media permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      // Location permission
      let { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus !== 'granted') {
        Alert.alert('Permission was denied', 'Location permission is required to place markers.');
        return;
      }

      // Media library permission (gallery)
      let { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaStatus !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to pick images.');
        // don't return here — user can still use camera if granted later
      }

      // Optional: request camera permission so camera prompt is not delayed later
      await ImagePicker.requestCameraPermissionsAsync();

      // Get initial location after permissions
      let loc = await Location.getCurrentPositionAsync();
      setLocation(loc);
    };

    requestPermissions();
  }, []);

  // Debug photo markers
  useEffect(() => {
    console.log('📸 Photo Markers Count:', photoMarkers.length);
    console.log('📸 Photo Markers Data:', photoMarkers);
  }, [photoMarkers]);

  // Take photo with camera
  const handleTakePhoto = async () => {
    try {
      let { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera permission required');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // use enum
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0 && location) {
        const jitter = () => (Math.random() - 0.5) * 0.00015;
        const newPhotoMarker = {
          id: Date.now(),
          coordinate: {
            latitude: location.coords.latitude + jitter(),
            longitude: location.coords.longitude + jitter(),
          },
          imageUri: result.assets[0].uri,
          timestamp: new Date().toISOString(),
          zIndex: Date.now(),
        };
        setPhotoMarkers((prev) => [...prev, newPhotoMarker]);
        Alert.alert('Success', 'Photo marker added!');
      }
    } catch (error) {
      console.log('Camera error:', error);
    }
  };

  // Pick image from gallery
  const handlePickImage = async () => {
    try {
      let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to pick images.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // use enum
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0 && location) {
        const jitter = () => (Math.random() - 0.5) * 0.00015;
        const newPhotoMarker = {
          id: Date.now(),
          coordinate: {
            latitude: location.coords.latitude + jitter(),
            longitude: location.coords.longitude + jitter(),
          },
          imageUri: result.assets[0].uri,
          timestamp: new Date().toISOString(),
          zIndex: Date.now(),
        };
        setPhotoMarkers((prev) => [...prev, newPhotoMarker]);
        Alert.alert('Success', 'Photo marker added!');
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  // Handle marker press to show photo in modal
  const handleMarkerPress = (marker) => {
    console.log('📍 Marker pressed:', marker.id);
    setSelectedPhoto(marker);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.09,
                longitudeDelta: 0.04,
              }
            : {
                latitude: 28.6139,
                longitude: 78.209,
                latitudeDelta: 0.09,
                longitudeDelta: 0.04,
              }
        }
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* user location marker (explicit) */}
        {location && (
          <Marker
            key="user-location"
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            pinColor="blue"
          />
        )}

        {photoMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker)}
            zIndex={marker.zIndex}
          >
            <View style={styles.markerContainer}>
              <Entypo name="camera" size={16} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Photo Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📸 Your Photo</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {selectedPhoto && (
              <>
                <Image
                  source={{ uri: selectedPhoto.imageUri }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                <View style={styles.modalInfo}>
                  <Text style={styles.modalTimestamp}>
                    📅 Taken: {new Date(selectedPhoto.timestamp).toLocaleString()}
                  </Text>
                  <Text style={styles.modalCoordinates}>
                    📍 Latitude: {selectedPhoto.coordinate.latitude.toFixed(6)}
                  </Text>
                  <Text style={styles.modalCoordinates}>
                    📍 Longitude: {selectedPhoto.coordinate.longitude.toFixed(6)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Buttons Container */}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={handlePickImage}>
          <Ionicons name="image" size={22} color="black" />
          <Text style={styles.btnText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn2} onPress={handleTakePhoto}>
          <Entypo name="camera" size={22} color="black" />
          <Text style={styles.btnText}>Camera</Text>
        </TouchableOpacity>
      </View>

      {/* Debug Info */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          Markers: {photoMarkers.length} | Tap red camera icons
        </Text>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '10%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  btn: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  btn2: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Marker Styles
  markerContainer: {
    backgroundColor: '#FF3B30',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f8f8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: 300,
  },
  modalInfo: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  modalTimestamp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  modalCoordinates: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  // Debug Info
  debugContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});