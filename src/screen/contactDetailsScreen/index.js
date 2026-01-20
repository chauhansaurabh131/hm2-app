import React, {useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {useSelector} from 'react-redux';
import {colors} from '../../utils/colors';
import {hp} from '../../utils/helpers';
import NewEnterSelectValueComponent from '../../components/newEnterSelectValueComponent';

const ContactDetailsScreen = ({
  mobileNumbers, // fallback prop
  setMobileNumber,
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
      <NewEnterSelectValueComponent
        title="Mobile Number"
        value={mobileNumber}
        emptyText="Add"
        modalTitle="Mobile Number"
        keyboardTypes="decimal-pad"
        EnterModalPlaceholderTittle={'Enter Mobile Number'}
        onValueChange={value => {
          updateMobileNumber(value);
          setMobileNumber?.(value);
        }}
      />

      <View style={{marginTop: hp(10)}}>
        <NewEnterSelectValueComponent
          title="Email"
          value={email}
          emptyText="Add"
          modalTitle="Email Address"
          EnterModalPlaceholderTittle={'Enter Email'}
          onValueChange={value => {
            setLocalEmail(value);
            setUserEmail?.(value);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ContactDetailsScreen;
