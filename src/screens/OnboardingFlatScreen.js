import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform } from 'react-native';
import { styled } from 'nativewind';
import onboardingData from '../slides'; 
import { useNavigation } from '@react-navigation/native';
import Paginator from '../components/Paginator';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

const OnboardingFlatScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dimensions, setDimensions] = useState(Dimensions.get('window')); 
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const navigation = useNavigation(); 

  const fadeAnimGoogle = useRef(new Animated.Value(0)).current;
  const fadeAnimFacebook = useRef(new Animated.Value(0)).current;
  const fadeAnimApple = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
  
    const dimensionListener = Dimensions.addEventListener('change', onChange);
  
    return () => {
      dimensionListener.remove(); 
    };
  }, []);
  

  useEffect(() => {
    if (currentIndex === onboardingData.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnimGoogle, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimFacebook, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimApple, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentIndex]);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Home'); 
    }
  };

  const topPadding = (Platform.OS === 'ios' && (dimensions.height >= 812)) ? 37 : 0; 

  const renderItem = ({ item }) => (
    <View style={{ width: dimensions.width }} className="flex-1 justify-start items-center">
      <ImageBackground
        source={item.image}
        style={{
          width: dimensions.width,
          height: dimensions.height * (dimensions.width < 400 ? 0.35 : 0.4), 
          marginBottom: 16,
          marginTop: topPadding, 
        }}
        resizeMode="contain"
      />
      <Text className="text-[#cb8b26] font-bold text-center mt-5" style={{ fontFamily: 'MontserratAlternates-SemiBold', fontSize: dimensions.width * 0.07 }}>
        {item.title}
      </Text>
      <Text className="text-[#b5b5b5] text-center mt-2 px-5" style={{ fontFamily: 'Montserrat-Regular', fontSize: dimensions.width < 400 ? dimensions.width * 0.04 : dimensions.width * 0.045 }}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <StyledView className="flex-1 items-center bg-[#181818] justify-between">
      <StyledView className="flex-[3]">
        <FlatList
          data={onboardingData}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef}
        />
      </StyledView>

      {currentIndex !== onboardingData.length - 1 && (
        <Paginator data={onboardingData} scrollX={scrollX} color="#ffb91c" />
      )}

{currentIndex === onboardingData.length - 1 ? (
  <StyledView className="mb-10 w-full">
    <StyledTouchableOpacity
      onPress={() => navigation.navigate("RegisterOrLoginScreen")}
      className="bg-[#3c3c3c] rounded-2xl py-4 px-6 self-center w-[70%]"
    >
      <Text className="text-customYellow text-center text-lg" style={{ fontFamily: 'Montserrat-SemiBold' }}>
        Sign in
      </Text>
    </StyledTouchableOpacity>
  </StyledView>
) : (
  <StyledTouchableOpacity
    onPress={scrollTo}
    className="bg-[#ffb91c] rounded-full py-5 px-10 mb-10 self-center w-3/5"
    style={{
      bottom: 30,
    }}
  >
    <Text className="text-black text-base font-semibold text-center" style={{ fontFamily: 'Montserrat-SemiBold' }}>
      {currentIndex === 0 ? 'Start Now' : 'Next'}
    </Text>
  </StyledTouchableOpacity>
)}

    </StyledView>
  );
};

export default OnboardingFlatScreen;
