import React, { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns'; 
import { ActivityIndicator, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { TailwindProvider } from 'tailwind-rn';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import utilities from './tailwind.json';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';
import SelectInterestsScreen from './src/screens/SelectInterestsScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
            <TailwindProvider utilities={utilities}>
              <SafeAreaProvider>
                <AppNavigator />
              </SafeAreaProvider>
            </TailwindProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const { user, setUser } = useContext(UserContext);
  const [initializing, setInitializing] = useState(true);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const dispatch = useDispatch();
  const [todayDay, setTodayDay] = useState(1);

  useEffect(() => {
    const checkIsChangedDay = async () => {
      const lastDateStr = await AsyncStorage.getItem('lastDate');
      const lastTodayDay = await AsyncStorage.getItem('todayDay');
      const currentDay = format(new Date(), 'yyyy-MM-dd'); 
      if (lastDateStr !== currentDay) {
        let newTodayDay = lastTodayDay ? (parseInt(lastTodayDay) % 10) + 1 : 1;
        await AsyncStorage.setItem('lastDate', currentDay);
        await AsyncStorage.setItem('todayDay', newTodayDay.toString());
        setTodayDay(newTodayDay);
      } else if (lastTodayDay) {
        setTodayDay(parseInt(lastTodayDay));
      }
  
      setInitializing(false); 
    };
  
    checkIsChangedDay();
  }, []); 
  

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedUser = await AsyncStorage.getItem(storageKey);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setOnboardingVisible(false);
        } else {
          setOnboardingVisible(true);
        }
      } catch (error) {
        console.error('Помилка завантаження даних користувача:', error);
      } finally {
        setInitializing(false);
      }
    };
    loadUser();
  }, [setUser]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111111' }}>
        <ActivityIndicator size="large" color="#FF3838" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={onboardingVisible ? 'OnboardingScreen' : 'Home'}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SelectInterestsScreen" component={SelectInterestsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DiscoverScreen" component={DiscoverScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default MyStack;
