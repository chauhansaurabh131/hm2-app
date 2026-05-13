import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {useDispatch, useSelector} from 'react-redux';
import {educationDetails} from '../../../actions/homeActions';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';
import {icons} from '../../../assets';

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
  ];

  useEffect(() => {
    if (user?.user?.userEducation?.degree) {
      setDegree(user?.user?.userEducation?.degree);
    }
    if (user?.user?.userEducation?.collage) {
      setCollage(user?.user?.userEducation?.collage);
    }
  }, [user?.user?.userEducation?.degree, user?.user?.userEducation?.collage]);

  const onSubmitPress = () => {
    const convertFirstLetterToLowerCase = str => {
      return str.charAt(0).toLowerCase() + str.slice(1);
    };

    setLoading(true);

    apiDispatch(
      educationDetails(
        {
          degree: degree,
          collage: convertFirstLetterToLowerCase(collage),
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
      {/* Header */}
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
          Education Info
        </Text>
      </View>

      <View
        style={{width: '100%', height: hp(1), backgroundColor: '#E3E3E3'}}
      />

      <View style={{marginTop: hp(20), marginHorizontal: wp(17)}}>
        <NewSelectValueComponent
          title="Select Degree"
          value={degree}
          dropdownData={degreeDropdownData}
          onValueChange={value => {
            setDegree(value);
          }}
          bottomSheetHeight={hp(450)}
        />

        <View style={{marginTop: hp(20)}}>
          <NewEnterSelectValueComponent
            title="College / Uni."
            value={collage}
            emptyText="Add"
            modalTitle="College / Uni."
            EnterModalPlaceholderTittle={'Enter College / Uni.'}
            onValueChange={value => {
              setCollage(value);
            }}
          />
        </View>
      </View>

      <View style={{marginHorizontal: 17, flex: 1}}>
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
              onPress={onSubmitPress}
              activeOpacity={0.6}
              disabled={!degree || !collage} // ✅ disable if either is empty
              style={{
                width: '100%',
                height: hp(50),
                borderRadius: hp(25),
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
