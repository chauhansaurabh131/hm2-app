import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../../actions/homeActions';

const EditContactScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);
  const [mobileNumber, setMobileNumber] = useState('');
  const [homeNumber, setHomeNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false); // Loader state

  const apiDispatch = useDispatch();

  useEffect(() => {
    if (user?.user?.mobileNumber) {
      setMobileNumber(user?.user?.mobileNumber);
    }
    if (user?.user?.homeMobileNumber) {
      setHomeNumber(user?.user?.homeMobileNumber);
    }
    if (user?.user?.email) {
      setUserEmail(user?.user?.email);
    }
  }, [
    user?.user?.mobileNumber,
    user?.user?.homeMobileNumber,
    user?.user?.email,
  ]);

  const onSubmitPress = () => {
    setLoading(true);
    apiDispatch(
      updateDetails(
        {
          mobileNumber: mobileNumber,
          homeMobileNumber: homeNumber,
          email: userEmail,
        },
        () => {
          setLoading(false);
          navigation.goBack();
        },
      ),
    );
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: 17, flex: 1}}>
        <AppColorLogo />
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(20),
            lineHeight: hp(30),
            fontFamily: fontFamily.poppins600,
            textAlign: 'center',
            marginTop: 10,
          }}>
          Contact Details
        </Text>

        <View style={{marginTop: 30}}>
          <FloatingLabelInput
            label="Mobile Number"
            value={mobileNumber.toString()}
            onChangeText={setMobileNumber}
            showUnit={true}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <FloatingLabelInput
            label="Home Number"
            value={homeNumber.toString()}
            onChangeText={setHomeNumber}
            showUnit={true}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <FloatingLabelInput
            label="Email"
            value={userEmail || 'N/A'}
            // onChangeText={setUserEmail}
          />
        </View>

        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 15,
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={onBackPress}
              activeOpacity={0.7}
              style={{
                width: wp(133),
                height: hp(44),
                borderRadius: 25,
                borderWidth: 1,
                borderColor: colors.black,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  color: colors.black,
                }}>
                Back
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={onSubmitPress}
              style={{
                width: wp(176),
                height: hp(44),
                borderRadius: 30,
                backgroundColor: colors.black,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {loading ? (
                // Show loader if loading is true
                <ActivityIndicator size="large" color={colors.white} />
              ) : (
                <Text
                  style={{
                    color: colors.white,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Submit
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditContactScreen;
