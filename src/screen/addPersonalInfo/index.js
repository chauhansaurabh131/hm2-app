import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {PersonalInfoPhases} from '../../utils/constants';

import React, {useReducer} from 'react';
import GradientButton from '../../components/GradientButton';
import {hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import CustomHeaderLogo from '../../components/customHeaderLogo';
import {images} from '../../assets';

const NEXT_SCREEN = 'NEXT_SCREEN';
const NUMBER_SCREEN = 'NUMBER_SCREEN';
const BACK_SCREEN = 'BACK_SCREEN';

const phaseReducer = (state, action) => {
  switch (action.type) {
    case NEXT_SCREEN: {
      return {
        activeIndex: state.activeIndex + 1,
      };
    }

    case NUMBER_SCREEN: {
      return {
        activeIndex: action.screenNumber,
      };
    }

    case BACK_SCREEN: {
      return {
        activeIndex: state.activeIndex - 1,
      };
    }

    default:
      return state;
  }
};

const renderIcons = ({item, index, activeIndex, onPressIcon}) => {
  const color = () => {
    if (index === activeIndex) {
      return ['#0D4EB3', '#9413D0'];
    } else {
      if (index < activeIndex) {
        return ['#17C270', '#17C270'];
      } else {
        return ['#FFFFFF', '#FFFFFF'];
      }
    }
  };
  const tintColor = () => {
    if (index <= activeIndex) {
      return 'white';
    } else {
      return 'black';
    }
  };

  return (
    <TouchableOpacity
      disabled={index > activeIndex + 1}
      activeOpacity={1}
      onPress={() => onPressIcon(index)}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={color()}
        style={{
          height: hp(48),
          width: hp(48),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
        }}>
        {/*{console.log('Item Icon:', item.icon)}*/}
        <Image
          source={item.icon}
          style={{
            height: hp(16),
            width: hp(16),
            tintColor: tintColor(),
          }}
          resizeMode={'contain'}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const AddPersonalInfo = ({navigation}) => {
  const phaseReducerInitialState = {
    activeIndex: 0,
  };

  const [{activeIndex}, dispatch] = useReducer(
    phaseReducer,
    phaseReducerInitialState,
  );

  const RenderComp = () => PersonalInfoPhases[activeIndex].component;

  const navigateToNext = () => {
    dispatch({type: NEXT_SCREEN});
  };

  const navigateToScreen = screenNumber => {
    dispatch({type: NUMBER_SCREEN, screenNumber});
  };
  const navigateToBack = () => {
    if (activeIndex > 0) {
      dispatch({type: BACK_SCREEN});
    } else {
      // navigation.navigate('HomeScreen');
      navigation.navigate('HomeTabs');
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <CustomHeaderLogo
        headerImage={{
          backgroundColor: 'white',
          top: -10,
          left: -15,
          marginBottom: hp(10),
        }}
      />

      <View style={{height: hp(48)}}>
        <FlatList
          horizontal
          scrollEnabled={false}
          contentContainerStyle={{
            flex: 1,
            height: hp(48),
            justifyContent: 'space-evenly',
            // backgroundColor: colors.white,
            // backgroundColor: 'red',
          }}
          data={PersonalInfoPhases}
          renderItem={({item, index}) =>
            renderIcons({
              item,
              index,
              activeIndex,
              onPressIcon: navigateToScreen,
            })
          }
        />
      </View>

      <Text
        style={{color: colors.black, marginTop: hp(15), marginLeft: hp(16)}}>
        {PersonalInfoPhases[activeIndex].phaseName}
      </Text>

      <View style={{alignSelf: 'center', height: hp(1), marginTop: hp(8)}}>
        <Progress.Bar
          progress={(activeIndex + 1) / PersonalInfoPhases.length}
          width={(Dimensions.get('window').width / 100) * 92}
          color={'#17C270'}
          borderWidth={0.5}
          borderColor={colors.gray}
        />
      </View>
      <RenderComp />

      <View
        style={{
          // backgroundColor: 'red',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 17,
          height: hp(87),
          alignItems: 'center',
        }}>
        <GradientButton
          buttonName={'Back'}
          containerStyle={{
            width: wp(162),
            height: hp(50),
            borderColor: colors.blue,
            borderWidth: 1,
          }}
          buttonTextStyle={{color: colors.black}}
          whiteBackground
          onPress={navigateToBack}
        />

        <GradientButton
          disable={activeIndex === PersonalInfoPhases.length - 1}
          buttonName={'Next'}
          containerStyle={{width: wp(162), height: hp(50)}}
          buttonTextStyle={{color: colors.white}}
          onPress={navigateToNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddPersonalInfo;
