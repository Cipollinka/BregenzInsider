import { View, Text, SafeAreaView, Image, Dimensions, TouchableOpacity, Alert, Share, ImageBackground } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { ArrowUpOnSquareIcon } from 'react-native-heroicons/solid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tr } from 'date-fns/locale';

const SurpriseScreen = ({ locations, savedLocations, setSavedLocations, setSelectedScreen, selectedScreen, setRoutedLocation }) => {

    const [usedIds, setUsedIds] = useState([]);
    const [surprisedLocation, setSurprisedLocation] = useState(null);
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        generateUniqueRandomId();
        setIsLoading(true)

    }, [selectedScreen]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        // Оновлювати прогрес кожну секунду
        const interval = setInterval(() => {
            setProgress((prev) => Math.min(prev + 6.67, 100)); // 6.67 = 100/15, для 1.5 секунди
        }, 100);
        


        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

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

    const generateUniqueRandomId = () => {
        setProgress(0);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false)
        }, 1500)

        const randomLocType = Math.floor(Math.random() * 3) + 1;

        const allIds = locations[randomLocType].map((location) => location.savedId);
        const remainingIds = allIds.filter((id) => !usedIds.includes(id));

        if (remainingIds.length === 0) {
            setUsedIds([]);
            return;
        }

        const randomIndex = Math.floor(Math.random() * remainingIds.length);
        const randomId = remainingIds[randomIndex];

        setUsedIds([...usedIds, randomId]);
        const location = locations[randomLocType].find((loc) => loc.savedId === randomId);
        setSurprisedLocation(location);
    };

    const isGeneratedSaved = useMemo(() => {
        return surprisedLocation && savedLocations.some((loc) => loc.savedId === surprisedLocation.savedId);
    }, [surprisedLocation, savedLocations]);

    const saveLocation = async (location) => {
        try {
            const saved = await AsyncStorage.getItem('savedLocations');
            const parsedLocations = saved ? JSON.parse(saved) : [];

            const locationIndex = parsedLocations.findIndex((loc) => loc.savedId === location.savedId);

            if (locationIndex === -1) {
                const updatedLocations = [location, ...parsedLocations];
                await AsyncStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
                setSavedLocations(updatedLocations);
                console.log('Локація збережена');
            } else {
                const updatedLocations = parsedLocations.filter((loc) => loc.savedId !== location.savedId);
                await AsyncStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
                setSavedLocations(updatedLocations);
                console.log('Локація видалена');
            }
        } catch (error) {
            console.error('Помилка збереження/видалення локації:', error);
        }
    };

    return (
        <SafeAreaView style={{ width: '100%', flex: 1,  }}>
            <Text
                className="text-white"
                style={{
                    fontFamily: 'MochiyPopOne-Regular',
                    fontSize: dimensions.width * 0.07,
                    paddingTop: 16,
                    marginHorizontal: 20,
                    fontWeight: 700,
                    lineHeight: dimensions.width * 0.1,
                    textAlign: 'center',
                    marginBottom: 10
                }}
            >
                Surprise me
            </Text>

            {isLoading ? (
                <View style={{ width: '95%', alignSelf: 'center', flex: 1 }}>
                    <View className="border border-[#7C7C7C]" style={{ borderRadius: 18, position: 'relative', }}>
                        <Image
                            source={require("../assets/images/SurpriseBr.png")}
                            style={{
                                width: dimensions.width < 380 ? dimensions.width * 0.3 : dimensions.width * 0.4,
                                height: dimensions.width < 380 ? dimensions.width * 0.3 : dimensions.width * 0.4,
                                alignSelf: 'center',
                                margin: dimensions.width * 0.04,
                                padding: 25
                            }}
                            resizeMode="cover"
                        />
                        <View style={{
                            width: '90%',
                            height: 10,
                            backgroundColor: '#7C7C7C',
                            borderRadius: 5,
                            marginTop: 20,
                            overflow: 'hidden',
                            alignSelf: 'center',
                            marginBottom: 30,
                        }}>
                            <View
                                style={{
                                    width: `${progress}%`, 
                                    height: '100%',
                                    backgroundColor: '#FF4E4E', 
                                }}
                            />
                        </View>

                    </View>

                    <View className="rounded-3xl py-5 mt-3 mb-1 self-center" style={{ width: '100%' }}>
                        <Text style={{
                            color: 'white',
                            fontFamily: 'Montserrat-SemiBold',
                            textAlign: 'center',
                            fontSize: dimensions.width * 0.07,
                        }}>
                            Wait for...
                        </Text>
                    </View>

                </View>

            ) : (

                <View style={{ width: '95%', alignSelf: 'center', maxHeight: '60%' }}>

                    <View className="border border-[#7C7C7C]" style={{ borderRadius: 18, maxWidth: '95%', position: 'relative', alignSelf: 'center' }}>

                        <View className="flex-row p-3 rounded-xl space-x-2 items-center" style={{ position: 'absolute', top: 14, left: 14, backgroundColor: '#111111', zIndex: 50 }}>
                            <Image source={require("../assets/icons/EllipseChoosenpng.png")} className="items-center w-3 h-3" />
                            <Text className="text-white" style={{}}>{surprisedLocation?.genre}</Text>
                        </View>

                        <View>

                            <Image
                                source={surprisedLocation?.image}
                                style={{
                                    width: '100%',
                                    height: dimensions.height * 0.16,
                                    borderTopLeftRadius: 18, borderTopRightRadius: 18

                                }}
                                resizeMode="stretch"
                            />
                        </View>
                        <Text
                            className="text-white"
                            style={
                                {
                                    fontFamily: 'Montserrat-SemiBold',
                                    paddingTop: 16,
                                    marginHorizontal: 20,
                                    fontWeight: 'bold',
                                    fontSize: dimensions.width * 0.04,
                                    color: '#FAEDE1',
                                    textAlign: 'left',
                                }}
                        >
                            {surprisedLocation?.title}
                        </Text>

                        <Text className="text-[#7C7C7C] font-light" style={{ fontFamily: "Montserrat-Regular", textAlign: 'left', marginHorizontal: 20, paddingTop: 10 }}>
                            {surprisedLocation?.description}
                        </Text>

                        <View className="flex-row justify-between px-4 pb-3 pt-3">

                            <TouchableOpacity
                                onPress={() => { setRoutedLocation(surprisedLocation); setSelectedScreen('Route') }}
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
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => saveLocation(surprisedLocation)}
                                className="bg-white rounded-2xl justify-center items-center"
                                style={{ width: '20%', height: 60 }}
                            >
                                <Image
                                    source={
                                        isGeneratedSaved
                                            ? require('../assets/icons/choosenIcons/alreadySavedIcon.png')
                                            : require('../assets/icons/choosenIcons/choosenSavedIconBr.png')
                                    }
                                    style={{ height: 32, width: 32 }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    console.log('Sharing link:', surprisedLocation?.mapLink);
                                    shareLink(surprisedLocation?.mapLink);
                                }}
                                className="bg-white rounded-2xl justify-center items-center"
                                style={{ width: '20%', height: 60 }}
                            >
                                <ArrowUpOnSquareIcon color="black" size={32} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => generateUniqueRandomId()} style={{
                        width: '90%',
                        height: '10%',
                        borderRadius: 25,
                        overflow: 'hidden',
                        marginTop: 10,
                        alignSelf: 'center'
                    }}>
                        <ImageBackground
                            source={require('../assets/images/ButtonBackBr.png')}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',


                            }}

                        >
                            <Text style={{
                                color: 'black',
                                fontFamily: 'Montserrat-SemiBold',
                                textAlign: 'center',
                                fontSize: dimensions.width * 0.05,
                            }}>Surprise me</Text>
                        </ImageBackground>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelectedScreen('Home')}
                        className=" py-3 mt-3 mb-1 self-center"
                        style={{ width: '100%' }}
                    >
                        <View style={{ width: '100%' }}>

                            <Text style={{
                                color: 'white',
                                fontFamily: 'Montserrat-SemiBold',
                                textAlign: 'center',
                                fontSize: dimensions.width * 0.04,
                            }}>Come Back
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View>
            )}
        </SafeAreaView>
    )
}

export default SurpriseScreen