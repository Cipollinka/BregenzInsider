import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    Share,
    Linking,
    Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styled } from 'nativewind';
import { ArrowUpOnSquareIcon } from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RouteScreen = ({ routedLocation, savedLocations, selectedScreen, setSavedLocations }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const StyledTouchableOpacity = styled(TouchableOpacity);

    const isLocationSaved = useMemo(() => {
        return routedLocation && savedLocations.some((loc) => loc.savedId === routedLocation.savedId);
    }, [savedLocations, routedLocation, selectedScreen]);

    useEffect(() => {
        console.log('routed loc savedId is ' + routedLocation?.savedId);
    }, []);

    const openLink = (url) => {
        if (url) {
            console.log('Opening URL:', url);
            Linking.openURL(url).catch(() => {
                Alert.alert('Error', 'Cannot open the link');
            });
        } else {
            Alert.alert('Error', 'No link provided');
        }
    };


    const shareLink = async (url) => {
        try {
            if (!url) {
                Alert.alert('Error', 'No link to share');
                return;
            }
            console.log('Sharing URL:', url);
            await Share.share({
                message: `I found this location on BregenzInsider: ${url}`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };


    const saveLocation = async (location) => {
        try {
          const saved = await AsyncStorage.getItem('savedLocations');
          const parsedLocations = saved ? JSON.parse(saved) : [];

          const locationIndex = parsedLocations.findIndex((loc) => loc.savedId === routedLocation.savedId);

          if (locationIndex === -1) {
            const updatedLocations = [location, ...parsedLocations];
            await AsyncStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
            setSavedLocations(updatedLocations);
            console.log('Локація збережена');
          } else {
            const updatedLocations = parsedLocations.filter((loc) => loc.savedId !== routedLocation.savedId);
            await AsyncStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
            setSavedLocations(updatedLocations);
            console.log('Локація видалена');
          }
        } catch (error) {
          console.error('Помилка збереження/видалення локації:', error);
        }
      };


    return (
        <View style={{flex: 1}}>
            <Image source={require('../assets/images/bg.png')} style={{width:'100%', height: '100%', position: 'absolute', flex: 1}}/>
        <SafeAreaView>
            {routedLocation ? (

                <View>
                    <View
                        className="border border-[#7C7C7C] mb-5"
                        style={{ borderRadius: 18, width: '100%', position: 'relative' }}
                    >
                        <View
                            className="flex-row p-3 rounded-xl space-x-2 items-center"
                            style={{ position: 'absolute', top: 14, left: 14, backgroundColor: '#111111', zIndex: 50 }}
                        >
                            <Image source={require("../assets/icons/el1.png")} className="w-5 h-5 pl-1" resizeMode='contain'/>
                            <Text className="text-white">{routedLocation?.genre}</Text>
                        </View>

                        <Image
                            source={routedLocation?.image}
                            style={{
                                width: '100%',
                                height: dimensions.height * 0.16,
                                borderTopLeftRadius: 18,
                                borderTopRightRadius: 18,
                            }}
                            resizeMode="stretch"
                        />

                        <Text
                            className="text-white"
                            style={[
                                styles.generalText(dimensions),
                                {
                                    fontFamily: 'Montserrat-Regular',
                                    fontSize: dimensions.width * 0.04,
                                    paddingTop: 16,
                                    marginHorizontal: 20,
                                    fontWeight: '700',
                                    textAlign: 'left',
                                },
                            ]}
                        >
                            {routedLocation?.title}
                        </Text>

                        <Text
                            className="text-[#7C7C7C] font-light"
                            style={{
                                fontFamily: 'Montserrat-Regular',
                                textAlign: 'left',
                                marginHorizontal: 20,
                                paddingTop: 10,
                            }}
                        >
                            {routedLocation?.description}
                        </Text>

                        <View className="flex-row justify-between px-4 pb-3 pt-3">
                            <StyledTouchableOpacity
                                className="bg-customRed rounded-2xl py-5"
                                style={{ width: '55%' }}
                                onPress={() => {
                                    console.log('Opening link:', routedLocation?.mapLink);
                                    openLink(routedLocation?.mapLink);
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontFamily: 'Montserrat-SemiBold',
                                        textAlign: 'center',
                                        fontSize: 16,
                                    }}
                                >
                                    Run the route
                                </Text>
                            </StyledTouchableOpacity>

                            <StyledTouchableOpacity
                                className="bg-white rounded-2xl justify-center items-center"
                                style={{ width: '20%', height: 60 }}
                                onPress={() => saveLocation(routedLocation)}
                            >
                                <Image
                                    source={
                                        isLocationSaved
                                            ? require('../assets/icons/choosenIcons/alreadySavedIcon.png')
                                            : require('../assets/icons/choosenIcons/choosenSavedIconBr.png')
                                    }
                                    style={{ height: 32, width: 32 }}
                                    resizeMode="contain"
                                />
                            </StyledTouchableOpacity>

                            <StyledTouchableOpacity
                                onPress={() => {
                                    console.log('Sharing link:', routedLocation?.mapLink);
                                    shareLink(routedLocation?.mapLink);
                                }}
                                className="bg-white rounded-2xl justify-center items-center"
                                style={{ width: '20%', height: 60 }}
                            >
                                <ArrowUpOnSquareIcon color="black" size={32} />
                            </StyledTouchableOpacity>
                        </View>
                    </View>

                    <MapView
                        style={{
                            width: '100%',
                            height: dimensions.height * 0.35,
                            borderRadius: 40,
                        }}
                        region={{
                            latitude: routedLocation?.coordinates?.latitude,
                            longitude: routedLocation?.coordinates?.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        {routedLocation?.coordinates && (
                            <Marker
                                coordinate={routedLocation.coordinates}
                                title={routedLocation.title}
                                description={routedLocation.description}
                                pinColor="#FF3838"
                            />
                        )}
                    </MapView>
                </View>
            ) : (
                <Text
                    style={{
                        color: 'white',
                        fontFamily: 'Montserrat-SemiBold',
                        textAlign: 'center',
                        fontSize: dimensions.width * 0.05,
                        justifyContent: 'center',
                        display: 'flex',
                        flex: 1,
                        paddingHorizontal: 30,
                        paddingTop: '70%'
                    }}
                >
                    Build the route from Home screen or Saved Routes to see and run the route
                </Text>

            )}
        </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    generalText: (dimensions) => ({
        fontFamily: 'InknutAntiqua-Regular',
        fontSize: dimensions.width * 0.08,
        color: '#FAEDE1',
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    }),
});

export default RouteScreen;
