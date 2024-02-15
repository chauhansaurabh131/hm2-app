import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {icons, images} from '../../assets';
import style from './style';
import HeaderLogo from '../../components/HeaderLogo';
import {colors} from '../../utils/colors';
import TextInput from '../../components/TextInput';
import {SelectList} from 'react-native-dropdown-select-list/index';
import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';
import {COUNTRY_LIST, CurrentCity} from '../../utils/data';
import CheckBox from 'react-native-check-box';

const AddressDetailsScreen = ({navigation}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [isChecked, setChecked] = useState(false); // Add state for checkbox

  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
        <View style={{marginHorizontal: 15, marginTop: 20}}>
          <Text style={style.textInputHeadingStyle}>
            Current Residing Address
          </Text>

          {/*<TextInput*/}
          {/*  IconNameDesign={icons.profileLogo}*/}
          {/*  placeholder={'Block No, Street '}*/}
          {/*  editable={true}*/}
          {/*  iconSource={icons.profileLogo}*/}
          {/*  containerStyle={style.textInputContainerStyle}*/}
          {/*  inputContainer={style.inputContainer}*/}
          {/*/>*/}

          <TextInput
            placeholder={'Block No, Street '}
            inputContainer={{width: '100%', marginTop: 7}}
          />

          <Text style={style.currentTextHeadingStyle}>Current City</Text>

          {/*<DropDownTextInputComponent*/}
          {/*  data={CurrentCity}*/}
          {/*  placeholder={'select'}*/}
          {/*  searchPlaceholder={'Search Current City...'}*/}
          {/*  placeholderStyle={colors.black}*/}
          {/*/>*/}

          <DropDownTextInputComponent
            placeholder={'select'}
            data={CurrentCity}
            searchPlaceholder={'Search Current City...'}
            placeholderStyle={colors.black}
            height={55}
          />

          <Text style={style.currentResidingTextHeadingStyle}>
            Current Residing Country
          </Text>

          <DropDownTextInputComponent
            data={CurrentCity}
            placeholder={'select'}
            searchPlaceholder={'Search Current City...'}
            placeholderStyle={colors.black}
            height={55}
          />

          <Text style={style.currentAddressTextHeadingStyle}>
            Same as current address
          </Text>

          {/*<TextInput*/}
          {/*  IconNameDesign={icons.profileLogo}*/}
          {/*  placeholder={'Add Your Origin'}*/}
          {/*  editable={true}*/}
          {/*  iconSource={icons.profileLogo}*/}
          {/*  containerStyle={style.textInputContainerStyle}*/}
          {/*  inputContainer={style.inputContainer}*/}
          {/*/>*/}

          <TextInput
            placeholder={'Add Your Origin'}
            inputContainer={{width: '100%', marginTop: 7}}
          />

          <View style={style.checkBoxContainer}>
            {/* CheckBox */}
            <CheckBox
              isChecked={isChecked}
              onClick={() => setChecked(!isChecked)}
              checkBoxColor={colors.blue}
            />

            {/* Text next to CheckBox */}
            <Text style={style.checkBoxTextStyle}>Same as current address</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddressDetailsScreen;
