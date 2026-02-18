import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {colors} from '../../utils/colors';
import {hp} from '../../utils/helpers';
import NewSelectValueComponent from '../../components/newSelectValueComponent';
import NewEnterSelectValueComponent from '../../components/newEnterSelectValueComponent';

const EducationDetailsScreen = ({setDegree, collage, setCollage}) => {
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

  const [selectedDegreeStatus, setSelectedDegreeStatus] = useState('');
  const [selectedCollegeStatus, setSelectedCollegeStatus] = useState('');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: 17}}>
        <NewSelectValueComponent
          title="Select Degree"
          value={selectedDegreeStatus}
          dropdownData={degreeDropdownData}
          onValueChange={value => {
            setSelectedDegreeStatus(value);
            setDegree?.(value);
          }}
          bottomSheetHeight={hp(450)}
        />

        <View style={{marginTop: hp(10)}}>
          <NewEnterSelectValueComponent
            title="College / Uni."
            value={selectedCollegeStatus}
            emptyText="Add"
            modalTitle="College / Uni."
            EnterModalPlaceholderTittle={'Enter College / Uni.'}
            onValueChange={value => {
              setSelectedCollegeStatus(value);
              setCollage?.(value);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EducationDetailsScreen;
