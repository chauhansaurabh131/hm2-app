import React, {memo, useReducer, useState} from 'react';
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
import {AdminDetailsProfile, UserDetailsProfile} from '../../utils/constants';
import {colors} from '../../utils/colors';
import * as Progress from 'react-native-progress';
import {icons} from '../../assets';
import LinearGradient from 'react-native-linear-gradient';

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

// const renderIcons = ({item, index, activeIndex, onPressIcon}) => {
//   // const isActive = index === activeIndex;
//   // const backgroundColor = isActive ? 'white' : '#F8F8F8';
//   // const tintColor = isActive ? colors.blue : 'black';
//   const isActive = index === activeIndex;
//   const backgroundColor = isActive ? '#dff1f9' : '#F8F8F8'; // Blue background for active icon
//   const borderColor = isActive ? 'transparent' : 'transparent'; // Remove border for active icon
//   const tintColor = isActive ? colors.blue : 'black'; // Change tint color for active icon
//
//   return (
//     <TouchableOpacity
//       // disabled={index > activeIndex + 1}
//       activeOpacity={1}
//       onPress={() => onPressIcon(index)}>
//       <View
//         style={{
//           height: hp(48),
//           width: hp(48),
//           alignItems: 'center',
//           justifyContent: 'center',
//           borderRadius: 50,
//           backgroundColor: backgroundColor,
//           borderWidth: 2,
//           borderColor: borderColor, // Apply the border color
//         }}>
//         <Image
//           source={item.icon}
//           style={{
//             height: hp(16),
//             width: hp(16),
//             tintColor: tintColor, // Apply the tint color
//           }}
//           resizeMode={'contain'}
//         />
//       </View>
//     </TouchableOpacity>
//   );
// };

const renderIcons = ({item, index, activeIndex, onPressIcon}) => {
  const isActive = index === activeIndex;

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => onPressIcon(index)}>
      {isActive ? (
        // Gradient background for the active icon
        <LinearGradient
          colors={['#0D4EB3', '#9413D0']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={{
            height: hp(44),
            width: hp(44),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
          }}>
          <Image
            source={item.icon}
            style={[
              {
                height: hp(16),
                width: hp(16),
                tintColor: colors.white, // Tint color for active icon
              },
              item.style,
            ]}
            resizeMode={'contain'}
          />
        </LinearGradient>
      ) : (
        // Non-active icon with default background
        <View
          style={{
            height: hp(44),
            width: hp(44),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            backgroundColor: '#F8F8F8',
          }}>
          <Image
            source={item.icon}
            style={[
              {
                height: hp(16),
                width: hp(16),
                tintColor: 'black', // Tint color for non-active icon
              },
              item.style,
            ]}
            resizeMode={'contain'}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const AdminProfileDetailsScreen = ({onEditButtonPress, userData}) => {
  const phaseReducerInitialState = {
    activeIndex: 0,
  };

  const [{activeIndex}, dispatch] = useReducer(
    phaseReducer,
    phaseReducerInitialState,
  );

  const RenderComp = () => AdminDetailsProfile[activeIndex].component(userData);
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
          marginHorizontal: 17,
        }}
        data={AdminDetailsProfile}
        renderItem={({item, index}) =>
          renderIcons({
            item,
            index,
            activeIndex,
            onPressIcon: navigateToScreen,
          })
        }
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          // backgroundColor: 'red',
          marginHorizontal: 17,
        }}>
        <Text
          style={{
            color: colors.black,
            marginTop: hp(25),
            fontSize: fontSize(16),
            lineHeight: hp(26),
            fontFamily: fontFamily.poppins500,
          }}>
          {/*{AdminDetailsProfile[activeIndex].phaseName}*/}
        </Text>
      </View>

      {/*<View style={{alignSelf: 'center', height: hp(1), marginTop: hp(15)}}>*/}
      {/*  <Progress.Bar*/}
      {/*    progress={(activeIndex + 1) / AdminDetailsProfile.length}*/}
      {/*    width={(Dimensions.get('window').width / 100) * 91}*/}
      {/*    color={'#17C270'}*/}
      {/*    borderWidth={0.5}*/}
      {/*    borderColor={colors.gray}*/}
      {/*  />*/}
      {/*</View>*/}

      <RenderComp />
    </SafeAreaView>
  );
};

export default memo(AdminProfileDetailsScreen);
