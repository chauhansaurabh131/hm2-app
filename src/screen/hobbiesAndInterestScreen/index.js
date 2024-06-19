import React, {useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import DropDownMutipleValueComponent from '../../components/DropDownMutipleValueComponent';

const HobbiesAndInterestScreen = ({
  selectedCreative,
  setSelectedCreative,
  selectedFun,
  setSelectedFun,
  selectedFitness,
  setSelectedFitness,
}) => {
  // const [selectedCreative, setSelectedCreative] = useState([]);
  // const [selectedFun, setSelectedFun] = useState([]);
  // const [selectedFitness, setSelectedFitness] = useState([]);
  const [selectedValues, setSelectedValues] = useState('');

  const CREATIVE = [
    {label: 'Writing', value: '1'},
    {label: 'Play Instrument', value: '2'},
    {label: 'Game', value: '3'},
    // ... other options
  ];

  const FUN = [
    {label: 'Movie', value: '1'},
    {label: 'Sports', value: '2'},
    // ... other options
  ];

  const FITNESS = [
    {label: 'Running', value: '1'},
    {label: 'Cycling', value: '2'},
    // ... other options
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(14),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(20),
            marginBottom: hp(11),
          }}>
          Creative
        </Text>
        <DropDownMutipleValueComponent
          data={CREATIVE}
          selectedItems={selectedCreative}
          setSelectedItems={setSelectedCreative} // Pass setSelectedCreative function
          height={50}
        />

        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(14),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(15),
            marginBottom: hp(11),
          }}>
          Fun
        </Text>
        <DropDownMutipleValueComponent
          data={FUN}
          selectedItems={selectedFun}
          setSelectedItems={setSelectedFun}
          height={50}
        />

        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(14),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(15),
            marginBottom: hp(11),
          }}>
          Fitness
        </Text>
        <DropDownMutipleValueComponent
          data={FITNESS}
          selectedItems={selectedFitness}
          setSelectedItems={setSelectedFitness}
          height={50}
        />
      </View>
    </SafeAreaView>
  );
};

export default HobbiesAndInterestScreen;
