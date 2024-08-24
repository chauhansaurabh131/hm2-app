import {StyleSheet} from 'react-native';
import {fontSize, hp, isIOS} from '../utils/helpers';

export const style = StyleSheet.create({
  CustomTabBarButtonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
    height: hp(65),
    width: hp(60),
    marginTop: 5,
  },
  CustomTabBarButtonLinearGradient: {
    borderRadius: 10,
    padding: 5,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabNavigationContainer: {
    height: isIOS ? hp(100) : hp(80),
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  bottomTabTextStyle: {
    fontSize: fontSize(10),
    lineHeight: hp(15),
    fontWeight: '500',
  },
  upgradeIconStyle: {
    width: hp(20.98),
    height: hp(20),
  },
  alertIconStyle: {
    width: hp(16.1),
    height: hp(20),
  },
  chatIconStyle: {
    width: hp(20.5),
    height: hp(20),
  },
  matchesIconStyle: {
    width: hp(22.5),
    height: hp(20),
  },
});
