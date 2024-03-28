import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import style from './style';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';
import {RELIGION_LIST} from '../../utils/data';
import DropDownMutipleValueComponent from '../../components/DropDownMutipleValueComponent';

const HobbiesAndInterestScreen = () => {
  const CREATIVE = [
    {label: 'Writing', value: '1'},
    {label: 'Play Instrument', value: '2'},
    {label: 'Poetry', value: '3'},
    {label: 'Cooking', value: '4'},
    {label: 'Painting', value: '5'},
    {label: 'Gardening', value: '6'},
    {label: 'Singing', value: '7'},
    {label: 'DIY Crafts', value: '8'},
    {label: 'Blogging', value: '9'},
    {label: 'Photography', value: '10'},
    {label: 'Dancing', value: '11'},
    {label: 'Content Creation', value: '12'},
  ];

  const Fun = [
    {label: 'Movie', value: '1'},
    {label: 'Sports', value: '2'},
    {label: 'Biking', value: '3'},
    {label: 'Music', value: '4'},
    {label: 'Social Media', value: '5'},
    {label: 'Clubbing', value: '6'},
    {label: 'Travelling', value: '7'},
    {label: 'Gaming', value: '8'},
    {label: 'Shopping', value: '9'},
    {label: 'Reading', value: '10'},
    {label: 'Binge-Watching', value: '11'},
    {label: 'Theater & Events', value: '12'},
  ];

  const Fitness = [
    {label: 'Running', value: '1'},
    {label: 'Cycling', value: '2'},
    {label: 'Yoga', value: '3'},
    {label: 'Walking', value: '4'},
    {label: 'Working Out', value: '5'},
    {label: 'Trekking', value: '6'},
    {label: 'Aerobics/Zumba', value: '7'},
    {label: 'Swimming', value: '8'},
    {label: 'Swimming', value: '9'},
  ];

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsFun, setSelectedItemsFun] = useState([]);
  const [selectedItemsFitness, setSelectedItemsFitness] = useState([]);

  const maxSelectionCount = 5;

  const totalSelectedCount =
    selectedItems.length +
    selectedItemsFun.length +
    selectedItemsFitness.length;

  const toggleItemSelection = value => {
    const updatedSelection = [...selectedItems];
    const index = updatedSelection.indexOf(value);

    if (index === -1) {
      // Item not selected, add it to the selection
      updatedSelection.push(value);
    } else {
      // Item selected, remove it from the selection
      updatedSelection.splice(index, 1);
    }

    setSelectedItems(updatedSelection);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => toggleItemSelection(item.value)}
      style={{
        flex: 1,
        margin: 10,
        justifyContent: 'center',
        backgroundColor: selectedItems.includes(item.value)
          ? '#0F52BA'
          : '#F7F7F7',
        height: hp(30),
        width: wp(109),
        borderRadius: 5,
        marginLeft: 1,
        marginRight: 1,
        marginTop: -3,
      }}>
      <Text
        style={{
          fontSize: fontSize(11),
          lineHeight: hp(16.5),
          fontFamily: fontFamily.poppins400,
          marginLeft: wp(5),
          color: selectedItems.includes(item.value) ? 'white' : 'black',
        }}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const toggleItemSelectionFun = value => {
    const updatedSelectionFun = [...selectedItemsFun];
    const index = updatedSelectionFun.indexOf(value);

    if (index === -1) {
      updatedSelectionFun.push(value);
    } else {
      updatedSelectionFun.splice(index, 1);
    }

    setSelectedItemsFun(updatedSelectionFun);
  };

  const renderItemFun = ({item}) => (
    <TouchableOpacity
      onPress={() => toggleItemSelectionFun(item.value)}
      style={{
        flex: 1,
        margin: 10,
        justifyContent: 'center',
        backgroundColor: selectedItemsFun.includes(item.value)
          ? '#0F52BA'
          : '#F7F7F7',
        height: hp(30),
        width: wp(109),
        borderRadius: 5,
        marginLeft: 1,
        marginRight: 1,
        marginTop: -3,
      }}>
      <Text
        style={{
          fontSize: fontSize(11),
          lineHeight: hp(16.5),
          fontFamily: fontFamily.poppins400,
          marginLeft: wp(5),
          color: selectedItemsFun.includes(item.value) ? 'white' : 'black',
        }}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const toggleItemSelectionFitness = value => {
    const updatedSelectionFitness = [...selectedItemsFitness];
    const index = updatedSelectionFitness.indexOf(value);

    if (index === -1) {
      // Item not selected, add it to the selection
      updatedSelectionFitness.push(value);
    } else {
      // Item selected, remove it from the selection
      updatedSelectionFitness.splice(index, 1);
    }

    setSelectedItemsFitness(updatedSelectionFitness);
  };

  const renderItemFitness = ({item}) => (
    <TouchableOpacity
      onPress={() => toggleItemSelectionFitness(item.value)}
      style={{
        flex: 1,
        margin: 10,
        justifyContent: 'center',
        backgroundColor: selectedItemsFitness.includes(item.value)
          ? '#0F52BA'
          : '#F7F7F7',
        height: hp(30),
        width: wp(30),
        borderRadius: 5,
        marginLeft: 1,
        marginRight: 1,
        marginTop: -3,
      }}>
      <Text
        style={{
          fontSize: fontSize(11),
          lineHeight: hp(16.5),
          fontFamily: fontFamily.poppins400,
          marginLeft: wp(5),
          color: selectedItemsFitness.includes(item.value) ? 'white' : 'black',
        }}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        {/*<View*/}
        {/*  style={{*/}
        {/*    flexDirection: 'row',*/}
        {/*    justifyContent: 'space-between',*/}
        {/*    marginTop: hp(15),*/}
        {/*    alignItems: 'center',*/}
        {/*  }}>*/}
        {/*  <Text*/}
        {/*    style={{*/}
        {/*      color: colors.black,*/}
        {/*      fontSize: fontSize(14),*/}
        {/*      lineHeight: hp(21),*/}
        {/*      fontFamily: fontFamily.poppins400,*/}
        {/*    }}>*/}
        {/*    Creative*/}
        {/*  </Text>*/}
        {/*  <Text*/}
        {/*    style={{*/}
        {/*      color: colors.black,*/}
        {/*      fontSize: fontSize(11),*/}
        {/*      lineHeight: hp(16.5),*/}
        {/*      fontFamily: fontFamily.poppins400,*/}
        {/*    }}>*/}
        {/*    Selected: {selectedItems.length}/5*/}
        {/*  </Text>*/}
        {/*</View>*/}
        {/*<FlatList*/}
        {/*  data={CREATIVE}*/}
        {/*  renderItem={renderItem}*/}
        {/*  keyExtractor={item => item.value}*/}
        {/*  numColumns={3}*/}
        {/*  columnWrapperStyle={{top: 5}}*/}
        {/*/>*/}

        {/*<Text*/}
        {/*  style={{*/}
        {/*    color: colors.black,*/}
        {/*    fontSize: fontSize(14),*/}
        {/*    lineHeight: hp(21),*/}
        {/*    fontFamily: fontFamily.poppins400,*/}
        {/*    marginTop: hp(10),*/}
        {/*    marginBottom: hp(4),*/}
        {/*  }}>*/}
        {/*  Fun*/}
        {/*</Text>*/}

        {/*<FlatList*/}
        {/*  data={Fun}*/}
        {/*  renderItem={renderItemFun}*/}
        {/*  keyExtractor={item => item.value}*/}
        {/*  numColumns={3}*/}
        {/*  columnWrapperStyle={{top: 5}}*/}
        {/*/>*/}

        {/*<Text*/}
        {/*  style={{*/}
        {/*    color: colors.black,*/}
        {/*    fontSize: fontSize(14),*/}
        {/*    lineHeight: hp(21),*/}
        {/*    fontFamily: fontFamily.poppins400,*/}
        {/*    marginTop: hp(10),*/}
        {/*  }}>*/}
        {/*  Fitness*/}
        {/*</Text>*/}

        {/*<FlatList*/}
        {/*  data={Fitness}*/}
        {/*  renderItem={renderItemFitness}*/}
        {/*  keyExtractor={item => item.value}*/}
        {/*  numColumns={3}*/}
        {/*  columnWrapperStyle={{top: 5}}*/}
        {/*/>*/}

        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(14),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins500,
            marginTop: hp(31),
            marginBottom: hp(11),
          }}>
          Creative
        </Text>

        <DropDownMutipleValueComponent data={CREATIVE} height={50} />

        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(14),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins500,
            marginTop: hp(20),
            marginBottom: hp(11),
          }}>
          Fun
        </Text>

        <DropDownMutipleValueComponent data={Fun} height={50} />

        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(14),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins500,
            marginTop: hp(20),
            marginBottom: hp(11),
          }}>
          Fitness
        </Text>

        <DropDownMutipleValueComponent data={Fitness} height={50} />
      </View>
    </SafeAreaView>
  );
};

export default HobbiesAndInterestScreen;
