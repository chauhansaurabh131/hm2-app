import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {colors} from '../../../utils/colors';
import {hp, wp} from '../../../utils/helpers';
import {useSelector} from 'react-redux';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';

const DatingLocationScreen = ({
  mobileNumbers,
  setMobileNumber,
  setUserEmail,
}) => {
  const {user} = useSelector(state => state.auth);

  const [mobileNumber, updateMobileNumber] = useState('');
  const [email, setLocalEmail] = useState('');

  useEffect(() => {
    const reduxMobile = user?.user?.mobileNumber?.toString();
    const fallbackMobile = mobileNumbers?.toString();

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
      <View style={{height: hp(10)}} />

      <View style={{marginHorizontal: 17}}>
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
      </View>

      {/*<View style={{marginHorizontal: wp(17)}}>*/}
      {/*  <ScrollView showsVerticalScrollIndicator={false}>*/}
      {/*    <View style={{height: 50}} />*/}
      {/*  </ScrollView>*/}
      {/*</View>*/}
    </SafeAreaView>
  );
};

export default DatingLocationScreen;
