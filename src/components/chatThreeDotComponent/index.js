import React from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {icons} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const ChatThreeDotComponent = ({onViewProfilePress}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Menu>
        <MenuTrigger>
          <Image
            source={icons.three_dots_icon} // Replace with your three-dot icon
            style={{width: 25, height: 25}}
          />
        </MenuTrigger>
        <MenuOptions customStyles={optionsStyles}>
          {/*<MenuOption onSelect={() => alert('Option 1')}>*/}
          <MenuOption onSelect={onViewProfilePress}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: wp(10),
              }}>
              <Image
                source={icons.view_profile_icon}
                style={{width: hp(16), height: hp(16), resizeMode: 'contain'}}
              />
              <Text
                style={{
                  padding: 5,
                  color: colors.black,
                  marginLeft: wp(10),
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  fontFamily: fontFamily.poppins400,
                }}>
                View Profile
              </Text>
            </View>
          </MenuOption>

          <MenuOption onSelect={() => alert('Option 2')}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: wp(10),
              }}>
              <Image
                source={icons.block_icon}
                style={{width: hp(16), height: hp(16), resizeMode: 'contain'}}
              />
              <Text
                style={{
                  padding: 5,
                  color: colors.black,
                  marginLeft: wp(10),
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  fontFamily: fontFamily.poppins400,
                }}>
                Block
              </Text>
            </View>
          </MenuOption>

          <MenuOption onSelect={() => alert('Option 3')}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: wp(10),
              }}>
              <Image
                source={icons.report_icon}
                style={{width: hp(16), height: hp(16), resizeMode: 'contain'}}
              />
              <Text
                style={{
                  padding: 5,
                  color: colors.black,
                  marginLeft: wp(10),
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  fontFamily: fontFamily.poppins400,
                }}>
                Report
              </Text>
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default ChatThreeDotComponent;
const optionsStyles = {
  optionsContainer: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    marginTop: 15,
  },
};
