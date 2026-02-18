import React, {useState} from 'react';
import {
  Image,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import CommonGradientButton from '../../components/commonGradientButton';
import {style} from './style';
import {changeStack} from '../../actions/authActions';
import {useDispatch} from 'react-redux';
import {updateDetails} from '../../actions/homeActions';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const NewStartExploreScreen = () => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null); // State to manage selected option
  const apiDispatch = useDispatch();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // const selectionOptionClick = () => {
  //   // setLoading(true);
  //   //
  //   // if (selectedOption === 'longTerm') {
  //   //   console.log('marriage');
  //   //   apiDispatch(
  //   //     updateDetails({appUsesType: 'marriage'}, () => {
  //   //       dispatch(changeStack('marriage'));
  //   //       setLoading(false); // ✅ stop loader after success
  //   //     }),
  //   //   );
  //   // } else if (selectedOption === 'dating') {
  //   //   console.log('dating');
  //   //   apiDispatch(
  //   //     updateDetails({appUsesType: 'dating'}, () => {
  //   //       dispatch(changeStack('dating'));
  //   //       setLoading(false); // ✅ stop loader after success
  //   //     }),
  //   //   );
  //   // } else if (selectedOption === 'social') {
  //   //   console.log('social');
  //   //   setLoading(false); // stop loader here too
  //   // }
  // };

  const handleSelect = option => {
    LayoutAnimation.easeInEaseOut();
    setSelectedOption(option);
  };

  const selectionOptionClick = () => {
    if (!selectedOption) {
      return;
    }

    const typeMap = {
      longTerm: 'marriage',
      dating: 'dating',
    };

    const selectedType = typeMap[selectedOption];

    setLoading(true);

    apiDispatch(
      updateDetails(
        {appUsesType: selectedType},
        () => {
          setLoading(false);

          // ✅ Navigate based on selection
          if (selectedType === 'dating') {
            navigation.navigate('DatingBasicDetailScreen');
          } else {
            navigation.navigate('LongTermBasicDetailScreen');
          }
        },
        () => {
          setLoading(false);
        },
      ),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{flex: 1, alignItems: 'center'}}>
        {/* Heading */}
        <Text
          style={{
            fontSize: fontSize(20),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(90),
            color: colors.pureBlack,
            textAlign: 'center',
          }}>
          Select the profile you{'\n'}want to create.
        </Text>

        {/* LONG TERM */}
        <TouchableOpacity onPress={() => handleSelect('longTerm')}>
          <View
            style={{
              width: wp(300),
              height: hp(141),
              borderWidth: hp(1),
              borderRadius: hp(14),
              marginTop: hp(50),
              backgroundColor:
                selectedOption === 'longTerm' ? '#EEE9FF' : '#FFFFFF',
              borderColor:
                selectedOption === 'longTerm' ? '#7045EB' : '#ECECEC',
              padding: hp(17),
            }}>
            <OptionContent
              icon={icons.long_term_icon}
              title="Long Term"
              description="By creating this profile, you can find compatible"
              secondDescription="partners for marriage and life long companionship"
              selected={selectedOption === 'longTerm'}
            />
          </View>
        </TouchableOpacity>

        {/* DATE */}
        <TouchableOpacity onPress={() => handleSelect('dating')}>
          <View
            style={{
              width: wp(300),
              height: hp(141),
              borderWidth: hp(1),
              borderRadius: hp(14),
              marginTop: hp(20),
              backgroundColor:
                selectedOption === 'dating' ? '#EEE9FF' : '#FFFFFF',
              borderColor: selectedOption === 'dating' ? '#7045EB' : '#ECECEC',
              padding: 17,
            }}>
            <OptionContent
              icon={icons.new_dating_icon}
              title="Date"
              description="By creating this profile, you can discover profiles"
              secondDescription="for casual relationships"
              selected={selectedOption === 'dating'}
            />
          </View>
        </TouchableOpacity>

        {/* Continue Button */}
        {/*{selectedOption && (*/}
        {/*  <CommonGradientButton*/}
        {/*    buttonName="Continue"*/}
        {/*    containerStyle={{marginTop: 40}}*/}
        {/*    onPress={() => console.log(selectedOption)}*/}
        {/*  />*/}
        {/*)}*/}

        {/*<CommonGradientButton*/}
        {/*  buttonName="Continue"*/}
        {/*  containerStyle={{marginTop: 40}}*/}
        {/*  onPress={() => console.log(selectedOption)}*/}
        {/*  disabled={!selectedOption}*/}
        {/*  loading={loading}*/}
        {/*/>*/}

        <TouchableOpacity
          activeOpacity={selectedOption ? 0.7 : 1}
          disabled={!selectedOption || loading}
          onPress={selectionOptionClick}
          style={{position: 'absolute', bottom: 35}}>
          <View
            style={{
              width: wp(300),
              height: hp(44),
              borderRadius: hp(25),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: selectedOption ? '#7148E4' : '#EEE9FF',
              opacity: loading ? 0.7 : 1,
            }}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              {loading ? 'Please wait...' : 'Continue'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Extract the OptionContent component to reduce code repetition
const OptionContent = ({
  icon,
  title,
  description,
  secondDescription,
  selected,
}) => {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: hp(10),
        }}>
        <Image
          source={icon}
          style={{
            width: hp(29),
            height: hp(28),
            resizeMode: 'contain',
            tintColor: selected ? '#7045EB' : '#5F6368',
          }}
        />

        <Image
          source={icons.rightSideIcon}
          style={{
            width: wp(6),
            height: hp(11),
            tintColor: selected ? '#7045EB' : '#5F6368',
          }}
        />
      </View>

      <Text
        style={{
          fontSize: fontSize(14),
          fontFamily: fontFamily.poppins600,
          marginTop: hp(12),
          // color: selected ? '#7045EB' : '#000',
          color: '#000',
        }}>
        {title}
      </Text>

      <Text
        style={{
          fontSize: fontSize(10),
          marginTop: 8,
          // color: selected ? '#7045EB' : '#5F6368',
          color: colors.pureBlack,
        }}>
        {description}
      </Text>

      <Text
        style={{
          fontSize: fontSize(10),
          // color: selected ? '#7045EB' : '#5F6368',
          color: colors.pureBlack,
        }}>
        {secondDescription}
      </Text>
    </View>
  );
};

export default NewStartExploreScreen;
