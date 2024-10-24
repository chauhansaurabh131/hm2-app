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

const AdminEducationDetailsScreen = (...params) => {
  const userPersonalData = params[0];
  const apiDispatch = useDispatch();

  const {isEducationLoading} = useSelector(state => state.auth);

  const [degree, setDegree] = useState(
    userPersonalData?.userEducation?.degree || 'N/A',
  );
  const [college, setCollege] = useState(
    userPersonalData?.userEducation?.collage || 'N/A',
  );
  const [city, setCity] = useState(
    userPersonalData?.userEducation?.city || 'N/A',
  );
  const [state, setState] = useState(
    userPersonalData?.userEducation?.state || 'N/A',
  );
  const [country, setCountry] = useState(
    userPersonalData?.userEducation?.country || 'N/A',
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
              <Image source={icons.save_icon} style={style.saveIcon} />
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
              <Image source={icons.edit_icon} style={style.editIcon} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AdminEducationDetailsScreen;
