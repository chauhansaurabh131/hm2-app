import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import style from './style';
import CustomHeaderLogo from '../../components/customHeaderLogo';
import {icons, images} from '../../assets';
import {hp, wp} from '../../utils/helpers';

const StartExploreScreen = ({navigation}) => {
  const [selectedBox, setSelectedBox] = useState(null);

  const handleBoxPress = boxType => {
    setSelectedBox(boxType);
  };

  const getGradientColors = boxType => {
    return boxType === 'marriage'
      ? ['#0F52BA', '#8225AF']
      : ['#0F52BA', '#8225AF'];
  };

  const renderBox = (boxType, styleProp) => {
    const isSelected = selectedBox === boxType;

    return (
      <TouchableOpacity
        key={boxType}
        activeOpacity={0.7}
        onPress={() => handleBoxPress(boxType)}>
        {isSelected ? (
          <LinearGradient
            colors={getGradientColors(boxType)}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styleProp, style.selectedBox]}>
            <Image
              source={
                boxType === 'marriage' ? icons.marriageLogo : icons.datingLogo
              }
              style={[style.logoStyle, isSelected && {tintColor: 'white'}]}
            />
            <Text style={[style.boxTextStyle, isSelected && {color: 'white'}]}>
              {boxType.charAt(0).toUpperCase() + boxType.slice(1)}
            </Text>
          </LinearGradient>
        ) : (
          <View style={[styleProp, style.unselectedBox]}>
            <Image
              source={
                boxType === 'marriage' ? icons.marriageLogo : icons.datingLogo
              }
              style={style.logoStyle}
            />
            <Text style={style.boxTextStyle}>
              {boxType.charAt(0).toUpperCase() + boxType.slice(1)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      {/*<CustomHeaderLogo />*/}

      <Image
        source={images.happyMilanColorLogo}
        style={{
          marginTop: hp(29),
          marginLeft: wp(33),
          width: wp(96),
          height: hp(24),
          resizeMode: 'stretch',
        }}
      />
      <View style={style.bodyContainer}>
        <Text style={style.bodyHeadingText}>I want to register for</Text>

        <View style={style.boxContainer}>
          {renderBox('marriage', style.boxMarriageStyle)}
          {renderBox('dating', style.boxDatingStyle)}
        </View>

        {selectedBox && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              // navigation.navigate('HomeTabsStack');
              navigation.navigate('HomeTabs');
            }}
            style={style.buttonContainer}>
            <LinearGradient
              colors={['#0F52BA', '#8225AF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={style.buttonStyle}>
              <Text style={style.buttonTextStyle}>Start Explore</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default StartExploreScreen;
