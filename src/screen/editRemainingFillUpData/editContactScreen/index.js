import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../../actions/homeActions';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';
import {icons} from '../../../assets';

const EditContactScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);
  const [mobileNumber, setMobileNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false); // Loader state

  const apiDispatch = useDispatch();

  useEffect(() => {
    if (user?.user?.mobileNumber) {
      setMobileNumber(user?.user?.mobileNumber);
    }

    if (user?.user?.email) {
      setUserEmail(user?.user?.email);
    }
  }, [user?.user?.mobileNumber, user?.user?.email]);

  // const isDisabled = !mobileNumber?.trim() || !userEmail?.trim();

  const onSubmitPress = () => {
    setLoading(true);
    apiDispatch(
      updateDetails(
        {
          mobileNumber: mobileNumber,
          email: userEmail,
        },
        () => {
          setLoading(false);
          navigation.goBack();
        },
      ),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{flex: 1}}>
        <View
          style={{
            height: hp(50),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              left: 0,
              width: wp(50),
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={icons.back_arrow_icon}
              style={{
                width: hp(14),
                height: hp(14),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins600,
            }}>
            Contact Info
          </Text>
        </View>

        <View
          style={{width: '100%', height: hp(1), backgroundColor: '#E3E3E3'}}
        />

        <View style={{marginTop: hp(30), marginHorizontal: wp(17)}}>
          <NewEnterSelectValueComponent
            title="Mobile Number"
            value={mobileNumber}
            emptyText="Add"
            modalTitle="Mobile Number"
            keyboardTypes="decimal-pad"
            maxLength={10}
            EnterModalPlaceholderTittle={'Enter Mobile Number'}
            onValueChange={value => {
              setMobileNumber?.(value);
            }}
          />
        </View>

        <View style={{marginTop: hp(37), marginHorizontal: wp(17)}}>
          <NewEnterSelectValueComponent
            title="Email"
            value={userEmail}
            emptyText="Add"
            modalTitle="Email Address"
            EnterModalPlaceholderTittle={'Enter Email'}
            onValueChange={value => {
              setUserEmail(value);
            }}
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
              paddingHorizontal: wp(17),
            }}>
            {/* Submit Button */}
            <TouchableOpacity
              onPress={onSubmitPress}
              style={{
                width: '100%',
                height: hp(50),
                borderRadius: hp(25),
                backgroundColor: colors.black,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
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
