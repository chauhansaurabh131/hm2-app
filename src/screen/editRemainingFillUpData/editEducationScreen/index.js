import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import NewDropDownTextInput from '../../../components/newDropdownTextinput';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import {useDispatch, useSelector} from 'react-redux';
import {educationDetails} from '../../../actions/homeActions';

const EditEducationScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);

  const apiDispatch = useDispatch();

  const [degree, setDegree] = useState('');
  const [collage, setCollage] = useState('');
  const [loading, setLoading] = useState(false); // Loader state

  const degreeDropdownData = [
    'Bachelors Arts',
    'Science',
    'Commerce',
    'B Phil',
    'Bachelors Engineering',
    'Computers',
    'BCA',
    'MCA',
    'BBA',
    'BSC',
    'MSC',
    'Diploma',
    'Higher Secondary',
    'Secondary',
    'Legal BL',
    'ML',
    'LLB',
    'LLM',
    'Management BBA',
    'MBA',
    'Masters Arts',
    'Masters Science',
    'Masters Commerce',
    'M Phil',
    'Masters Engineering',
    'Computers (Masters)',
    'Medicine General',
    'Dental',
    'Surgeon',
    'Ph.D',
    'IAS',
    'IPS',
    'IRS',
    'IES',
    'IF',
  ];

  // Dynamic height assignment based on dropdown type
  const getDropdownHeight = dropdownType => {
    switch (dropdownType) {
      case 'Degree':
        return hp(500); // Set height for gender dropdown
      default:
        return hp(300); // Default height
    }
  };

  useEffect(() => {
    if (user?.user?.userEducation?.degree) {
      setDegree(user?.user?.userEducation?.degree);
    }
    if (user?.user?.userEducation?.collage) {
      setCollage(user?.user?.userEducation?.collage);
    }
  }, [user?.user?.userEducation?.degree, user?.user?.userEducation?.collage]);

  const onSubmitPress = () => {
    setLoading(true);
    apiDispatch(
      educationDetails(
        {
          degree: degree,
          collage: collage,
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
          Education Details
        </Text>

        <View style={{marginTop: hp(30)}}>
          <NewDropDownTextInput
            placeholder="Degree"
            dropdownData={degreeDropdownData}
            onValueChange={setDegree}
            value={degree}
            bottomSheetHeight={getDropdownHeight('Degree')} // Dynamic height
          />
        </View>

        <View style={{marginTop: hp(50)}}>
          <FloatingLabelInput
            label="College/University"
            value={collage}
            onChangeText={setCollage}
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

            <TouchableOpacity
              onPress={onSubmitPress}
              activeOpacity={0.6}
              disabled={!degree || !collage} // ✅ disable if either is empty
              style={{
                width: wp(176),
                height: hp(44),
                borderRadius: 30,
                backgroundColor:
                  !degree || !collage ? colors.gray : colors.black, // ✅ grey when disabled
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {loading ? (
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

export default EditEducationScreen;
