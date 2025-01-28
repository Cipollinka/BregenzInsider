import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    StyleSheet,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);

const buttons = [
    {
        id: '1',
        buttonTitle: 'Scenic Spots',
        buttonText: 'Lake views, mountains, parks, and natural landscapes perfect for relaxation or photos.',
    },
    {
        id: '2',
        buttonTitle: 'Historical Landmarks',
        buttonText: 'Castles, museums, and architectural sites that showcase the heritage of Bregenz.',
    },
    {
        id: '3',
        buttonTitle: 'Art & Culture',
        buttonText: 'Street art, galleries, sculptures, and cultural hubs to explore the creative side of Bregenz.',
    },
];

const SelectInterestsScreen = () => {
    const navigation = useNavigation();
    const [selectedButton, setSelectedButton] = useState(null);
    const [animatedBorder, setAnimatedBorder] = useState(new Animated.Value(0));
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const saveSelection = async (id) => {
        try {
            await AsyncStorage.setItem('selectedInterest', id);
            console.log('Вибрано інтерес:', id);
        } catch (error) {
            console.error('Помилка при збереженні інтересу:', error);
        }
    };

    const handleSelect = (id) => {
        setSelectedButton(id);
        saveSelection(id);

        Animated.timing(animatedBorder, {
            toValue: id ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const interpolatedBorderColor = animatedBorder.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', '#FF0000'],
    });

    return (
        <View style={{flex:1}}>
            <Image source={require('../assets/images/bg.png')} style={{width:'100%', height: '100%', position: 'absolute', flex: 1}}/>
        <StyledView
            className="flex-1 bg-customBg"
            style={styles.container}
        >
            <Text style={styles.title(dimensions)}>Choose Your Interests</Text>

            {buttons.map((button) => (
                <Animated.View
                    key={button.id}
                    style={[
                        styles.buttonContainer,
                        selectedButton === button.id ? { borderColor: interpolatedBorderColor } : { borderColor: '#7c7c7c' },
                    ]}
                >
                    <StyledTouchableOpacity
                        onPress={() => handleSelect(button.id)}
                        className="w-full"
                    >
                        <View style={[styles.buttonContent, { backgroundColor: selectedButton === button.id ? '#212121' : null }]}>
                            <View className="flex-row items-center space-x-3 pb-3">
                                {selectedButton === button.id ? (
                                    <Image source={require("../assets/icons/EllipseChoosenpng.png")} className="items-center" />
                                ) : (
                                    <Image source={require("../assets/icons/Ellipse1.png")} className="items-center" />
                                )}
                                <Text style={styles.buttonTitle}>
                                    {button.buttonTitle}
                                </Text>
                            </View>
                            <Text style={styles.buttonText}>
                                {button.buttonText}
                            </Text>
                        </View>
                    </StyledTouchableOpacity>
                </Animated.View>
            ))}

            <StyledTouchableOpacity
                onPress={() => navigation.navigate("DiscoverScreen")}
                disabled={!selectedButton}
                className="bg-customRed rounded-2xl py-5 px-10 mb-10 self-center w-[90%]"
                style={{ opacity: !selectedButton ? 0.5 : 1 }}
            >
                <Text style={styles.submitButtonText}>Continue</Text>
            </StyledTouchableOpacity>
        </StyledView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: (dimensions) => ({
        color: 'white',
        fontFamily: 'MochiyPopOne-Regular',
        fontSize: dimensions.width * 0.07,
        marginBottom: 20,
        textAlign: 'center',
    }),
    buttonContainer: {
        borderWidth: 2,
        borderRadius: 12,
        width: '90%',
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContent: {
        padding: 15,
        borderRadius: 12,
    },
    buttonTitle: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Montserrat-SemiBold',
    },
    buttonText: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontFamily: 'Montserrat-SemiBold',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default SelectInterestsScreen;
