import React, {useReducer} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {UserDetailsProfile, UserDetailsProfile1} from '../../utils/constants';
import {colors} from '../../utils/colors';
import * as Progress from 'react-native-progress';

const NEXT_SCREEN = 'NEXT_SCREEN';
const NUMBER_SCREEN = 'NUMBER_SCREEN';
const BACK_SCREEN = 'BACK_SCREEN';

const phaseReducer = (state, action) => {
  switch (action.type) {
    case NEXT_SCREEN:
      return {
        activeIndex: state.activeIndex + 1,
      };

    case NUMBER_SCREEN:
      return {
        activeIndex: action.screenNumber,
      };

    case BACK_SCREEN:
      return {
        activeIndex: state.activeIndex - 1,
      };

    default:
      return state;
  }
};

const renderIcons = ({item, index, activeIndex, onPressIcon}) => {
  const isActive = index === activeIndex;
  const backgroundColor = isActive ? 'white' : '#F8F8F8';
  const tintColor = isActive ? colors.blue : 'black';

  return (
    <TouchableOpacity
      // disabled={index > activeIndex + 1}
      activeOpacity={1}
      onPress={() => onPressIcon(index)}>
      <View
        style={{
          height: hp(48),
          width: hp(48),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          backgroundColor: backgroundColor,
          borderWidth: 2,
          borderColor: isActive ? colors.blue : 'transparent',
        }}>
        <Image
          source={item.icon}
          style={{
            height: hp(16),
            width: hp(16),
            tintColor: tintColor,
          }}
          resizeMode={'contain'}
        />
      </View>
    </TouchableOpacity>
  );
};

const UsersProfileDetailsScreen = ({userData}) => {
  const phaseReducerInitialState = {
    activeIndex: 0,
  };

  const [{activeIndex}, dispatch] = useReducer(
    phaseReducer,
    phaseReducerInitialState,
  );

  const RenderComp = () => UserDetailsProfile1[activeIndex].component(userData);
  const navigateToScreen = screenNumber => {
    dispatch({type: NUMBER_SCREEN, screenNumber});
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: 'white', marginTop: hp(15)}}>
      <FlatList
        horizontal
        scrollEnabled={false}
        contentContainerStyle={{
          flex: 1,
          height: hp(48),
          justifyContent: 'space-between',
        }}
        data={UserDetailsProfile1}
        renderItem={({item, index}) =>
          renderIcons({
            item,
            index,
            activeIndex,
            onPressIcon: navigateToScreen,
          })
        }
      />

      <Text
        style={{
          color: colors.black,
          marginTop: hp(25),
          fontSize: fontSize(16),
          lineHeight: hp(26),
          fontFamily: fontFamily.poppins500,
        }}>
        {UserDetailsProfile1[activeIndex].phaseName}
      </Text>

      <View style={{alignSelf: 'center', height: hp(1), marginTop: hp(15)}}>
        <Progress.Bar
          progress={(activeIndex + 1) / UserDetailsProfile.length}
          width={(Dimensions.get('window').width / 100) * 91}
          color={'#17C270'}
          borderWidth={0.5}
          borderColor={colors.gray}
        />
      </View>

      <RenderComp />
      {/*{UserDetailsProfile[activeIndex].component({name: 1})}*/}
    </SafeAreaView>
  );
};

export default UsersProfileDetailsScreen;
