import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {icons} from '../../../assets';
import {style} from './style';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../../../utils/colors';
import {educationDetails} from '../../../actions/homeActions';
import {hp} from '../../../utils/helpers';

const AdminEducationDetailsScreen = (...params) => {
  const userPersonalData = params[0];
  const apiDispatch = useDispatch();

  const {isEducationLoading} = useSelector(state => state.auth);

  const capitalizeFirstLetter = str =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : 'N/A';

  const [degree, setDegree] = useState(
    capitalizeFirstLetter(userPersonalData?.userEducation?.degree),
  );
  const [college, setCollege] = useState(
    capitalizeFirstLetter(userPersonalData?.userEducation?.collage),
  );
  const [city, setCity] = useState(
    capitalizeFirstLetter(userPersonalData?.userEducation?.city),
  );
  const [state, setState] = useState(
    capitalizeFirstLetter(userPersonalData?.userEducation?.state),
  );
  const [country, setCountry] = useState(
    capitalizeFirstLetter(userPersonalData?.userEducation?.country),
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    apiDispatch(
      educationDetails({
        degree: degree,
        collage: college,
        city: city,
        state: state,
        country: country,
      }),
    );

    setIsEditing(false);
  };

  return (
    <SafeAreaView style={style.container}>
      <View
        style={{
          width: '100%',
          borderColor: '#E8E8E8',
          borderWidth: 0.7,
          marginTop: hp(25),
        }}
      />

      <View style={style.bodyContainer}>
        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>Degree</Text>
          {isEditing ? (
            <TextInput
              value={degree}
              onChangeText={setDegree}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{degree}</Text>
          )}
        </View>

        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>College/University</Text>
          {isEditing ? (
            <TextInput
              value={college}
              onChangeText={setCollege}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{college}</Text>
          )}
        </View>

        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>City</Text>
          {isEditing ? (
            <TextInput
              value={city}
              onChangeText={setCity}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{city}</Text>
          )}
        </View>

        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>State</Text>
          {isEditing ? (
            <TextInput
              value={state}
              onChangeText={setState}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{state}</Text>
          )}
        </View>

        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>Country</Text>
          {isEditing ? (
            <TextInput
              value={country}
              onChangeText={setCountry}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{country}</Text>
          )}
        </View>
      </View>

      {isEditing ? (
        <View style={style.buttonContainer}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isEducationLoading}
            style={style.buttonBodyContainer}>
            {isEducationLoading ? (
              <ActivityIndicator size="small" color={colors.blue} />
            ) : (
              <Image source={icons.new_Save_icon} style={style.saveIcon} />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={style.buttonContainer}>
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            disabled={isEducationLoading}
            style={style.buttonBodyContainer}>
            {isEducationLoading ? (
              <ActivityIndicator size="small" color={colors.blue} />
            ) : (
              <Image source={icons.new_edit_icon} style={style.editIcon} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AdminEducationDetailsScreen;
