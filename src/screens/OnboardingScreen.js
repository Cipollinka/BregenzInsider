import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform } from 'react-native';
import { styled } from 'nativewind';
import onboardingData from '../components/slides';
import { useNavigation } from '@react-navigation/native';


const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

const OnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();


  const topPadding = (Platform.OS === 'ios' && (dimensions.height >= 812)) ? 37 : 0;

  const renderItem = ({ item }) => (
    <View style={{ width: dimensions.width }} className="flex-1 justify-start items-center">
      <Image
        source={item.image}
        style={{
          width: '100%',
          height: '55%',
          marginBottom: 16,
          marginTop: topPadding,
        }}
        resizeMode="stretch"
      />
      <Text className="text-white font-bold text-center mt-5" style={{ fontFamily: 'MochiyPopOne-Regular', fontSize: dimensions.width * 0.07, maxWidth: '80%' }}>
        {item.title}
      </Text>
      <Text className="text-[#b5b5b5] text-center mt-2 px-5" style={{ fontFamily: 'Montserrat-Regular', fontSize: dimensions.width < 400 ? dimensions.width * 0.04 : dimensions.width * 0.045 }}>
        {item.description}
      </Text>
    </View>
  );

  return (
      <View style={{ flex: 1 }}>
          <Image source={require('../assets/images/bg.png')} style={{width:'100%', height: '100%', position: 'absolute', flex: 1}}/>
    <StyledView className="flex-1 items-center bg-customBg justify-between">
      <StyledView className="flex">
        <FlatList
          data={onboardingData}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id.toString()}

          scrollEventThrottle={32}
        />
      </StyledView>

      <StyledTouchableOpacity
        onPress={() => navigation.navigate("SelectInterestsScreen")}
        className="bg-customRed rounded-full py-5 px-10 mb-10 self-center w-3/5"
        style={{
          bottom: '16%',
        }}
      >
        <Text className="text-white text-base font-semibold text-center" style={{ fontFamily: 'Montserrat-SemiBold' }}>Let`s Go
        </Text>
      </StyledTouchableOpacity>

    </StyledView>
      </View>
  );
};

export default OnboardingScreen;
