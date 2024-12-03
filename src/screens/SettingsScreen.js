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

const SettingsScreen = ({ setSelectedScreen }) => {
    const navigation = useNavigation();
    const [selectedButton, setSelectedButton] = useState('1');
    const [animatedBorder, setAnimatedBorder] = useState(new Animated.Value(0));
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [pendingSelection, setPendingSelection] = useState(null);

    useEffect(() => {
        console.log(`selectedButton is ${selectedButton}`)
    }, [selectedButton])

    useEffect(() => {
        const loadSelection = async () => {
            try {
                const savedInterest = await AsyncStorage.getItem('selectedInterest');
                console.log(`savedInterest is ${savedInterest}`)
                if (savedInterest) {
                    setSelectedButton(savedInterest);
                }
            } catch (error) {
                console.error('Помилка при завантаженні інтересу:', error);
            }
        };

        loadSelection();
    }, []);

    const saveSelection = async () => {
        try {
            if (pendingSelection) {
                await AsyncStorage.setItem('selectedInterest', pendingSelection);
                setSelectedButton(pendingSelection);
                console.log('Збережено інтерес:', pendingSelection);
            }
        } catch (error) {
            console.error('Помилка при збереженні інтересу:', error);
        }
    };

    const handleSelect = (id) => {
        setPendingSelection(id);

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
        <StyledView
            className="flex-1 bg-customBg"
            style={{
                width: '100%', alignItems: 'center',
                justifyContent: 'center',
                position: dimensions.width < 380 ? 'absolute' : 'relative',
                top: dimensions.width < 380 ? 16 : 0
            }}
        >
            <Text style={{
                color: 'white',
                fontFamily: 'MochiyPopOne-Regular',
                fontSize: dimensions.width * 0.066,
                marginBottom: 20,
                textAlign: 'center',
            }}>Settings</Text>

            {buttons.map((button) => (
                <Animated.View
                    key={button.id}
                    style={[
                        {
                            borderWidth: 2,
                            borderRadius: 12,
                            width: '90%',
                            marginBottom: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        (pendingSelection || selectedButton) === button.id
                            ? { borderColor: '#FF3838' }
                            : { borderColor: '#7c7c7c' },
                    ]}
                >
                    <StyledTouchableOpacity
                        onPress={() => handleSelect(button.id)}
                        className="w-full"
                    >
                        <View
                            style={[
                                {
                                    padding: 15,
                                    borderRadius: 12,
                                },
                                (pendingSelection || selectedButton) === button.id
                                    ? { backgroundColor: '#212121' }
                                    : null,
                            ]}
                        >
                            <View className="flex flex-row items-center space-x-3 mb-3 my-2" >
                                {(pendingSelection || selectedButton) === button.id ? (
                                    <Image
                                        source={require("../assets/icons/el1.png")}
                                        className="items-center h-8 w-8 pl-3"
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <Image
                                        source={require("../assets/icons/Ellipse1.png")}
                                        className="items-center h-8 w-8 pl-3"
                                        resizeMode="contain"
                                    />
                                )}
                                <Text style={{
                                    fontSize: dimensions.width * 0.04,
                                    color: 'white',
                                    fontFamily: 'Montserrat-SemiBold',
                                    alignSelf: 'center'
                                }}>
                                    {button.buttonTitle}
                                </Text>
                            </View>
                            <Text style={{
                                buttonText: {
                                    fontSize: dimensions.width * 0.03,
                                    fontFamily: 'Montserrat-Regular',
                                    textAlign: 'center',
                                    

                                },
                            }} className="text-white">{button.buttonText}</Text>
                        </View>
                    </StyledTouchableOpacity>
                </Animated.View>
            ))}

            <StyledTouchableOpacity
                onPress={saveSelection}
                disabled={!pendingSelection}
                className="bg-customRed rounded-2xl py-5 px-10 mb-1 self-center w-[90%]"
                style={{ opacity: !pendingSelection ? 0.5 : 1, width: '90%' }}
            >
                <Text style={{
                    color: 'white',
                    fontFamily: 'Montserrat-SemiBold',
                    textAlign: 'center',
                    fontSize: dimensions.width * 0.04,
                }}>Save</Text>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
                onPress={() => setSelectedScreen('AboutScreen')}
                style={{ width: '90%', marginTop: 10 }}
            >
                <Text style={{
                    color: 'white',
                    fontFamily: 'Montserrat-SemiBold',
                    textAlign: 'left',
                    zIndex: 50,
                    fontSize: 16,
                    textDecorationLine: 'underline',
                    textDecorationColor: 'white',
                }}>About the app</Text>
            </StyledTouchableOpacity>
        </StyledView>
    );
};

const styles = StyleSheet.create({
});

export default SettingsScreen;
