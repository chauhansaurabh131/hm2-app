import React, {useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {useSelector} from 'react-redux';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import {colors} from '../../utils/colors';
import {hp, wp} from '../../utils/helpers';

const ContactDetailsScreen = ({
  mobileNumbers, // fallback prop
  setMobileNumber,
  homeNumber,
  setHomeNumber,
  setUserEmail,
}) => {
  const {user} = useSelector(state => state.auth);

  const [mobileNumber, updateMobileNumber] = useState('');
  const [email, setLocalEmail] = useState('');

  // Set mobile number and email from Redux or fallback prop
  useEffect(() => {
    const reduxMobile = user?.user?.mobileNumber?.toString();
    const fallbackMobile = mobileNumbers?.toString();

    console.log(' === reduxMobile ===> ', reduxMobile);

    if (reduxMobile) {
      updateMobileNumber(reduxMobile);
      setMobileNumber?.(reduxMobile); // Push it to parent
    } else if (fallbackMobile) {
      updateMobileNumber(fallbackMobile);
      setMobileNumber?.(fallbackMobile);
    }

    if (user?.user?.email) {
      setLocalEmail(user.user.email);
      setUserEmail?.(user.user.email);
    }
  }, [user, mobileNumbers]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <View style={{marginTop: 30}}>
          <FloatingLabelInput
            label="Mobile Number"
            value={mobileNumber}
            onChangeText={text => {
              updateMobileNumber(text);
              setMobileNumber?.(text); // Always update parent
            }}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <FloatingLabelInput
            label="Home Number"
            value={homeNumber}
            onChangeText={setHomeNumber}
            showUnit={true}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <FloatingLabelInput
            label="Email"
            value={email}
            onChangeText={text => {
              setLocalEmail(text);
              setUserEmail?.(text);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ContactDetailsScreen;
