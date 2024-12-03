import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity, SafeAreaView, Share, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowUpOnSquareIcon } from 'react-native-heroicons/solid';
import { styled } from 'nativewind';
import { ScrollView } from 'react-native-gesture-handler';

const SavedScreen = ({ selectedScreen, setRoutedLocation, setSelectedScreen, routedLocation }) => {
    const [savedLocations, setSavedLocations] = useState([]);
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const StyledTouchableOpacity = styled(TouchableOpacity);

    useEffect(() => {
        const fetchSavedLocations = async () => {
            try {
                const saved = await AsyncStorage.getItem('savedLocations');
                setSavedLocations(saved ? JSON.parse(saved) : []);
            } catch (error) {
                console.error("Error loading saved locations:", error);
            }
        };

        fetchSavedLocations();

    }, [selectedScreen])

    const handleDeleteLocation = async (savedId) => {
        try {
            const updatedLocations = savedLocations.filter(location => location.savedId !== savedId);
            setSavedLocations(updatedLocations);
            await AsyncStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
        } catch (error) {
            console.error("Error deleting location:", error);
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

    useEffect(() => {
        console.log("saved places is " + savedLocations)
    }, [selectedScreen])

    return (
        <SafeAreaView style={{ marginBottom: 100 }}>
            <Text style={styles.title(dimensions)}>Saved</Text>
            {savedLocations.length !== 0 ? (

                <ScrollView>
                    {savedLocations.map(location => (


                        <View key={location.savedId} className="border border-[#7C7C7C] mb-7" style={{ borderRadius: 18, width: '100%', position: 'relative', }}>

                            <View className="flex-row p-3 rounded-xl space-x-2 items-center" style={{ position: 'absolute', top: 14, left: 14, backgroundColor: '#111111', zIndex: 50 }}>
                                <Image source={require("../assets/icons/EllipseChoosenpng.png")} className="items-center w-3 h-3" />
                                <Text className="text-white" style={{}}>{location?.genre}</Text>
                            </View>

                            <Image
                                source={location?.image}
                                style={{
                                    width: '100%',
                                    height: dimensions.height * 0.16,
                                    borderTopLeftRadius: 18, borderTopRightRadius: 18

                                }}
                                resizeMode="stretch"
                            />
                            <Text
                                className="text-white"
                                style={[
                                    styles.generalText(dimensions),
                                    { fontFamily: 'Montserrat-Regular', fontSize: dimensions.width * 0.04, paddingTop: 16, marginHorizontal: 20, fontWeight: 700, textAlign: 'left' }
                                ]}
                            >
                                {location?.title}
                            </Text>

                            <Text className="text-[#7C7C7C] font-light" style={{ fontFamily: "Montserrat-Regular", textAlign: 'left', marginHorizontal: 20, paddingTop: 10 }}>
                                {location?.description}
                            </Text>

                            <View className="flex-row justify-between px-4 pb-3 pt-3">

                                <StyledTouchableOpacity
                                    onPress={() => { setRoutedLocation(location); setSelectedScreen('Route') }}
                                    className="bg-customRed rounded-2xl py-5"
                                    style={{ width: '55%', }}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontFamily: 'Montserrat-SemiBold',
                                            textAlign: 'center',
                                            fontSize: 16,
                                        }}
                                    >
                                        Build the route
                                    </Text>
                                </StyledTouchableOpacity>

                                <StyledTouchableOpacity
                                    onPress={() => handleDeleteLocation(location.savedId)}
                                    className="bg-white rounded-2xl justify-center items-center"
                                    style={{ width: '20%', height: 60 }}
                                >
                                    <Image
                                        source={require('../assets/icons/choosenIcons/alreadySavedIcon.png')}
                                        style={{ height: 32, width: 32 }}
                                        resizeMode="contain"
                                    />
                                </StyledTouchableOpacity>

                                <StyledTouchableOpacity
                                    onPress={() => {
                                        console.log('Sharing link:', location?.mapLink);
                                        shareLink(location?.mapLink);
                                    }}
                                    className="bg-white rounded-2xl justify-center items-center"
                                    style={{ width: '20%', height: 60 }}
                                >
                                    <ArrowUpOnSquareIcon color="black" size={32} />
                                </StyledTouchableOpacity>
                            </View>


                        </View>

                    ))}
                </ScrollView>
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
                    No favourite locations selected yet. Start adding your favorite places!
                </Text>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: (dimensions) => ({
        color: 'white',
        fontFamily: 'MochiyPopOne-Regular',
        fontSize: dimensions.width * 0.07,
        marginBottom: 20,
        textAlign: 'center',
    }),
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

export default SavedScreen