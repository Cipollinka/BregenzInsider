import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';


const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

const DiscoverScreen = () => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const navigation = useNavigation();


    const topPadding = (Platform.OS === 'ios' && (dimensions.height >= 812)) ? 37 : 0;



    return (
        <View style={{flex:1}}>
            <Image source={require('../assets/images/bg.png')} style={{width:'100%', height: '100%', position: 'absolute', flex: 1}}/>
        <StyledView className="flex-1 items-center bg-customBg justify-between">
            <View className="flex-1" style={{
                        width: '100%',
                        marginBottom: 16,
                        marginTop: topPadding,
                    }}>
                <Image
                    source={require("../assets/images/Bregenz.png")}
                    style={{
                        width: '100%',
                        height: '50%',

                    }}
                    resizeMode="stretch"
                />
                <Text className="text-white font-bold text-center mt-5" style={{ fontFamily: 'MochiyPopOne-Regular', fontSize: dimensions.width * 0.07, maxWidth: '80%', alignSelf: 'center' }}>
                    Discover Bregenz!
                </Text>
                <Text className="text-[#b5b5b5] text-center mt-2 px-5" style={{ fontFamily: 'Montserrat-Regular', fontSize: dimensions.width < 400 ? dimensions.width * 0.04 : dimensions.width * 0.045 }}>
                    You’re all set! Tap ‘Start Exploring’ to see the best places in Bregenz based on your preferences.
                </Text>
            </View>


            <StyledTouchableOpacity
                onPress={() => navigation.replace("Home")}
                className="bg-customRed rounded-2xl py-5 px-10 mb-10 self-center w-3/5"
                style={{
                    bottom: '16%',
                }}
            >
                <Text className="text-white text-base font-semibold text-center" style={{ fontFamily: 'Montserrat-SemiBold' }}>Start
                </Text>
            </StyledTouchableOpacity>

        </StyledView>
        </View>
    );
};

export default DiscoverScreen;
