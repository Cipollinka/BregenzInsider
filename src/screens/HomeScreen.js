import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Share,
  ImageBackground,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AboutScreen from './AboutScreen';
import { styled } from 'nativewind';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData, saveUserData } from '../redux/userSlice';
import SelectInterestsScreen from './SelectInterestsScreen';
import SavedScreen from './SavedScreen';
import RouteScreen from './RouteScreen';
import SettingsScreen from './SettingsScreen';
import { ArrowUpOnSquareIcon } from 'react-native-heroicons/solid';
import { ScrollView } from 'react-native-gesture-handler';
import InfoScreen from './InfoScreen';
import SurpriseScreen from './SurpriseScreen';


const locations = {
  1: [
    {
      id: 1, savedId: 1, title: 'Pfänder Mountain', description: 'Offers panoramic views of Lake Constance and the surrounding region.', image: require('../assets/images/imageBr1.jpeg'), genre: 'Scenic Sports', categoryId: 2,
      mapLink: 'https://maps.apple.com/?address=Lochau,%20%D0%A4%D0%BE%D1%80%D0%B0%D1%80%D0%BB%D1%8C%D0%B1%D0%B5%D1%80%D0%B3,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&auid=7472201425017885983&ll=47.507257,9.780198&lsp=9902&q=Pf%C3%A4nder', coordinates: { latitude: 47.50726, longitude: 9.78020 }
    },
    {
      id: 2, savedId: 2, title: 'Lake Constance Promenade', description: 'Ideal for a leisurely stroll along the lakeside with beautiful scenery.', image: require('../assets/images/imageBr2.jpeg'), genre: 'Scenic Sports', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Bodensee,%20Deutschland&auid=13006816955138977957&ll=47.650000,9.316667&lsp=9902&q=%D0%91%D0%BE%D0%B4%D0%B5%D0%BD%D1%81%D1%8C%D0%BA%D0%B5%20%D0%BE%D0%B7%D0%B5%D1%80%D0%BE', coordinates: {
        latitude: 47.65000,
        longitude: 9.31667
      }
    },
    {
      id: 3, savedId: 3, title: 'Rappenloch Gorge', description: 'A stunning natural gorge with waterfalls and scenic hiking trails.', image: require('../assets/images/imageBr3.jpeg'), genre: 'Scenic Sports', categoryId: 2,
      mapLink: 'https://maps.apple.com/?address=Ebniterstra%C3%9Fe,%206850%20%D0%94%D0%BE%D1%80%D0%BD%D0%B1%D1%96%D1%80%D0%BD,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.385152,9.779569&q=Ebniterstra%C3%9Fe', coordinates: {
        latitude: 47.38512,
        longitude: 9.77957
      }
    },
    {
      id: 4, savedId: 4, title: 'Laternser Berg', description: 'A mountain that provides hiking routes and beautiful views of the lake and Alps.', image: require('../assets/images/imageBr4.jpeg'), genre: 'Scenic Sports', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Laternserstra%C3%9Fe%2019,%206830%20Laterns,%20%C3%96sterreich&auid=1374674269525070810&ll=47.266068,9.704070&lsp=9902&q=Bergheim%20Pension',
      coordinates: {
        latitude: 47.266068,
        longitude: 9.704070
      }

    },
    {
      id: 5, savedId: 5, title: 'Sonnenkopf', description: 'A great spot to enjoy nature and panoramic views.', image: require('../assets/images/imageBr5.jpeg'), genre: 'Scenic Sports', categoryId: 2,
      mapLink: 'https://maps.apple.com/?address=87527%20Bad%20Hindelang,%20Bayern,%20Deutschland&auid=12487228598764197942&ll=47.459000,10.330000&lsp=9902&q=Sonnenkopf',
      coordinates: {
        latitude: 47.45900,
        longitude: 10.33000,
      }
    },
    {
      id: 6, savedId: 6, title: 'Gutenberg Castle Park', description: 'A peaceful park surrounding a historic castle with lovely views.', image: require('../assets/images/imageBr6.jpeg'), genre: 'Scenic Sports', categoryId: 2,
      mapLink: 'https://maps.apple.com/?address=Burgweg,%20Gemeinde%20Balzers,%20%D0%9B%D1%96%D1%85%D1%82%D0%B5%D0%BD%D1%88%D1%82%D0%B5%D0%B9%D0%BD&ll=47.064844,9.500980&q=Burgweg',
      coordinates: {
        latitude: 47.06482551044805,
        longitude: 9.501063023816826,
      }
    },
    {
      id: 7, savedId: 7, title: 'Hohenems Castle Park', description: 'A scenic location perfect for a relaxing walk through nature and history.', image: require('../assets/images/imageBr7.jpeg'), genre: 'Scenic Sports', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Rummergasse%2020,%206900%20%D0%91%D1%80%D0%B5%D0%B3%D0%B5%D0%BD%D1%86,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.501182,9.725211&q=%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%80',
      coordinates: {
        latitude: 47.50118,
        longitude: 9.72521,
      }
    },
    {
      id: 8, savedId: 8, title: 'Karren Mountain', description: 'Located in nearby Dornbirn, offers fantastic mountain views and hiking trails.', image: require('../assets/images/imageBr8.jpeg'), genre: 'Scenic Sports', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Karren%201,%206850%20%D0%94%D0%BE%D1%80%D0%BD%D0%B1%D1%96%D1%80%D0%BD,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.387425,9.750790&q=Karren%201',
      coordinates: {
        latitude: 47.38742,
        longitude: 9.75079,
      }
    },
    {
      id: 9, savedId: 9, title: 'Lindau Harbor', description: 'While just a short distance from Bregenz, it provides amazing lake views.', image: require('../assets/images/imageBr9.webp'), genre: 'Scenic Sports', categoryId: 2,
      mapLink: 'https://maps.apple.com/?address=Hafenplatz%203,%2088131%20%D0%9B%D1%96%D0%BD%D0%B4%D0%B0%D1%83,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=47.544711,9.683819&q=Hafenplatz%203',
      coordinates: {
        latitude: 47.54471,
        longitude: 9.68382,
      }
    },
    {
      id: 10, savedId: 10, title: 'Milchpilz', description: 'A quirky, mushroom-shaped kiosk by the lake offering a unique experience.', image: require('../assets/images/imageBr10.jpeg'), genre: 'Scenic Sports', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Unterer%20Schrannenplatz%206,%2088131%20%D0%9B%D1%96%D0%BD%D0%B4%D0%B0%D1%83,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=47.547023,9.682283&q=Unterer%20Schrannenplatz%206',
      coordinates: {
        latitude: 47.54725440401749,
        longitude: 9.681253062580188,
      }
    },
  ],
  2: [
    {
      id: 1, savedId: 11, title: 'Vorarlberg Museum', description: 'Discover regional art, history, and culture.', image: require('../assets/images/imageBr11.jpeg'), genre: 'Historical Landmarks', categoryId: 2,
      mapLink: 'https://maps.apple.com/?address=%D0%A4%D0%BE%D1%80%D0%B0%D1%80%D0%BB%D1%8C%D0%B1%D0%B5%D1%80%D0%B3%D1%81%D1%8C%D0%BA%D0%B8%D0%B9%20%D0%BF%D1%80%D0%BE%D0%B2%D1%96%D0%BD%D1%86%D1%96%D0%B9%D0%BD%D0%B8%D0%B9%20%D0%BC%D1%83%D0%B7%D0%B5%D0%B9,%20Kornmarktplatz%201,%206900%20%D0%91%D1%80%D0%B5%D0%B3%D0%B5%D0%BD%D1%86,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.504494,9.746616&q=%D0%A4%D0%BE%D1%80%D0%B0%D1%80%D0%BB%D1%8C%D0%B1%D0%B5%D1%80%D0%B3%D1%81%D1%8C%D0%BA%D0%B8%D0%B9%20%D0%BF%D1%80%D0%BE%D0%B2%D1%96%D0%BD%D1%86%D1%96%D0%B9%D0%BD%D0%B8%D0%B9%20%D0%BC%D1%83%D0%B7%D0%B5%D0%B9',
      coordinates: {
        latitude: 47.50448659071605,
        longitude: 9.746616042329112,
      }
    },
    {
      id: 2, savedId: 12, title: 'Gutenberg Castle', description: 'A well-preserved historic site with impressive views of Bregenz.', image: require('../assets/images/imageBr12.jpeg'), genre: 'Historical Landmarks', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Burg%20Gutenberg,%20Burgweg%205,%209496%20Balzers,%20%D0%9B%D1%96%D1%85%D1%82%D0%B5%D0%BD%D1%88%D1%82%D0%B5%D0%B9%D0%BD&ll=47.065200,9.500100&q=Burg%20Gutenberg',
      coordinates: {
        latitude: 47.0652,
        longitude: 9.5001,
      }
    },
    {
      id: 3, savedId: 13, title: 'Bregenz Cathedral', description: 'A beautiful baroque-style church located in the heart of the city.', image: require('../assets/images/imageBr13.jpeg'), genre: 'Historical Landmarks', categoryId: 2, mapLink: 'https://maps.apple.com/?address=Thalbachgasse%206,%206900%20%D0%91%D1%80%D0%B5%D0%B3%D0%B5%D0%BD%D1%86,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.499707,9.747383&q=Thalbachgasse%206',
      coordinates: {
        latitude: 47.49947523025489,
        longitude: 9.747554344538761,
      }
    },
    {
      id: 4, savedId: 14, title: 'Brigantium Museum', description: 'Learn about the Roman roots of Bregenz and its ancient past.', image: require('../assets/images/imageBr14.jpeg'), genre: 'Historical Landmarks', categoryId: 3, mapLink: 'https://maps.apple.com/?address=Kornmarktplatz%203,%206900%20Bregenz,%20%C3%96sterreich&auid=8995104482231515387&ll=47.505077,9.747409&lsp=9902&q=Kunsthaus%20Bregenz',
      coordinates: {
        latitude: 47.70890581900664,
        longitude: 9.747018374187968,
      }
    },
    {
      id: 5, savedId: 15, title: 'Kunsthaus Bregenz', description: 'A modern art museum showcasing international contemporary works.', image: require('../assets/images/imageBr15.jpeg'), genre: 'Historical Landmarks', categoryId: 2, mapLink: 'https://maps.apple.com/?address=Kornmarktplatz%203,%206900%20Bregenz,%20%C3%96sterreich&auid=8995104482231515387&ll=47.505077,9.747409&lsp=9902&q=Kunsthaus%20Bregenz',
      coordinates: {
        latitude: 47.50890581900664,
        longitude: 9.747018374187968,
      }
    },
    {
      id: 6, savedId: 16, title: 'The Bregenz Festival Floating Stage', description: 'A one-of-a-kind floating stage, hosting world-class operas.', image: require('../assets/images/imageBr16.jpeg'), genre: 'Historical Landmarks', categoryId: 3, mapLink: 'https://maps.apple.com/?address=Platz%20der%20Wiener%20Symphoniker%201,%206900%20%D0%91%D1%80%D0%B5%D0%B3%D0%B5%D0%BD%D1%86,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.504956,9.738095&q=Platz%20der%20Wiener%20Symphoniker%201',
      coordinates: {
        latitude: 47.50497815208576,
        longitude: 9.73815953765342,
      }
    },
    {
      id: 7, savedId: 17, title: 'Lake Constance Lighthouse', description: 'A historical lighthouse offering stunning views.', image: require('../assets/images/imageBr17.jpeg'), genre: 'Historical Landmarks', categoryId: 2, mapLink: 'https://maps.apple.com/?address=Seestra%C3%9Fe%2013,%2078464,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&ll=47.665232,9.182334&q=%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%80',
      coordinates: {
        latitude: 47.66697229310262,
        longitude: 9.183308756003527,
      }
    },
    {
      id: 8, savedId: 18, title: 'Schloss Hofen', description: ' A historic castle and former monastery, now a museum.', image: require('../assets/images/imageBr18.jpeg'), genre: 'Historical Landmarks', categoryId: 3, mapLink: 'https://maps.apple.com/?address=Schlo%C3%9F%20Hofen,%206911%20Lochau,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.538504,9.763952&q=Schlo%C3%9F%20Hofen',
      coordinates: {
        latitude: 47.53850,
        longitude: 9.76395,
      }
    },
    {
      id: 9, savedId: 19, title: 'Heritage of the Old Town', description: 'Explore the winding medieval streets and traditional buildings of Bregenz.', image: require('../assets/images/imageBr19.jpeg'), genre: 'Historical Landmarks', categoryId: 2, mapLink: 'https://maps.apple.com/?address=88097%20%D0%AD%D1%80%D0%B8%D1%81%D0%BA%D0%B8%D1%80%D1%85,%20%D0%91%D0%B0%D0%B4%D0%B5%D0%BD-%D0%92%D1%8E%D1%80%D1%82%D0%B5%D0%BC%D0%B1%D0%B5%D1%80%D0%B3,%20%D0%9D%D1%96%D0%BC%D0%B5%D1%87%D1%87%D0%B8%D0%BD%D0%B0&auid=3304969779067352251&ll=47.638500,9.563950&lsp=7618&q=88097%20%D0%AD%D1%80%D0%B8%D1%81%D0%BA%D0%B8%D1%80%D1%85',
      coordinates: {
        latitude: 47.63850,
        longitude: 9.56395,
      }
    },
    {
      id: 10, savedId: 20, title: 'Museum of History & Archaeology', description: 'A small museum that highlights the archaeological finds of Bregenz and the region', image: require('../assets/images/imageBr20.jpeg'), genre: 'Historical Landmarks', categoryId: 3, mapLink: 'https://maps.apple.com/?address=Bahnhofstra%C3%9Fe,%206900%20%D0%91%D1%80%D0%B5%D0%B3%D0%B5%D0%BD%D1%86,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.500963,9.735961&q=Bahnhofstra%C3%9Fe',
      coordinates: {
        latitude: 47.50038312823135,
        longitude: 9.731369135138486,
      }
    },
  ],
  3: [
    {
      id: 1, savedId: 21, title: 'Street Art around Bregenz', description: 'Discover various art installations scattered around the city, such as "A Porsche made of Concrete."', image: require('../assets/images/imageBr21.jpeg'), genre: 'Art & Culture', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=City%20Tunnel%20Bregenz,%206900%20%D0%91%D1%80%D0%B5%D0%B3%D0%B5%D0%BD%D1%86,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.493931,9.740064&q=City%20Tunnel%20Bregenz',
      coordinates: {
        latitude: 47.49393,
        longitude: 9.74006,
      }
    },
    {
      id: 2, savedId: 22, title: 'Kunsthaus Bregenz', description: 'This contemporary art museum features cutting-edge exhibitions.', image: require('../assets/images/imageBr22.jpeg'), genre: 'Art & Culture', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Kornmarktplatz%203,%206900%20Bregenz,%20%C3%96sterreich&auid=8995104482231515387&ll=47.505077,9.747409&lsp=9902&q=Kunsthaus%20Bregenz',
      coordinates: {
        latitude: 47.50890581900664,
        longitude: 9.747018374187968,
      }
    },
    {
      id: 3, savedId: 23, title: 'Bregenz Festival', description: 'A summer festival known for its impressive outdoor opera performances​', image: require('../assets/images/imageBr23.jpeg'), genre: 'Art & Culture', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Platz%20der%20Wiener%20Symphoniker%201,%206900%20%D0%91%D1%80%D0%B5%D0%B3%D0%B5%D0%BD%D1%86,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.504625,9.738448&q=%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%80',
      coordinates: {
        latitude: 47.50462,
        longitude: 9.73845,
      }
    },
    {
      id: 4, savedId: 24, title: 'Public Art on the Lake Promenade', description: 'Outdoor sculptures and art pieces along the lake, including the famous "Ready Maid".', image: require('../assets/images/imageBr24.jpeg'), genre: 'Art & Culture', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Place%20du%20Jardin%20Public,%2068750%20%D0%91%D0%B5%D1%80%D0%B3%D1%85%D0%B0%D0%B9%D0%BC,%20%D0%A4%D1%80%D0%B0%D0%BD%D1%86%D1%96%D1%8F&ll=48.205393,7.358582&q=Place%20du%20Jardin%20Public',
      coordinates: {
        latitude: 48.20539,
        longitude: 7.35858,
      }
    },
    {
      id: 5, savedId: 25, title: 'Museum of Contemporary Art', description: 'Explore exhibitions that focus on modern art movements.', image: require('../assets/images/imageBr25.jpeg'), genre: 'Art & Culture', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Kornmarktplatz%203,%206900%20Bregenz,%20%C3%96sterreich&auid=8995104482231515387&ll=47.505077,9.747409&lsp=9902&q=Kunsthaus%20Bregenz',
      coordinates: {
        latitude: 47.50890581900664,
        longitude: 9.747018374187968,
      }
    },
    {
      id: 6, savedId: 26, title: 'Bregenz Opera House', description: 'A cultural landmark, especially known for hosting the Bregenz Festival.', image: require('../assets/images/imageBr26.jpeg'), genre: 'Art & Culture', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Oberau,%206900%20%D0%91%D1%80%D0%B5%D0%B3%D0%B5%D0%BD%D1%86,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.491309,9.779785&q=Oberau',
      coordinates: {
        latitude: 47.49131,
        longitude: 9.77978,
      }
    },
    {
      id: 7, savedId: 27, title: 'Heinz Gappmayr Sculpture', description: 'Located in Bregenz, an avant-garde sculpture that plays with scale and form.', image: require('../assets/images/imageBr27.jpeg'), genre: 'Art & Culture', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Reutegasse%205A,%206900%20%D0%91%D1%80%D0%B5%D0%B3%D0%B5%D0%BD%D1%86,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.495597,9.724546&q=%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%80',
      coordinates: {
        latitude: 47.49560,
        longitude: 9.72455,
      }
    },
    {
      id: 8, savedId: 28, title: 'Herbert Albrecht’s Public Art', description: '"Homage to Brigantium," a tribute to Bregenz’s history, along the lake.', image: require('../assets/images/imageBr28.jpeg'), genre: 'Art & Culture', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Riedergasse%2011,%206900%20%D0%91%D1%80%D0%B5%D0%B3%D0%B5%D0%BD%D1%86,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.497424,9.741123&q=%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%80',
      coordinates: {
        latitude: 47.49742,
        longitude: 9.74112,
      }
    },
    {
      id: 9, savedId: 29, title: 'Theater Bregenz', description: 'A place to experience a variety of performances including plays and concerts.', image: require('../assets/images/imageBr29.jpeg'), genre: 'Art & Culture', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=Kunsthaus%20Bregenz,%20Seestra%C3%9Fe,%206900%20%D0%91%D1%80%D0%B5%D0%B3%D0%B5%D0%BD%D1%86,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.505168,9.747218&q=Kunsthaus%20Bregenz',
      coordinates: {
        latitude: 47.50517,
        longitude: 9.74722,
      }
    },
    {
      id: 10, savedId: 30, title: 'Vorarlberg Cultural Centre', description: 'A hub for the arts, from music to literature', image: require('../assets/images/imageBr30.jpeg'), genre: 'Art & Culture', categoryId: 3,
      mapLink: 'https://maps.apple.com/?address=R%C3%BCttenenstra%C3%9Fe%2020,%206800%20%D0%A4%D0%B5%D0%BB%D1%8C%D0%B4%D0%BA%D1%96%D1%80%D1%85,%20%D0%90%D0%B2%D1%81%D1%82%D1%80%D1%96%D1%8F&ll=47.264846,9.595047&q=R%C3%BCttenenstra%C3%9Fe%2020',
      coordinates: {
        latitude: 47.26485,
        longitude: 9.59505,
      }
    },

  ]
};






const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreen, setSelectedScreen] = useState('Home');
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState(null);
  const StyledTouchableOpacity = styled(TouchableOpacity);
  const [todayDay, setTodayDay] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterest, setSelectedInterest] = useState(1);
  const [todayLocation, setTodayLocation] = useState(null);
  const [generatedLocation, setGeneratedLocation] = useState(null);
  const [routedLocation, setRoutedLocation] = useState(null);

  const [savedLocations, setSavedLocations] = useState([]);

  const getRandomLocation = async (selectedInterest) => {
    try {
      const usedLocationsKey = `usedLocations_${selectedInterest}`;
      const usedLocations = JSON.parse(await AsyncStorage.getItem(usedLocationsKey)) || [];

      const availableLocations = locations[selectedInterest].filter(
        (loc) => !usedLocations.includes(loc.id)
      );

      if (availableLocations.length === 0) {
        await AsyncStorage.removeItem(usedLocationsKey);
        return getRandomLocation(selectedInterest);
      }

      const randomIndex = Math.floor(Math.random() * availableLocations.length);
      const randomLocation = availableLocations[randomIndex];

      usedLocations.push(randomLocation.id);
      await AsyncStorage.setItem(usedLocationsKey, JSON.stringify(usedLocations));

      return randomLocation;
    } catch (error) {
      console.error('Error fetching random location:', error);
    }
  };

  const handleGenerateLocation = async () => {
    const randomLocation = await getRandomLocation(selectedInterest);
    setGeneratedLocation(randomLocation);
  };

  useEffect(() => {
    const fetchSelectedInterest = async () => {
      try {
        const savedInterest = await AsyncStorage.getItem('selectedInterest');
        if (savedInterest) {
          setSelectedInterest(parseInt(savedInterest, 10));
        }
      } catch (error) {
        console.error('Помилка отримання інтересу:', error);
      }
    };

    fetchSelectedInterest();
  }, []);

  useEffect(() => {
    if (selectedInterest !== null && locations[selectedInterest]) {
      setTodayLocation(locations[selectedInterest].find(location => location.id === todayDay));
    }
    console.log('Today loc is ' + todayLocation?.name)
  }, [todayDay, selectedInterest, selectedScreen]);


  useEffect(() => {
    const loadSelection = async () => {
      try {
        const savedInterest = await AsyncStorage.getItem('selectedInterest');
        if (savedInterest) {
          setSelectedInterest(parseInt(savedInterest, 10));
        }
      } catch (error) {
        console.error('Помилка при завантаженні інтересу:', error);
      }
    };

    loadSelection();
  }, [selectedScreen]);

  const getTodayLocation = useMemo(() => {
  }, [todayDay, selectedInterest]);



  useEffect(() => {
    const fetchSavedLocations = async () => {
      try {
        const saved = await AsyncStorage.getItem('savedLocations');
        setSavedLocations(saved ? JSON.parse(saved) : []);
      } catch (error) {
        console.error('Помилка завантаження збережених локацій:', error);
      }
    };

    fetchSavedLocations();
  }, [selectedScreen,]);

  const isLocationSaved = useMemo(() => {
    return todayLocation && savedLocations.some((loc) => loc.savedId === todayLocation.savedId);
  }, [todayLocation, savedLocations, selectedScreen,]);

  const isGeneratedSaved = useMemo(() => {
    return generatedLocation && savedLocations.some((loc) => loc.savedId === generatedLocation.savedId);
  }, [generatedLocation, savedLocations]);

  useEffect(() => {
    const fetchTodayDay = async () => {
      try {
        const savedDay = await AsyncStorage.getItem('todayDay');
        if (savedDay !== null) {
          setTodayDay(parseInt(savedDay, 10));
        }
      } catch (error) {
        console.error('Помилка при завантаженні todayDay:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayDay();
  }, []);

  useEffect(() => {
    console.log(`today is: ${todayDay}`)
  }, [todayDay])



  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

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

  useEffect(() => {
    console.log("generated location savedId is " + generatedLocation?.savedId)
  }, [generatedLocation])


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

  return (
    <View className="bg-customBg" style={{ flex: 1, alignItems: 'center', }}>
      <Image source={require('../assets/images/bg.png')} style={{width:'100%', height: '100%', position: 'absolute', flex: 1}}/>
      {selectedScreen === 'Home' ? (
        <View className="flex-1 px-5  " style={{ paddingTop: dimensions.width < 380 ? 10 : 40, width: '100%', }}>

          <View style={{ paddingTop: dimensions.width < 380 ? 0 : 10, marginBottom: dimensions.width < 380 ? 5 : 20, }}>

            <Text
              className="text-white  "
              style={[
                styles.generalText(dimensions),
                { fontFamily: 'MochiyPopOne-Regular', fontSize: dimensions.width * 0.07, paddingTop: 16, marginHorizontal: 20, fontWeight: 700, lineHeight: dimensions.width * 0.1 }
              ]}
            >
              Bregenz Insider
            </Text>
            <Text
              className="text-white  "
              style={[
                styles.generalText(dimensions),
                { fontFamily: 'Montserrat-Regular', fontSize: dimensions.width * 0.04, paddingTop: 16, marginHorizontal: 20, fontWeight: 700, lineHeight: dimensions.width * 0.04 }
              ]}
            >
              Click on the button below, and we will select a location for you
            </Text>
          </View>
          <ScrollView style={{ marginBottom: 100, }}>

            {!generatedLocation ? (
              <View className="p-5 rounded-[14px] my-5 items-center w-full border border-[#7C7C7C]">
                <Text className="text-[#7C7C7C] font-light" style={{ fontFamily: "Montserrat-Regular", textAlign: 'center', paddingHorizontal: 50, paddingVertical: 10 }}>
                  The place that we will select for you will be displayed here
                </Text>
              </View>
            ) : (
              <View>
                <View className="border border-[#7C7C7C]" style={{ borderRadius: 18, width: '100%', position: 'relative' }}>

                  <View className="flex-row p-3 rounded-xl space-x-2 items-center" style={{ position: 'absolute', top: 14, left: 14, backgroundColor: '#111111', zIndex: 50 }}>
                    <Image source={require("../assets/icons/EllipseChoosenpng.png")} className="items-center w-3 h-3" />
                    <Text className="text-white" style={{}}>{generatedLocation?.genre}</Text>
                  </View>

                  <Image
                    source={generatedLocation?.image}
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
                    {generatedLocation?.title}
                  </Text>

                  <Text className="text-[#7C7C7C] font-light" style={{ fontFamily: "Montserrat-Regular", textAlign: 'left', marginHorizontal: 20, paddingTop: 10 }}>
                    {generatedLocation?.description}
                  </Text>

                  <View className="flex-row justify-between px-4 pb-3 pt-3">

                    <StyledTouchableOpacity
                      onPress={() => { setRoutedLocation(generatedLocation); setSelectedScreen('Route') }}
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
                      onPress={() => saveLocation(generatedLocation)}
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
                    </StyledTouchableOpacity>

                    <StyledTouchableOpacity
                      onPress={() => {
                        console.log('Sharing link:', generatedLocation?.mapLink);
                        shareLink(generatedLocation?.mapLink);
                      }}
                      className="bg-white rounded-2xl justify-center items-center"
                      style={{ width: '20%', height: 60 }}
                    >
                      <ArrowUpOnSquareIcon color="black" size={32} />
                    </StyledTouchableOpacity>
                  </View>
                </View>

                <StyledTouchableOpacity
                  onPress={handleGenerateLocation}
                  className="bg-customRed text-center rounded-3xl py-5 mt-3 mb-1 self-center"
                  style={{ width: '100%' }}
                >
                  <View className="flex-row" style={{ alignSelf: 'center' }}>
                    <Image source={require("../assets/icons/reloadCircleIcon.png")} className="items-center w-7 h-7" />
                    <Text style={{
                      color: 'white',
                      fontFamily: 'Montserrat-SemiBold',
                      textAlign: 'center',
                      fontSize: dimensions.width * 0.05,
                    }}>Regenerate</Text>
                  </View>
                </StyledTouchableOpacity>
              </View>

            )}
            {!generatedLocation && (
              <StyledTouchableOpacity
                onPress={handleGenerateLocation}
                className="bg-customRed rounded-3xl py-5  mb-1 self-center"
                style={{ width: '100%' }}
              >
                <Text style={{
                  color: 'white',
                  fontFamily: 'Montserrat-SemiBold',
                  textAlign: 'center',
                  fontSize: dimensions.width * 0.04,
                }}>Find Location</Text>
              </StyledTouchableOpacity>
            )}

            <TouchableOpacity onPress={() => setSelectedScreen('Surprise')} style={{
              width: '100%',
              height: '8%',
              borderRadius: 25,
              overflow: 'hidden',
              marginTop: 10
            }}>
              <ImageBackground
                source={require('../assets/images/ButtonBackBr.png')}
                style={{flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',}}
                imageStyle={styles.image}
              >
                {/* Додатковий текст або елементи всередині кнопки */}
                <Text style={{
                color: 'black',
                fontFamily: 'Montserrat-SemiBold',
                textAlign: 'center',
                fontSize: dimensions.width * 0.05,
              }}>Surprise me</Text>
              </ImageBackground>
            </TouchableOpacity>


            {/* <View style={{ width: '100%' }}>

              <TouchableOpacity
                onPress={handleGenerateLocation}
                style={{ width: '100%', height: '40%' }}

              >
                <Image
                  source={require('../assets/images/ButtonBackgroungBr.png')}
                  style={{ alignItems: 'center', width: '100%', height: '30%' }}
                  resizeMode="stretch"
                  className=" rounded-3xl my-3 flex"
                />
              </TouchableOpacity>
            </View> */}

            <Text
              className="text-white pb-3"
              style={[
                styles.generalText(dimensions),
                { fontFamily: 'MochiyPopOne-Regular', fontSize: dimensions.width * 0.07, paddingTop: 16, marginHorizontal: 20, fontWeight: 700, lineHeight: dimensions.width * 0.1 }
              ]}
            >
              Place of the day
            </Text>

            <View className="border border-[#7C7C7C]" style={{ borderRadius: 18, width: '100%', position: 'relative', marginBottom: 50 }}>

              <View className="flex-row p-3 rounded-xl space-x-2 items-center " style={{ position: 'absolute', top: 14, left: 14, backgroundColor: '#111111', zIndex: 50 }}>
                <Image source={require("../assets/icons/el1.png")} className="w-5 h-5 pl-1" resizeMode='contain' />
                <Text className="text-white" style={{}}>{todayLocation?.genre}</Text>
              </View>

              <Image
                source={todayLocation?.image}
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
                {todayLocation?.title}
              </Text>

              <Text className="text-[#7C7C7C] font-light" style={{ fontFamily: "Montserrat-Regular", textAlign: 'left', marginHorizontal: 20, paddingTop: 10 }}>
                {todayLocation?.description}
              </Text>

              <View className="flex-row justify-between px-4 pb-3 pt-3">

                <StyledTouchableOpacity
                  onPress={() => { setRoutedLocation(todayLocation); setSelectedScreen('Route') }}
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
                  onPress={() => saveLocation(todayLocation)}
                  className="bg-white rounded-2xl justify-center items-center"
                  style={{ width: '20%', height: 60 }}
                >
                  <Image
                    source={
                      isLocationSaved
                        ? require('../assets/icons/choosenIcons/alreadySavedIcon.png')
                        : require('../assets/icons/choosenIcons/choosenSavedIconBr.png')
                    }
                    style={{ height: 32, width: 32 }}
                    resizeMode="contain"
                  />
                </StyledTouchableOpacity>

                <StyledTouchableOpacity
                  onPress={() => {
                    console.log('Sharing link:', todayLocation?.mapLink);
                    shareLink(todayLocation?.mapLink);
                  }}
                  className="bg-white rounded-2xl justify-center items-center"
                  style={{ width: '20%', height: 60 }}
                >
                  <ArrowUpOnSquareIcon color="black" size={32} />
                </StyledTouchableOpacity>
              </View>


            </View>
          </ScrollView>


        </View>

      ) : selectedScreen === 'AboutScreen' ? (
        <AboutScreen setSelectedScreen={setSelectedScreen} />
      ) : selectedScreen === 'Settings' ? (
        <SettingsScreen setSelectedScreen={setSelectedScreen} />
      ) : selectedScreen === 'Saved' ? (
        <SavedScreen selectedScreen={selectedScreen} setRoutedLocation={setRoutedLocation} setSelectedScreen={setSelectedScreen} routedLocation={routedLocation} />
      ) : selectedScreen === 'Route' ? (
        <RouteScreen routedLocation={routedLocation} savedLocations={savedLocations} selectedScreen={selectedScreen} setSavedLocations={setSavedLocations} />
      ) : selectedScreen === 'Info' ? (
        <InfoScreen />
      ) : selectedScreen === 'Surprise' ? (
        <SurpriseScreen setRoutedLocation={setRoutedLocation} locations={locations} savedLocations={savedLocations} setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} setSavedLocations={setSavedLocations} />
      )
        : null}

      <View
        className="absolute bg-[#212121] bottom-0 w-full py-2 " style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25 }}
      >
        <View className="flex-row justify-around py-2  mb-5">
          <View className="flex-1 px-3 flex-row justify-between ">

            <TouchableOpacity
              onPress={() => setSelectedScreen('Home')}
              className="items-center p-2 h-12 w-12"
            >
              <Image
                source={selectedScreen === 'Home' ? require('../assets/icons/choosenIcons/choosenHomeIconBr.png') : require('../assets/icons/simpleIcons/homeIconBr.png')}
                className="text-center h-10 w-10"
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedScreen('Saved')}
              className="items-center p-2 h-12 w-12"
            >
              <Image
                source={selectedScreen === 'Saved' ? require('../assets/icons/choosenIcons/choosenSavedIconBr.png') : require('../assets/icons/simpleIcons/savedIconBr.png')}
                className="text-center h-10 w-10"
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedScreen('Info')}
              className="items-center p-2 h-12 w-12"
            >
              <Image
                source={selectedScreen === 'Info' ? require('../assets/icons/choosenIcons/ChoosenInfoIconBr.png') : require('../assets/icons/simpleIcons/InfoIconBr.png')}
                className="text-center h-10 w-10"
                resizeMode="contain"
              />
            </TouchableOpacity>



            <TouchableOpacity
              onPress={() => setSelectedScreen('Settings')}
              className="items-center p-2 h-12 w-12"
            >
              <Image
                source={selectedScreen === 'Settings' ? require('../assets/icons/choosenIcons/choosenSettingsIconBr.png') : require('../assets/icons/simpleIcons/settingsIconBr.png')}
                className="text-center h-10 w-10"
                resizeMode="contain"
              />
            </TouchableOpacity>



            <TouchableOpacity
              onPress={() => setSelectedScreen('Route')}
              className="items-center p-2 h-12 w-12"
            >
              <Image
                source={selectedScreen === 'Route' ? require('../assets/icons/choosenIcons/choosenRouteIconBr.png') : require('../assets/icons/simpleIcons/routeIconBr.png')}
                className="text-center h-10 w-10"
                resizeMode="contain"
              />
            </TouchableOpacity>

          </View>
        </View>
      </View>

    </View>
  );
};


const styles = StyleSheet.create({
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

export default HomeScreen;
