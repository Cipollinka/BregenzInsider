import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import React from 'react';

const PageDots = ({ data, scrollX }) => {
    const { width } = useWindowDimensions();

    return (
        <View style={{
            flexDirection: 'row',
            height: 64,
            justifyContent: 'center',
        }}>
            {data.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    extrapolate: 'clamp',
                    outputRange: [10, 20, 10],
                });

                const opacity = scrollX.interpolate({
                    extrapolate: 'clamp',
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                });

                return (
                    <Animated.View
                        style={{
                            width: dotWidth,
                            opacity,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: '#FF3838',
                            marginHorizontal: 8,
                        }}
                        key={i.toString()}
                    />
                );
            })}
        </View>
    );
};

export default PageDots;

