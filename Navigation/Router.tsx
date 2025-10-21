import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../Src/HomeScreen';
import Register from '../Src/Register';
import Login from '../Src/Login';
import Dashboard from '../Src/Dashboard';
import BestSeller from '../Src/BestSeller';
import VendorPage from '../Src/VendorPage';

const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Dash"
          component={Dashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Best"
          component={BestSeller}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Vendor"
          component={VendorPage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;