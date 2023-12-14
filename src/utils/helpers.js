import {STANDARD_SCREEN_HEIGHT, STANDARD_SCREEN_WIDTH} from './constants';
import {Dimensions, Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const wp = val => {
  const valInPercentage = (val * 100) / STANDARD_SCREEN_WIDTH;
  return widthPercentageToDP(valInPercentage);
};

export const hp = val => {
  const valInPercentage = (val * 100) / STANDARD_SCREEN_HEIGHT;
  return heightPercentageToDP(valInPercentage);
};

export const fontSize = value => RFValue(value, STANDARD_SCREEN_HEIGHT);

export const screenWidth = Dimensions.get('window').width;

export const screenHeight = Dimensions.get('window').height;

export const isAndroid = Platform.OS === 'android';

export const isIOS = Platform.OS === 'ios';

export const fontFamily = {
  inter700: isAndroid ? 'inter_bold' : 'Inter Bold',
  inter600: isAndroid ? 'inter_semi_bold' : 'Inter SemiBold',
  inter500: isAndroid ? 'inter_medium' : 'Inter Medium',
  inter400: isAndroid ? 'inter_regular' : 'Inter Regular',
  bebesneue400: isAndroid ? 'bebasneue_regular' : 'Bebas Neue',
  nunito200: isAndroid ? 'nunito_extra_light' : 'Nunito ExtraLight',
  nunito300: isAndroid ? 'nunito_light' : 'Nunito Light',
  nunito400: isAndroid ? 'nunito_regular' : 'Nunito Regular',
  nunito500: isAndroid ? 'nunito_medium' : 'Nunito Medium',
  nunito600: isAndroid ? 'nunito_semi_bold' : 'Nunito SemiBold',
  nunito700: isAndroid ? 'nunito_bold' : 'Nunito Bold',
  montserrat: 'Montserrat', // New font entry
};
