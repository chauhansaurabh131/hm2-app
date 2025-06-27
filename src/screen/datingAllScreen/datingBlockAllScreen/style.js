import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainerView: {
    marginHorizontal: wp(17),
    marginTop: hp(14),
  },
  headerContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerHeaderImage: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
  },
  profileImageStyle: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
  },
  headingTittleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(31),
    // backgroundColor: 'orange',
    justifyContent: 'space-between',
  },
  headingCredentialsText: {
    // marginLeft: wp(12.8),
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins600,
    color: colors.black,
  },
  backButtonIconStyle: {
    width: hp(14),
    height: hp(14),
    marginRight: hp(5),
  },
  underLineHeaderStyle: {
    width: '100%',
    marginTop: hp(12),
    height: 1,
    backgroundColor: '#E7E7E7',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 17,
    justifyContent: 'space-between',
  },
  renderBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renderUserProfile: {
    width: hp(47),
    height: hp(47),
    borderRadius: 25,
    marginRight: 15,
  },
  renderNoProfileText: {
    fontSize: fontSize(16),
    color: colors.black,
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins600,
  },
  unblockButton: {
    width: hp(77),
    height: hp(26),
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  unblockText: {
    color: colors.black,
    fontSize: fontSize(13),
  },
});
