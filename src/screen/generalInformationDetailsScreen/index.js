import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import style from './style';
import {colors} from '../../utils/colors';
import {hp, wp} from '../../utils/helpers';
import MyTextInput from '../../components/TextInput';
import {icons} from '../../assets';
import {
  CASTE_LIST,
  COUNTRY_LIST,
  CurrentCity,
  RELIGION_LIST,
} from '../../utils/data';
import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';

const GeneralInformationDetailsScreen = () => {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleGenderSelection = gender => {
    setSelectedGender(gender);
  };

  const getGradientColors = gender => {
    if (selectedGender === gender) {
      return {
        colors: ['#0D4EB3', '#9413D0'],
        textColor: 'white',
      };
    }
    return {
      colors: ['transparent', 'transparent'],
      textColor: 'black',
    };
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={style.bodyContainerStyle}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={style.fillUpTextStyle}>Give us your name as per ID</Text>

          <TextInput
            placeholder={'First Name'}
            style={style.textInputBodyStyle}
            placeholderTextColor={colors.black}
          />

          <TextInput
            placeholder={'Last Name'}
            style={[style.textInputBodyStyle, {marginTop: hp(13)}]}
            placeholderTextColor={colors.black}
          />

          <Text style={style.fillUpTextStyle}>Gender</Text>

          <View style={style.selectedGenderContainer}>
            {['Male', 'Female', 'Other'].map(gender => (
              <TouchableOpacity
                key={gender}
                activeOpacity={0.5}
                style={[
                  style.selectedGenderBodyStyle,
                  {borderWidth: selectedGender === gender ? 0 : 1},
                ]}
                onPress={() => handleGenderSelection(gender)}>
                <LinearGradient
                  colors={getGradientColors(gender).colors}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={style.selectedGenderGradientColorStyle}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: getGradientColors(gender).textColor,
                    }}>
                    {gender}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={style.fillUpTextStyle}>Date of Birth</Text>

          <View style={style.DOBContainer}>
            <TextInput
              placeholder={'18.08.1992'}
              keyboardType={'numeric'}
              placeholderTextColor={colors.black}
              style={{flex: 1}}
            />
            <TouchableOpacity style={style.DOBContainerStyle}>
              <Image source={icons.calendar_icon} style={style.DOBImageStyle} />
            </TouchableOpacity>
          </View>

          <Text style={style.fillUpTextStyle}>Birth of Time</Text>

          <View style={style.BOTContainer}>
            <TextInput
              placeholder={'HH'}
              keyboardType={'numeric'}
              placeholderTextColor={colors.black}
              style={style.BOTContainerBody}
            />

            <TextInput
              placeholder={'MM'}
              keyboardType={'numeric'}
              placeholderTextColor={colors.black}
              style={style.BOTContainerBody}
            />

            <TextInput
              placeholder={'SS'}
              keyboardType={'numeric'}
              placeholderTextColor={colors.black}
              style={style.BOTContainerBody}
            />
          </View>

          <Text style={style.fillUpTextStyle}>Religion</Text>

          <DropDownTextInputComponent
            placeholder={'Select or Type'}
            data={RELIGION_LIST}
            height={50}
          />

          <Text style={style.fillUpTextStyle}>Caste / Sub Caste</Text>

          <DropDownTextInputComponent
            placeholder={'Type'}
            data={CASTE_LIST}
            height={50}
          />

          <Text style={style.fillUpTextStyle}>Current City</Text>

          <DropDownTextInputComponent
            placeholder={'Type'}
            data={CurrentCity}
            height={50}
          />

          <Text style={style.fillUpTextStyle}>Country of Living</Text>

          <DropDownTextInputComponent
            placeholder={'Type'}
            data={COUNTRY_LIST}
            height={50}
          />

          <Text style={style.fillUpTextStyle}>Write About Yourself</Text>

          <TextInput
            numberOfLines={10}
            multiline={true}
            placeholderTextColor={colors.black}
            style={style.descriptionContainer}
          />

          <View style={{marginBottom: 100}} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default GeneralInformationDetailsScreen;
