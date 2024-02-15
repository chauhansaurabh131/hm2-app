import React, {useState} from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import DemoScreen from '../../screen/demoScreen';
import LinearGradient from 'react-native-linear-gradient';

const NumberRegistrationTextInput = ({onPress, whiteBackground}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ['+92', '+93', '+94', '+95', '+96'];
  const handleSelect = option => {
    setSelectedOption(option);
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Image
          source={require('../../assets/icons/profile_logo.png')}
          style={styles.image}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Mobile Number"
          placeholderTextColor={colors.black}
        />
      </View>

      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <LinearGradient
          colors={
            whiteBackground ? ['#FFFFFF', '#FFFFFF'] : ['#0D4EB3', '#9413D0']
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{
            height: hp(50),
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: hp(100),
            borderRadius: hp(10),
          }}>
          <Text
            style={{
              fontSize: fontSize(16),
              lineHeight: hp(21),
              fontWeight: '400',
              fontFamily: fontFamily.nunito400,
              color: colors.white,
            }}>
            Send Code
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.numberNumberContainer}>
        <DemoScreen
          options={options}
          onSelect={handleSelect}
          dropdownButton={styles.dropdownButton}
        />

        <TextInput
          style={styles.textInputNumber}
          placeholder="Enter Mobile Number"
          keyboardType="numeric"
          placeholderTextColor={colors.black}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(50),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 10,
    padding: hp(10),
    height: hp(50),
  },
  image: {
    width: hp(17.5),
    height: hp(16),
    marginRight: 8,
    resizeMode: 'stretch',
  },
  input: {
    height: hp(40),
    width: wp(270),
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    marginLeft: hp(5),
    fontWeight: '400',
    fontFamily: fontFamily.nunito400,
  },
  textInputNumber: {
    flex: 1,
    height: hp(50),
    width: wp(199),
    borderWidth: hp(1),
    borderColor: colors.blue,
    marginLeft: wp(18),
    paddingHorizontal: hp(10),
    borderRadius: hp(10),
  },
  dropdownButton: {
    borderRadius: hp(10),
  },
  numberNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: isIOS ? hp(-125) : hp(-125),
  },
  buttonTextStyle: {
    fontSize: fontSize(16),
    lineHeight: hp(21),
    fontWeight: '400',
    fontFamily: fontFamily.nunito400,
    color: colors.white,
  },
});

export default NumberRegistrationTextInput;
