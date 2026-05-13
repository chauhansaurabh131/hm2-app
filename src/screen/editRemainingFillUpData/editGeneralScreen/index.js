import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import NewDropDownTextInput from '../../../components/newDropdownTextinput';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import {useDispatch, useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import {style} from '../../adminProfileDetailsScreen/adminGeneralInformationScreen/style';
import LinearGradient from 'react-native-linear-gradient';
import {icons} from '../../../assets';
import {updateDetails} from '../../../actions/homeActions';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';

const EditGeneralScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);

  console.log(' === var--------- ===> ', user?.user?.religion);

  const apiDispatch = useDispatch();

  const [selectedHeightStatus, setSelectedHeightStatus] = useState('');
  const [selectedWeightStatus, setSelectedWeightStatus] = useState('');
  const [selectedCasteStatus, setSelectedCasteStatus] = useState('');
  const [selectedReligionStatus, setSelectedReligionStatus] = useState('');
  const [description, setDescription] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (user?.user?.height) {
      setSelectedHeightStatus(user.user.height.toString());
    }
    if (user?.user?.weight) {
      setSelectedWeightStatus(user.user.weight.toString());
    }
    if (user?.user?.caste) {
      setSelectedCasteStatus(user.user.caste.toString());
    }
    if (user?.user?.religion) {
      setSelectedReligionStatus(user.user.religion.toString());
    }
  }, [user]);

  const religionDropdownData = [
    'Hindu',
    'Muslim',
    'Christian',
    'Sikh',
    'Buddhist',
    'Jain',
    'Islam',
    'Other',
  ];

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onSubmitPress = () => {
    navigation.goBack();

    apiDispatch(
      updateDetails(
        {
          height: selectedHeightStatus,
          weight: selectedWeightStatus,
          caste: selectedCasteStatus.toLowerCase(),
          religion: selectedReligionStatus.toLowerCase(),
          writeBoutYourSelf: description,

          // writeBoutYourSelf: aboutText,
        },
        () => {
          navigation.goBack();
        },
      ),
    );
  };

  const capitalizeFirstLetter = text => {
    if (!text) {
      return text;
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{flex: 1}}>
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
            Basic Info
          </Text>
        </View>

        <View
          style={{width: '100%', height: hp(1), backgroundColor: '#E3E3E3'}}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginHorizontal: wp(17)}}>
          <View style={{marginTop: hp(20)}}>
            <NewEnterSelectValueComponent
              title="Height"
              value={selectedHeightStatus}
              emptyText="Add"
              modalTitle="Height"
              modalEgTitle="(e.g 5.3ft)"
              keyboardTypes="decimal-pad"
              onValueChange={value => {
                setSelectedHeightStatus(value);
              }}
            />
          </View>

          <View style={{marginTop: hp(15)}}>
            <NewEnterSelectValueComponent
              title="Weight"
              value={selectedWeightStatus}
              emptyText="Add"
              modalTitle="Weight"
              modalEgTitle="(e.g 60 kg)"
              keyboardTypes="decimal-pad"
              EnterModalPlaceholderTittle={'Enter Weight'}
              onValueChange={value => {
                setSelectedWeightStatus(value);
              }}
            />
          </View>

          <View style={{marginTop: hp(15)}}>
            <NewEnterSelectValueComponent
              title="Caste"
              value={capitalizeFirstLetter(selectedCasteStatus)}
              emptyText="Add"
              modalTitle="Caste"
              EnterModalPlaceholderTittle={'Add Caste'}
              onValueChange={value => {
                setSelectedCasteStatus(value);
              }}
            />

            <View style={{marginTop: hp(15)}}>
              <NewSelectValueComponent
                title="Religion"
                value={capitalizeFirstLetter(selectedReligionStatus)}
                dropdownData={religionDropdownData}
                onValueChange={value => {
                  setSelectedReligionStatus(value);
                }}
                bottomSheetHeight={hp(450)}
              />
            </View>

            <View style={{marginTop: hp(20)}}>
              <Text
                style={{
                  color: 'gray',
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins500,
                  marginBottom: hp(10),
                }}>
                About Yourself
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Write About Yourself..."
                placeholderTextColor={'gray'}
                multiline
                numberOfLines={5}
                textAlignVertical="top" // 🔥 very important for Android
                style={{
                  height: hp(230),
                  borderWidth: 1,
                  borderColor: '#B1B1B1',
                  borderRadius: 8,
                  fontSize: fontSize(16),
                  padding: 10,
                  backgroundColor: '#fff',
                  fontWeight: '800',
                  fontFamily: 'inter',
                  color: colors.pureBlack,
                }}
              />
            </View>
          </View>

          <View style={{height: 150}} />
        </ScrollView>

        {!isKeyboardVisible && (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              bottom: 15,
              width: '100%',
              backgroundColor: 'white',
              height: 70,
              paddingHorizontal: wp(17),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={onSubmitPress}
                style={{
                  width: '100%',
                  height: hp(50),
                  borderRadius: hp(50),
                  backgroundColor: colors.black,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EditGeneralScreen;
