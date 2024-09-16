import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {icons} from '../../../assets';
import {useDispatch} from 'react-redux';
import {addressDetails, updateDetails} from '../../../actions/homeActions';
import {style} from './style';

const AdminGeneralInformationScreen = (...params) => {
  const userPersonalData = params[0];

  /*BIRTH DAY FORMAT*/
  const birthDate = userPersonalData?.dateOfBirth;
  const dateObj = new Date(birthDate);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = dateObj.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const [dateOfBirth, setDateOfBirth] = useState(formattedDate || '02.03.1986');

  const [birthTime, setBirthTime] = useState('10:01:20 AM');

  const religionData = userPersonalData?.religion;
  const [religion, setReligion] = useState(religionData || 'Hindu');

  const Caste = userPersonalData?.caste;
  const [caste, setCaste] = useState(Caste || 'Patel, Kadva Patidar');

  const CurrentCity = userPersonalData?.address?.currentCity;
  const [currentCity, setCurrentCity] = useState(CurrentCity || 'New York');

  const Country = userPersonalData?.address?.currentCountry;
  const [country, setCountry] = useState(Country || 'United States of America');
  const [isEditing, setIsEditing] = useState(false);

  const apiDispatch = useDispatch();

  const handleSave = () => {
    apiDispatch(updateDetails({dateOfBirth: dateOfBirth}));
    // apiDispatch(updateDetails({birthTime: birthTime}));
    apiDispatch(updateDetails({religion: religion}));
    apiDispatch(updateDetails({caste: caste}));
    apiDispatch(addressDetails({currentCity: currentCity}));
    apiDispatch(addressDetails({currentCountry: country}));
    setIsEditing(false);
    // Save data to your backend or perform any other necessary action
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.bodyContainer}>
        <View style={style.tittleContainer}>
          <Text style={style.tittleTextStyle}>Date of Birth</Text>

          {isEditing ? (
            <TextInput
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              style={style.textInputStyle}
            />
          ) : (
            <Text style={style.textInputTextStyle}>{dateOfBirth}</Text>
          )}
        </View>

        <View style={style.tittleContainer}>
          <Text style={style.tittleTextStyle}>Birth Time</Text>

          {isEditing ? (
            <TextInput
              value={birthTime}
              onChangeText={setBirthTime}
              style={style.textInputStyle}
            />
          ) : (
            <Text style={style.textInputTextStyle}>{birthTime}</Text>
          )}
        </View>

        <View style={style.tittleContainer}>
          <Text style={style.tittleTextStyle}>Religion</Text>

          {isEditing ? (
            <TextInput
              value={religion}
              onChangeText={setReligion}
              style={style.textInputStyle}
            />
          ) : (
            <Text style={style.textInputTextStyle}>{religion}</Text>
          )}
        </View>

        <View style={style.tittleContainer}>
          <Text style={style.tittleTextStyle}>Cast/Sub Caste</Text>

          {isEditing ? (
            <TextInput
              value={caste}
              onChangeText={setCaste}
              style={style.textInputStyle}
            />
          ) : (
            <Text style={style.textInputTextStyle}>{caste}</Text>
          )}
        </View>

        <View style={style.tittleContainer}>
          <Text style={style.tittleTextStyle}>Current City</Text>

          {isEditing ? (
            <TextInput
              value={currentCity}
              onChangeText={setCurrentCity}
              style={style.textInputStyle}
            />
          ) : (
            <Text style={style.textInputTextStyle}>{currentCity}</Text>
          )}
        </View>

        <View style={style.tittleContainer}>
          <Text style={style.tittleTextStyle}>Country of Living</Text>

          {isEditing ? (
            <TextInput
              value={country}
              onChangeText={setCountry}
              style={style.textInputStyle}
            />
          ) : (
            <Text style={style.textInputTextStyle}>{country}</Text>
          )}
        </View>

        {/* Similar pattern for other fields */}
      </View>

      {isEditing ? (
        <View style={style.buttonContainer}>
          <TouchableOpacity onPress={handleSave} style={style.buttonStyle}>
            <Image source={icons.save_icon} style={style.saveIcon} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={style.buttonContainer}>
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={style.buttonStyle}>
            <Image source={icons.edit_icon} style={style.editIcon} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AdminGeneralInformationScreen;
