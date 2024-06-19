import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, View} from 'react-native';
import style from './style';
import {colors} from '../../utils/colors';
import CheckBox from 'react-native-check-box';
import {fontFamily, fontSize, hp, isIOS} from '../../utils/helpers';
import TextInputSearchAndDropDowm from '../../components/textInputSearchAndDropDown';
import Toast from 'react-native-toast-message';

const AddressDetailsScreen = ({
  selectCurrentCity,
  setSelectCurrentCity,
  currentResidingAddress,
  setCurrentResidingAddress,
  selectCurrentLiving,
  setSelectCurrentLiving,
}) => {
  const [isChecked, setChecked] = useState(false); // Add state for checkbox
  const [originAddress, setOriginAddress] = useState(''); // Add state for origin address

  const handleCheckboxClick = () => {
    setChecked(!isChecked);
    if (!isChecked) {
      // If checkbox is checked, copy current residing address to origin address
      setOriginAddress(currentResidingAddress);
    } else {
      // If checkbox is unchecked, clear the origin address
      setOriginAddress('');
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
        <View style={{marginHorizontal: 15, marginTop: 20}}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontWeight: '400',
              fontFamily: fontFamily.poppins600,
            }}>
            Current Residing Address
          </Text>

          <TextInput
            placeholder={'Block No, Street '}
            placeholderTextColor={colors.black}
            value={currentResidingAddress}
            onChangeText={setCurrentResidingAddress}
            style={{
              width: '100%',
              height: hp(50),
              borderWidth: 1,
              borderColor: colors.lightGreyBorder,
              padding: 15,
              borderRadius: 10,
              marginTop: hp(9),
              color: colors.black,
            }}
          />

          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontWeight: '400',
              fontFamily: fontFamily.poppins600,
              marginTop: hp(15),
              marginBottom: hp(9),
            }}>
            Current City
          </Text>

          <TextInputSearchAndDropDowm
            placeholder={'Select'}
            value={selectCurrentCity}
            onChangeText={setSelectCurrentCity}
            dropdownItems={[
              'Ahmedabad',
              'Surat',
              'Vadodara',
              'Delhi',
              'Mumbai',
              'Chennai',
              'Kolkata',
              'Bangalore',
            ]}
          />

          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontWeight: '400',
              fontFamily: fontFamily.poppins600,
              marginTop: hp(15),
              marginBottom: hp(9),
            }}>
            Current Residing Country
          </Text>

          <TextInputSearchAndDropDowm
            placeholder={'Select'}
            value={selectCurrentLiving}
            onChangeText={setSelectCurrentLiving}
            dropdownItems={[
              'india',
              'canada',
              'us',
              'afghanistan',
              'Australia',
              'Belize',
              'Brazil',
            ]}
          />

          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins600,
              marginTop: isIOS ? hp(15) : hp(15),
            }}>
            Add Your Origin
          </Text>

          <TextInput
            placeholder={'Add Your Origin'}
            placeholderTextColor={colors.black}
            value={originAddress}
            onChangeText={setOriginAddress}
            style={{
              width: '100%',
              height: hp(50),
              borderWidth: 1,
              borderColor: colors.lightGreyBorder,
              padding: 15,
              borderRadius: 10,
              marginTop: hp(9),
              color: colors.black,
            }}
          />

          <View
            style={{
              width: '100%',
              height: hp(55),
              borderWidth: 1,
              borderRadius: 10,
              borderColor: colors.lightGreyBorder,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: hp(10),
              marginTop: hp(15),
            }}>
            {/* CheckBox */}
            <CheckBox
              isChecked={isChecked}
              onClick={handleCheckboxClick}
              checkBoxColor={colors.blue}
            />

            {/* Text next to CheckBox */}
            <Text
              style={{
                marginLeft: hp(10),
                color: colors.black,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontWeight: '400',
                fontFamily: fontFamily.poppins500,
              }}>
              Same as current address
            </Text>
          </View>
        </View>
      </ScrollView>
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default AddressDetailsScreen;
