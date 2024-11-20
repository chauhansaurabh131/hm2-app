import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {icons} from '../../../assets';
import {style} from './style';
import {useDispatch} from 'react-redux';
import {partnerReferences} from '../../../actions/homeActions';

const AdminPartnerPreferenceScreen = (...params) => {
  const userPersonalData = params[0];

  console.log(' === userPersonalData ===> ', userPersonalData?.hobbies);
  const dispatch = useDispatch();
  const apiDispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);

  const [minAge, setMinAge] = useState(
    userPersonalData?.userPartner?.age?.min?.toString() || [],
  );
  const [maxAge, setMaxAge] = useState(
    userPersonalData?.userPartner?.age?.max?.toString() || [],
  );
  const [minPreferHeight, setMinPreferHeight] = useState(
    userPersonalData?.userPartner?.height?.min?.toString() || [],
  );

  const [maxPreferHeight, setMaxPreferHeight] = useState(
    userPersonalData?.userPartner?.height?.max?.toString() || [],
  );

  const [preferCity, setPreferCity] = useState(
    userPersonalData?.userPartner?.city?.toString() || [],
  );

  const [preferState, setPreferState] = useState(
    userPersonalData?.userPartner?.state?.toString() || [],
  );

  const [preferCountry, setPreferCountry] = useState(
    userPersonalData?.userPartner?.country?.toString() || [],
  );

  const [preferIncome, setPreferIncome] = useState(
    userPersonalData?.userPartner?.income?.toString() || '',
  );

  const [preferDiet, setPreferDiet] = useState(
    userPersonalData?.userPartner?.diet?.toString() || [],
  );

  const [preferHobbies, setPreferHobbies] = useState(
    userPersonalData?.hobbies || [],
  );

  const handleSave = () => {
    setIsEditing(false);
    // Save data to your backend or perform any other necessary action

    const payload = {
      age: {min: minAge, max: maxAge},
      height: {min: minPreferHeight, max: maxPreferHeight},
      city: Array.isArray(preferCity) ? preferCity : [preferCity],
      state: Array.isArray(preferState)
        ? preferState.map(state => state.trim()).filter(Boolean) // Trim and remove empty entries
        : preferState
            .split(',')
            .map(state => state.trim())
            .filter(Boolean),
      country: Array.isArray(preferCountry)
        ? preferCountry.map(country => country.trim()).filter(Boolean)
        : preferCountry
            .split(',')
            .map(country => country.trim())
            .filter(Boolean),
      income: Number(preferIncome),
      diet: Array.isArray(preferDiet)
        ? preferDiet.map(diet => diet.trim()).filter(Boolean)
        : [preferDiet.trim()].filter(Boolean),
      // hobbies: Array.isArray(preferHobbies)
      //   ? preferHobbies.map(hobby => hobby.trim()).filter(Boolean)
      //   : [preferHobbies].filter(Boolean),

      hobbies: Array.isArray(preferHobbies)
        ? preferHobbies.map(hobby => hobby.trim()).filter(Boolean) // Trim and remove empty entries
        : preferHobbies
            .split(',')
            .map(hobby => hobby.trim())
            .filter(Boolean),
    };

    console.log(' === payload ===> ', payload);
    dispatch(partnerReferences(payload));
  };

  return (
    <SafeAreaView style={style.container}>
      {isEditing ? (
        <View style={style.editButtonContainer}>
          <TouchableOpacity onPress={handleSave} style={style.saveContainer}>
            <Image source={icons.new_Save_icon} style={style.iconStyle} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={style.editButtonContainer}>
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={style.saveContainer}>
            <Image source={icons.new_edit_icon} style={style.iconStyle} />
          </TouchableOpacity>
        </View>
      )}

      <View style={style.underLineStyle} />

      <View style={style.bodyContainer}>
        <View style={{marginBottom: hp(15)}}>
          <Text style={style.labelText}>Age</Text>

          {isEditing ? (
            <View style={style.textInputContainerStyle}>
              <TextInput
                value={minAge}
                onChangeText={setMinAge}
                placeholder={'Min'}
                style={style.minAgeTextInput}
              />

              <Text style={style.toTextStyle}>To</Text>

              <TextInput
                value={maxAge}
                onChangeText={setMaxAge}
                placeholder={'Max'}
                style={style.maxAgeTextInput}
              />
            </View>
          ) : (
            <Text style={style.subLabelText}>
              {minAge} - {maxAge}
            </Text>
          )}
        </View>

        <View style={{marginBottom: hp(15)}}>
          <Text style={style.labelText}>Prefer Height (ft)</Text>

          {isEditing ? (
            <View style={style.textInputContainerStyle}>
              <TextInput
                value={minPreferHeight}
                onChangeText={setMinPreferHeight}
                placeholder={'Min'}
                style={style.minAgeTextInput}
              />

              <Text style={style.toTextStyle}>To</Text>

              <TextInput
                value={maxPreferHeight}
                onChangeText={setMaxPreferHeight}
                placeholder={'Max'}
                style={style.maxAgeTextInput}
              />
            </View>
          ) : (
            <Text style={style.subLabelText}>
              {minPreferHeight} - {maxPreferHeight} ft
            </Text>
          )}
        </View>

        <View style={{marginBottom: hp(15)}}>
          <Text style={style.labelText}>Prefer City</Text>

          {isEditing ? (
            <TextInput
              value={preferCity}
              onChangeText={setPreferCity}
              style={style.editTextInput}
            />
          ) : (
            <Text style={style.subLabelText}>{preferCity}</Text>
          )}
        </View>

        <View style={{marginBottom: hp(15)}}>
          <Text style={style.labelText}>Prefer State</Text>

          {isEditing ? (
            <TextInput
              value={preferState}
              onChangeText={setPreferState}
              style={style.editTextInput}
            />
          ) : (
            <Text style={style.subLabelText}>{preferState}</Text>
          )}
        </View>

        <View style={{marginBottom: hp(15)}}>
          <Text style={style.labelText}>Prefer Country</Text>

          {isEditing ? (
            <TextInput
              value={preferCountry}
              onChangeText={setPreferCountry}
              style={style.editTextInput}
            />
          ) : (
            <Text style={style.subLabelText}>{preferCountry}</Text>
          )}
        </View>

        <View style={{marginBottom: hp(15)}}>
          <Text style={style.labelText}>Prefer Income (Rs)</Text>

          {isEditing ? (
            <TextInput
              value={preferIncome}
              onChangeText={setPreferIncome}
              style={style.editTextInput}
            />
          ) : (
            <Text style={style.subLabelText}>{preferIncome}</Text>
          )}
        </View>

        <View style={{marginBottom: hp(15)}}>
          <Text style={style.labelText}>Prefer Diet</Text>

          {isEditing ? (
            <TextInput
              value={preferDiet}
              onChangeText={setPreferDiet}
              style={style.editTextInput}
            />
          ) : (
            <Text style={style.subLabelText}>{preferDiet}</Text>
          )}
        </View>

        <View style={{marginBottom: hp(15)}}>
          <Text style={style.labelText}>Hobbies & Interest</Text>

          {isEditing ? (
            <TextInput
              value={preferHobbies.join(', ')}
              onChangeText={text =>
                setPreferHobbies(text.split(',').map(hobby => hobby.trim()))
              }
              style={{
                color: colors.black,
                fontSize: fontSize(18),
                lineHeight: hp(28),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(2),
                borderWidth: 1,
                borderColor: colors.gray,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 5,
              }}
            />
          ) : (
            // <Text style={style.subLabelText}>{preferHobbies}</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: hp(5),
              }}>
              {preferHobbies.map((hobby, index) => (
                <View
                  key={index}
                  style={{
                    borderColor: '#DEDEDE',
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingHorizontal: wp(15),
                    paddingVertical: hp(5),
                    marginRight: wp(10),
                    marginBottom: hp(10),
                    backgroundColor: colors.white, // Optional: to ensure consistent background color
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: fontSize(16),
                      fontFamily: fontFamily.poppins500,
                      color: colors.black,
                      lineHeight: hp(24),
                    }}>
                    {hobby}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{height: 50}} />
      </View>
    </SafeAreaView>
  );
};

export default AdminPartnerPreferenceScreen;
