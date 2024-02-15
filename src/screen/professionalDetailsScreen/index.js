import React from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, View} from 'react-native';
import {colors} from '../../utils/colors';
import style from './style';
import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';
import {ANNUAL_SALARY, COUNTRY_LIST, RELIGION_LIST} from '../../utils/data';
import {hp} from '../../utils/helpers';

const ProfessionalsDetailsScreen = () => {
  return (
    <SafeAreaView style={style.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.containerBodyStyle}>
          <Text style={style.headingTittleText}>
            Current Designation (Job Title)
          </Text>

          <TextInput
            placeholder={'Type'}
            style={style.textInputBodyStyle}
            placeholderTextColor={colors.black}
          />

          <Text style={style.textInputDropdownTextTittleBodyStyle}>
            Job Type
          </Text>

          <DropDownTextInputComponent
            placeholder={'Select or Type'}
            data={RELIGION_LIST}
            height={50}
          />

          <Text style={style.headingTittleText}>Company Name</Text>

          <TextInput
            placeholder={'Enter Name Here'}
            style={style.textInputBodyStyle}
            placeholderTextColor={colors.black}
          />

          <Text style={style.textInputDropdownTextTittleBodyStyle}>
            Annual Salary
          </Text>

          <DropDownTextInputComponent
            placeholder={'10,000 To 15,000'}
            data={ANNUAL_SALARY}
            height={50}
          />

          <Text style={style.textInputDropdownTextTittleBodyStyle}>
            Work In City
          </Text>

          <DropDownTextInputComponent
            placeholder={'Select or Type'}
            data={COUNTRY_LIST}
            height={50}
          />

          <Text style={style.textInputDropdownTextTittleBodyStyle}>
            Work In Country
          </Text>

          <DropDownTextInputComponent
            placeholder={'Select or Type'}
            data={COUNTRY_LIST}
            height={50}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfessionalsDetailsScreen;
