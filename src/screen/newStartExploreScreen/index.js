import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import CommonGradientButton from '../../components/commonGradientButton';
import {style} from './style';
import {changeStack} from '../../actions/authActions';
import {useDispatch} from 'react-redux';

const NewStartExploreScreen = () => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null); // State to manage selected option
  const dispatch = useDispatch();

  const selectionOptionClick = () => {
    // if (selectedBox === 'marriage') {
    dispatch(changeStack());
    // } else {
    // }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headingContainer}>
        <Image source={images.happyMilanColorLogo} style={style.logoStyle} />

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image source={icons.back_arrow_icon} style={style.backArrowStyle} />
        </TouchableOpacity>
      </View>

      <View style={style.bodyContainerStyle}>
        <Text style={style.tittleTextStyle}>Select Profile Option</Text>

        {/* LONG TERM */}
        <TouchableOpacity onPress={() => setSelectedOption('longTerm')}>
          {selectedOption === 'longTerm' ? (
            <LinearGradient
              colors={['#0F52BA', '#8225AF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={style.selectedBackGroundColorStyle}>
              <OptionContent
                icon={icons.long_term_icon}
                title="Long Term"
                description="By creating this profile, you can find compatible "
                secondDescription="partners for marriage and life long companionship"
                selected={true} // Pass selected prop
              />
            </LinearGradient>
          ) : (
            <View style={style.selectedBackGroundColorStyle}>
              <OptionContent
                icon={icons.long_term_icon}
                title="Long Term"
                description="By creating this profile, you can find compatible "
                secondDescription="partners for marriage and life long companionship"
                selected={false} // Pass selected prop
              />
            </View>
          )}
        </TouchableOpacity>

        {/* DATING */}
        <TouchableOpacity onPress={() => setSelectedOption('dating')}>
          {selectedOption === 'dating' ? (
            <LinearGradient
              colors={['#0F52BA', '#8225AF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={style.selectedSecondBackGroundStyle}>
              <OptionContent
                icon={icons.new_dating_icon}
                title="Date"
                description="By creating this profile, you can discover profiles"
                secondDescription="for casual relationships"
                selected={true} // Pass selected prop
              />
            </LinearGradient>
          ) : (
            <View style={style.selectedSecondBackGroundStyle}>
              <OptionContent
                icon={icons.new_dating_icon}
                title="Date"
                description="By creating this profile, you can discover profiles"
                secondDescription="for casual relationships"
                selected={false} // Pass selected prop
              />
            </View>
          )}
        </TouchableOpacity>

        {/* SOCIAL */}
        <TouchableOpacity onPress={() => setSelectedOption('social')}>
          {selectedOption === 'social' ? (
            <LinearGradient
              colors={['#0F52BA', '#8225AF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={style.selectedSecondBackGroundStyle}>
              <OptionContent
                icon={icons.long_term_icon}
                title="Social"
                description="By creating this profile, you can find friends and "
                secondDescription="connect with groups for trips and activities."
                selected={true} // Pass selected prop
              />
            </LinearGradient>
          ) : (
            <View style={style.selectedSecondBackGroundStyle}>
              <OptionContent
                icon={icons.long_term_icon}
                title="Social"
                description="By creating this profile, you can find friends and "
                secondDescription="connect with groups for trips and activities."
                selected={false} // Pass selected prop
              />
            </View>
          )}
        </TouchableOpacity>

        {/* Start Explore Button */}
        {selectedOption && (
          <CommonGradientButton
            buttonName={'Start Explore'}
            containerStyle={style.buttonContainerStyle}
            onPress={selectionOptionClick}
            // loading={loading}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// Extract the OptionContent component to reduce code repetition
const OptionContent = ({
  icon,
  title,
  description,
  selected,
  secondDescription,
}) => (
  <View style={style.boxContainer}>
    <View style={style.imageContainer}>
      <Image
        source={icon}
        style={[
          style.iconStyle,
          {tintColor: selected ? colors.white : undefined},
        ]}
      />
      <Image
        source={icons.rightSideIcon}
        style={[
          style.rightSideIcon,
          {tintColor: selected ? colors.white : '#5F6368'},
        ]}
      />
    </View>

    <Text
      style={[
        style.boxTittleText,
        {color: selected ? colors.white : colors.black},
      ]}>
      {title}
    </Text>

    <Text
      style={[
        style.descriptionText,
        {color: selected ? colors.white : colors.black},
      ]}>
      {description}
    </Text>

    <Text
      style={[
        style.secondDescriptionText,
        {color: selected ? colors.white : colors.black},
      ]}>
      {secondDescription}
    </Text>
  </View>
);

export default NewStartExploreScreen;
