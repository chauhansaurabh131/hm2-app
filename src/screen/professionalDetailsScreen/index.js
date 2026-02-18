import React, {useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {colors} from '../../utils/colors';
import {hp} from '../../utils/helpers';
import NewEnterSelectValueComponent from '../../components/newEnterSelectValueComponent';
import NewSelectValueComponent from '../../components/newSelectValueComponent';

const ProfessionalsDetailsScreen = ({
  setJobTitle,
  setJobType,
  setCompanyName,
  setSalary,
  setWorkInCity,
  setWorkInCountry,
}) => {
  const jobTypeDropdownData = ['Government', 'Private', 'Retired', 'Homemaker'];
  const jobWorkContryDropdownData = ['India'];
  const anuallSalary = ['1 LPA', '2 LPA', '3 LPA', '5 LPA', '10 LPA'];

  const [selectedDesignationStatus, setSelectedDesignationStatus] =
    useState('');
  const [selectedJobStatus, setSelectedJobStatus] = useState('');
  const [selectedCompanyStatus, setSelectedCompanyStatus] = useState('');
  const [selectedSalaryStatus, setSelectedSalaryStatus] = useState('');
  const [selectedCityStatus, setSelectedCityStatus] = useState('');
  const [selectedCountryStatus, setSelectedCountryStatus] = useState('');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: 17}}>
        <NewEnterSelectValueComponent
          title="Current Designation"
          value={selectedDesignationStatus}
          emptyText="Add"
          modalTitle="Current Designation"
          EnterModalPlaceholderTittle={'Enter Current Designation'}
          onValueChange={value => {
            setSelectedDesignationStatus(value);
            setJobTitle?.(value);
          }}
        />

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Job Type"
            value={selectedJobStatus}
            dropdownData={jobTypeDropdownData}
            onValueChange={value => {
              setSelectedJobStatus(value);
              setJobType?.(value);
            }}
            bottomSheetHeight={hp(250)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewEnterSelectValueComponent
            title="Company"
            value={selectedCompanyStatus}
            emptyText="Add"
            modalTitle="Company"
            EnterModalPlaceholderTittle={'Enter Company Name'}
            onValueChange={value => {
              setSelectedCompanyStatus(value);
              setCompanyName?.(value);
            }}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Annual Salary"
            value={selectedSalaryStatus}
            dropdownData={anuallSalary}
            onValueChange={value => {
              setSelectedSalaryStatus(value);
              setSalary?.(value);
            }}
            bottomSheetHeight={hp(300)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewEnterSelectValueComponent
            title="Work City"
            value={selectedCityStatus}
            emptyText="Add"
            modalTitle="Work City"
            EnterModalPlaceholderTittle={'Enter Work City'}
            onValueChange={value => {
              setSelectedCityStatus(value);
              setWorkInCity?.(value);
            }}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Work Country"
            value={selectedCountryStatus}
            dropdownData={jobWorkContryDropdownData}
            onValueChange={value => {
              setSelectedCountryStatus(value);
              setWorkInCountry?.(value);
            }}
            bottomSheetHeight={hp(100)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfessionalsDetailsScreen;
