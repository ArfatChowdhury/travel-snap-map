import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeScreen from '../Screens/HomeScreen';


const Stack = createStackNavigator();
const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
      
    </Stack.Navigator>
  )
}

export default AppNavigator

const styles = StyleSheet.create({})






