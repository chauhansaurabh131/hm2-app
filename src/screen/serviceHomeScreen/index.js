import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {icons} from '../../assets';
import ServicesFeaturedComponent from '../../components/servicesFeaturedComponent';
import ServicesRecentlyComponent from '../../components/servicesRecentlyComponent';
import {useNavigation} from '@react-navigation/native';
import style from './style';

const ServiceHomeScreen = () => {
  const [text, setText] = useState('');

  const navigation = useNavigation();

  const items = [
    {icon: icons.wedding_Planner_icon, label: 'Wedding Planner'},
    {icon: icons.wedding_Studio_icon, label: 'Wedding Studio'},
    {icon: icons.decorators_icon, label: 'Decorators'},
    {icon: icons.caterers_icon, label: 'Caterers'},
    {icon: icons.jewellery_Shops_icon, label: 'Jewellery Shops'},
    {icon: icons.cosmetics_icon, label: 'Cosmetics'},
    {icon: icons.meeting_Points_icon, label: 'Meeting Points'},
    {icon: icons.makeup_Artist_icon, label: 'Makeup Artisti'},
    {icon: icons.salons_icon, label: 'Salons'},
  ];

  const onPressItem = label => {
    console.log('Pressed item:', label);

    // 👉 You can navigate here if needed
    // navigation.navigate('YourScreen', {label});

    navigation.navigate('ServicesSearchScreen');
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.headerContainer}>
          <View style={style.searchContainer}>
            <TextInput
              style={style.searchTextInput}
              placeholder="Enter Your City"
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
            />
          </View>
        </View>

        <View style={style.discoverTextContainer}>
          <Text style={style.discoverTextStyle}>Discover Services</Text>
        </View>

        <View style={style.discoverBodyContainer}>
          <View style={style.discoverWrapContainer}>
            {items.map((item, index) => {
              const isMiddle = index % 3 === 1; // 2nd item in each row

              return (
                <View
                  key={index}
                  style={[
                    style.discoverWrapStyle,
                    {marginHorizontal: isMiddle ? 5 : 0},
                  ]}>
                  {/* 🔥 Touchable Image Box */}
                  <TouchableOpacity
                    activeOpacity={0.4}
                    onPress={() => onPressItem(item.label)}
                    style={style.discoverImageStyle}>
                    <Image source={item.icon} style={style.discoverIconStyle} />
                  </TouchableOpacity>
                  <Text style={style.discoverIconLabel}>{item.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={style.horizontalOne} />

        <ServicesFeaturedComponent />

        <View style={style.horizontalTwo} />

        <ServicesRecentlyComponent labelHeading={'Recently Viewed'} />

        <View style={{height: 50}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceHomeScreen;
