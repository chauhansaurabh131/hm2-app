import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainerView: {
    marginHorizontal: wp(17),
    // backgroundColor: 'lightgreen',
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
  headerTittleStyle: {
    marginTop: hp(31),
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
    // backgroundColor: 'grey',
  },
  underLineHeaderStyle: {
    width: '100%',
    // height: 1,
    borderWidth: 0.7,
    borderColor: '#F2F2F2',
    // borderColor: 'red',
    marginTop: hp(12),
  },
  bodyDescriptionStyle: {
    flex: 1,
    marginHorizontal: wp(17),
    marginTop: hp(19),
    marginBottom: 15,
    // backgroundColor: 'red',

    // backgroundColor: 'gray',
  },
  bodyDescription: {
    flexDirection: 'row',
    // backgroundColor: 'orange',
  },
  credentialsIconStyle: {
    width: hp(17.29),
    height: hp(14),
    resizeMode: 'contain',
    alignItems: 'center',
    top: 4,
  },
  credentialTittleContainer: {
    marginLeft: hp(10),
  },
  sideArrowImageStyle: {
    position: 'absolute',
    right: 0,
    width: hp(6.02),
    height: hp(10.62),
    top: 4,
    tintColor: '#D8D8D8',
  },
  credentialTittleText: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
  },
  credentialDescriptionTextStyle: {
    color: colors.black,
    marginTop: hp(9),
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    marginRight: 17,
  },

  descriptionBodyUnderlineStyle: {
    width: '100%',
    borderWidth: 0.7,
    borderColor: '#F2F2F2',
    // marginTop: hp(15),
  },
  deleteProfileIconStyle: {
    width: hp(21.2),
    height: hp(14),
    resizeMode: 'contain',
    top: 4,
  },

  privacyIconStyle: {
    width: hp(10.97),
    height: hp(14),
    resizeMode: 'contain',
    top: 4,
  },

  emailSmsIconStyle: {
    width: hp(14),
    height: hp(14),
    resizeMode: 'contain',
    top: 4,
    tintColor: 'black',
  },
});

export default style;
