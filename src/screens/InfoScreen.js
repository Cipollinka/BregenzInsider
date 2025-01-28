import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform, SafeAreaView, StyleSheet, Share } from 'react-native';
import { styled } from 'nativewind';
import onboardingData from '../components/infoData';
import { useNavigation } from '@react-navigation/native';
import PageDots from '../components/PageDots';
import { ArrowUpOnSquareIcon } from 'react-native-heroicons/solid';
import { ScrollView } from 'react-native-gesture-handler';
import { ArrowLeftIcon, ChevronLeftIcon } from 'react-native-heroicons/outline';

const StyledTouchableOpacity = styled(TouchableOpacity);


const InfoScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const [isInfoBlockVisible, setInfoBlockVisible] = useState(false);
    const [selectedInfoBlock, setSelectedInfoBlock] = useState(null);


    const infoBlocks = [
        { id: 1, title: 'Discovering Bregenz: A Hidden Gem by Lake Constance', "description": "Bregenz, a picturesque town nestled on the shores of Lake Constance, offers a unique blend of natural beauty, historical charm, and cultural vibrancy. Whether you’re seeking adventure, relaxation, or a mix of both, Bregenz has something for everyone.\n\nTop Attractions:\n- Bregenz Festival: Every summer, the floating stage on Lake Constance comes alive with spectacular opera performances that draw visitors from around the world.\n- Pfänder Mountain: Hike or take the cable car to the summit for breathtaking views of the lake and the Alps.\n- Old Town (Oberstadt): Wander through medieval cobblestone streets, explore St. Martin’s Tower, and admire well-preserved historic buildings.\n\nA Town of Contrasts:\nBregenz seamlessly combines history and modernity. The Kunsthaus Bregenz showcases cutting-edge contemporary art, while the Old Town tells stories of its Celtic and Roman past.\n\nWhy Visit Bregenz?\nWhether it’s a leisurely boat trip on Lake Constance, exploring nearby hiking trails, or soaking in the town's vibrant cultural scene, Bregenz promises an unforgettable experience." },
        { id: 2, title: 'A Day in Bregenz: The Perfect Itinerary', "description": "Planning a visit to Bregenz? Here’s how to make the most of one day in this charming Austrian town.\n\nMorning: Exploring the Old Town\nStart your day in Oberstadt, the historic part of Bregenz. Visit St. Martin’s Tower, where panoramic views await, and stroll along narrow, winding streets filled with charm and history.\n\nAfternoon: Adventure on Pfänder Mountain\nAfter lunch, head to the Pfänderbahn cable car. At the top, enjoy scenic views of Lake Constance and the Alps. You can also hike, visit the alpine wildlife park, or simply relax at a mountain café.\n\nEvening: Bregenz Festival or Waterfront Walk\nIf you’re visiting in summer, don’t miss a performance at the Bregenz Festival. Otherwise, enjoy a sunset walk along the lake promenade and treat yourself to dinner at a waterfront restaurant.\n\nTip: Don’t forget to try some local Austrian dishes like Käsknöpfle (cheesy pasta) or freshly caught fish from Lake Constance." },
        { id: 3, title: 'The Cultural Side of Bregenz: Art, History, and Festivals', "description": "Bregenz isn’t just a beautiful lakeside town; it’s a cultural hotspot that attracts art lovers, history buffs, and festival-goers alike.\n\nKunsthaus Bregenz: Where Art Meets Architecture\nDesigned by renowned architect Peter Zumthor, the Kunsthaus Bregenz (KUB) is a must-visit for art enthusiasts. Its minimalist design and cutting-edge exhibitions make it a standout cultural landmark.\n\nHistorical Highlights:\n- Roman Roots: Once a Roman settlement named Brigantium, Bregenz’s history stretches back over two millennia. Artifacts and ruins reflect its rich past.\n- St. Martin’s Tower: This historic tower offers a glimpse into Bregenz’s medieval period and provides stunning views of the town and lake.\n\nFestivals and Events:\nThe Bregenz Festival is the town's crown jewel, with its awe-inspiring floating stage on Lake Constance. Other events, like local markets and traditional music festivals, keep the cultural calendar full year-round.\n\nWhy Bregenz Stands Out:\nBregenz offers a unique blend of natural beauty and cultural depth. It’s not just a town to visit — it’s a place to experience art, history, and the best of Austrian hospitality." },
    ];

    const shareLink = async (block) => {
        try {
            await Share.share({
                message: `What do you know about ${block.title}? You can reed this info in BregenzInsider!`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };


    useEffect(() => {
        const onChange = ({ window }) => {
            setDimensions(window);
        };

        const dimensionListener = Dimensions.addEventListener('change', onChange);

        return () => {
            dimensionListener.remove();
        };
    }, []);

    const visibleItemsChanged = useRef(({ visibleItems }) => {
        if (visibleItems && visibleItems.length > 0) {
            setCurrentIndex(visibleItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;


    const renderFacts = ({ item }) => (
        <SafeAreaView style={{ width: dimensions.width }} className="mt-3 justify-start items-center">
            <View
                className="border border-[#7C7C7C] mb-5"
                style={{ borderRadius: 18, width: '90%', position: 'relative' }}
            >
                <View className=''>

                    <Text
                        className="text-white"
                        style={[
                            styles.generalText(dimensions),
                            {
                                fontFamily: 'Montserrat-Bold',
                                fontSize: dimensions.width * 0.05,
                                paddingTop: 16,
                                marginHorizontal: 20,
                                fontWeight: 'bold',
                                textAlign: 'left',
                            },
                        ]}
                    >
                        {item.title}
                    </Text>
                    <Text
                        className="text-white font-light"
                        style={{
                            fontFamily: 'Montserrat-Regular',
                            textAlign: 'left',
                            marginHorizontal: 20,
                            paddingTop: 10,
                            paddingBottom: 14
                        }}
                    >
                        {item.description}
                    </Text>
                </View>

            </View>
        </SafeAreaView>
    );

    return (
        <View style={{flex:1}}>
            <Image source={require('../assets/images/bg.png')} style={{width:'100%', height: '100%', position: 'absolute', flex: 1}}/>
        <SafeAreaView className="flex-1 flex items-center  " style={{ width: '100%' }}>
            <View className='flex-row justify-between' style={{width: '90%'}} >

                {isInfoBlockVisible && (
                    <View style={{  paddingTop: 16,}}>
                        <TouchableOpacity onPress={() => setInfoBlockVisible(false)}>
                            <ChevronLeftIcon size={dimensions.width * 0.1} color='white' />
                        </TouchableOpacity>
                    </View>
                )}
                <Text
                    className="text-white"
                    style={[
                        styles.generalText(dimensions),
                        { fontFamily: 'MochiyPopOne-Regular',
                            fontSize: dimensions.width * 0.07,
                            paddingTop: 16,
                            fontWeight: 700,
                            paddingRight: isInfoBlockVisible ? '12%' : '0%',
                            lineHeight: dimensions.width * 0.1 }
                    ]}
                >
                    {isInfoBlockVisible ? 'Reading' : 'Bregenz Insider'}
                </Text>
                {isInfoBlockVisible && (<Text></Text>)}

            </View>
            {isInfoBlockVisible ? (
                <ScrollView>
                    <View style={{width: '100%'}}>
                        <Text
                            className="text-white"
                            style={[
                                styles.generalText(dimensions),
                                { fontFamily: 'Montserrat-Regular',  marginBottom: 111, fontSize: dimensions.width * 0.04, paddingTop: 16, marginHorizontal: 20, fontWeight: 'bold', textAlign: 'left' }
                            ]}
                        >
                            {selectedInfoBlock?.description}
                        </Text>
                    </View>
                </ScrollView>
            ) : (
                <ScrollView style={{ width: '100%', marginBottom: 70 }}>


                    <View style={{ height: dimensions.width < 380 ? dimensions.height * 0.28 : dimensions.height * 0.21 }}>

                        <FlatList
                            data={onboardingData}
                            renderItem={renderFacts}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(fact) => fact.id.toString()}
                            pagingEnabled
                            bounces={false}
                            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                                useNativeDriver: false,
                            })}
                            viewabilityConfig={viewConfig}
                            onViewableItemsChanged={visibleItemsChanged}
                            ref={slidesRef}
                            scrollEventThrottle={32}

                        />
                    </View>
                    <PageDots data={onboardingData} scrollX={scrollX} color="#FF3838" />

                    <Text
                        className="text-white pb-3"
                        style={[
                            styles.generalText(dimensions),
                            { fontFamily: 'MochiyPopOne-Regular', paddingLeft: '5%', fontSize: dimensions.width * 0.07, fontWeight: 700, textAlign: 'left' }
                        ]}
                    >
                        Interesting Info
                    </Text>




                    <View style={{marginBottom: 50}}>

                        {infoBlocks.map((block) => (
                            <View key={block.id} className="border border-[#7C7C7C]" style={{ borderRadius: 18, width: '90%', position: 'relative', marginBottom: 10, alignSelf: 'center' }}>
                                <Text
                                    className="text-white"
                                    style={[
                                        styles.generalText(dimensions),
                                        { fontFamily: 'Montserrat-Bold', fontSize: dimensions.width * 0.055, paddingTop: 16, marginHorizontal: 20, fontWeight: 'bold', textAlign: 'left' }
                                    ]}
                                >
                                    {block.title}
                                </Text>

                                <View className="flex-row justify-between px-4 pb-3 pt-3">
                                    <StyledTouchableOpacity
                                        onPress={() => { setSelectedInfoBlock(block); setInfoBlockVisible(true) }}
                                        className="bg-customRed rounded-2xl py-5"
                                        style={{ width: '55%' }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontFamily: 'Montserrat-SemiBold',
                                                textAlign: 'center',
                                                fontSize: 16,
                                            }}
                                        >
                                            Read Now
                                        </Text>
                                    </StyledTouchableOpacity>

                                    <StyledTouchableOpacity
                                        onPress={() => {
                                            shareLink(block);
                                        }}
                                        className="bg-white rounded-2xl justify-center items-center"
                                        style={{ width: '20%', height: 60 }}
                                    >
                                        <ArrowUpOnSquareIcon color="black" size={32} />
                                    </StyledTouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

            )}


        </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    generalText: (dimensions) => ({
        fontFamily: 'InknutAntiqua-Regular',
        fontSize: dimensions.width * 0.08,
        fontWeight: 'bold',
    }),
});
export default InfoScreen;
