import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import style from './style';
import {icons} from '../../assets';

const HeaderLogo = ({
  profileLogoStyle,
  addressLogoStyle,
  addressImageStyle,
  profileImageStyle,
  phoneLogoStyle,
  phoneImageStyle,
  educationLogoStyle,
  educationImageStyle,
  professionalLogoStyle,
  professionalImageStyle,
  internetLogoStyle,
  internetImageStyle,
}) => {
  return (
    <View
      style={[
        style.headerScreenLogoContainer,
        {justifyContent: 'space-between'},
      ]}>
      <TouchableOpacity>
        <View style={[style.headerBodyLogoStyle, profileLogoStyle]}>
          <Image
            source={icons.profileLogo}
            style={[style.imageStyle, profileImageStyle]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <View style={[style.headerBodyLogoStyle, addressLogoStyle]}>
          <Image
            source={icons.addressLogo}
            style={[style.imageStyle, addressImageStyle]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <View style={[style.headerBodyLogoStyle, phoneLogoStyle]}>
          <Image
            source={icons.phoneLogo}
            style={[style.imageStyle, phoneImageStyle]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <View style={[style.headerBodyLogoStyle, educationLogoStyle]}>
          <Image
            source={icons.educationLogo}
            style={[style.imageStyle, educationImageStyle]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <View style={[style.headerBodyLogoStyle, professionalLogoStyle]}>
          <Image
            source={icons.professionalLogo}
            style={[style.imageStyle, professionalImageStyle]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <View style={[style.headerBodyLogoStyle, internetLogoStyle]}>
          <Image
            source={icons.internetLogo}
            style={[style.imageStyle, internetImageStyle]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderLogo;
