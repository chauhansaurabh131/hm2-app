import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    width: '100%',
    height: hp(218),
  },
  headerTittleStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLogoStyle: {
    width: hp(96),
    height: hp(24),
    resizeMode: 'stretch',
    marginTop: hp(14),
    marginLeft: wp(17),
  },
  profileImageStyle: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    marginTop: hp(14),
    marginRight: hp(18),
    resizeMode: 'stretch',
  },
  headerDescriptionContainer: {
    alignItems: 'center',
    marginTop: hp(50),
  },
  headerTittleTextStyle: {
    color: colors.white,
    fontSize: fontSize(20),
    lineHeight: hp(30),
    fontWeight: '600',
    marginBottom: hp(12),
  },
  headerTittleDescriptionTextStyle: {
    color: colors.white,
    fontSize: fontSize(10),
    lineHeight: hp(15),
    fontWeight: '400',
  },
  itemContainer: {
    marginTop: 10,
    width: wp(340),
    height: hp(91),
    borderRadius: 15,
    marginBottom: 1,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderColor: colors.blue, // Border color
    elevation: 1, // Add shadow
    shadowColor: colors.blue, // Shadow color
    shadowOffset: {width: 0, height: 2}, // Shadow offset
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 2, // Shadow radius
  },
});

export default style;
