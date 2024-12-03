import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import { styled } from 'nativewind';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from 'react-native-heroicons/outline';

const StyledTouchableOpacity = styled(TouchableOpacity);

const AboutScreen = ({ setSelectedScreen }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  return (
    <SafeAreaView className="flex-1" style={{marginBottom: 80}}>
      {/* Заголовок "About" закріплений вгорі */}
      <View className="justify-start flex-row items-center mt-4" style={{width: '90%', paddingBottom: 25}}>
        <TouchableOpacity onPress={() => setSelectedScreen("Settings")}>
          <ChevronLeftIcon color="#fff" size={40}/>
        </TouchableOpacity>
        <Text
          className="text-[#FAEDE1] font-semibold text-center"
          style={[
            styles.generalText(dimensions),
            { fontFamily: 'MochiyPopOne-Regular', fontWeight: '800', fontSize: dimensions.width * 0.08,  }
          ]}
        >
          About the App:
        </Text>
      </View>

      <Text
          className="text-white text-xs font-semibold text-center"
          style={{
            fontFamily: 'Montserrat-Regular',
            fontWeight: '500',
            fontSize: dimensions.width * 0.04,
            paddingHorizontal: 30,
            textAlign: 'left',
          }}
        >
           Discover the hidden gems and breathtaking views of Bregenz with Bregenz Insider, your personalized guide to the city’s most scenic spots. 
           Designed for locals and visitors alike, this app curates a unique experience, helping you explore Bregenz’s beauty through nature, history, and local charm.{"\n\n"}
           Whether you’re searching for panoramic mountain views, peaceful lakefronts, or historic landmarks, Bregenz Insider tailors recommendations based on your interests.{"\n"}
           Select from categories like Scenic Spots, Historical Landmarks, Local Eats, and Art & Culture, and let the app guide you to places that match your vibe.{"\n"}
           Enjoy insider tips, map routes, and seasonal updates that ensure every visit is a fresh discovery.{"\n\n"}
           With Bregenz Insider, you’ll experience the heart of Bregenz in an authentic way—exploring beyond the usual tourist paths to uncover the spots that make this city unforgettable.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  generalText: (dimensions) => ({
    fontFamily: 'InknutAntiqua-Regular',
    fontSize: dimensions.width * 0.07,
    color: '#FAEDE1',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  }),
});

export default AboutScreen;
