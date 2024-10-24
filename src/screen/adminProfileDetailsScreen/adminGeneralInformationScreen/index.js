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

  // console.log(
  //   ' === AdminGeneralInformationScreen ===> ',
  //   userPersonalData?.religion,
  // );

  const date = new Date(userPersonalData.dateOfBirth);
  const formattedDate = `${('0' + date.getDate()).slice(-2)}.${(
    '0' +
    (date.getMonth() + 1)
  ).slice(-2)}.${date.getFullYear()}`;

  // Extract hours and minutes from birthTime (which is in ISO format)
  const birthTimeISO = new Date(userPersonalData?.birthTime);
  let hours = birthTimeISO.getHours();
  const minutes = String(birthTimeISO.getMinutes()).padStart(2, '0');

  // Determine AM or PM suffix
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12; // Convert '0' to '12' for 12 AM/PM

  // Format hours and minutes in HH:MM AM/PM format
  const formattedBirthTime = `${hours}:${minutes} ${ampm}`;

  // console.log(' === formattedBirthTime ===> ', formattedBirthTime);

  const [dateOfBirth, setDateOfBirth] = useState(formattedDate || 'N/A');

  const [birthTime, setBirthTime] = useState(formattedBirthTime || 'N/A');

  const religionData = userPersonalData?.religion;
  const [religion, setReligion] = useState(religionData || 'N/A');

  const Caste = userPersonalData?.caste;
  const [caste, setCaste] = useState(Caste || 'N/A');

  const CurrentCity = userPersonalData?.address?.currentCity;
  const [currentCity, setCurrentCity] = useState(CurrentCity || 'N/A');

  const Country = userPersonalData?.address?.currentCountry;
  const [country, setCountry] = useState(Country || 'N/A');
  const [isEditing, setIsEditing] = useState(false);

  const apiDispatch = useDispatch();

  const handleSave = () => {
    const [day, month, year] = dateOfBirth.split('.');
    const isoFormattedDate = new Date(`${year}-${month}-${day}`).toISOString(); // Convert to ISO format

    let timePart = birthTime.trim().split(' ')[0]; // Split time and ignore AM/PM for now
    let ampm = birthTime.trim().split(' ')[1]; // Get the AM/PM part
    let [hours, minutes] = timePart.split(':'); // Extract hours and minutes

    // Defensive checks for undefined values
    hours = hours ? hours.padStart(2, '0') : '00';
    minutes = minutes ? minutes.padStart(2, '0') : '00';

    // Convert 12-hour format to 24-hour format
    if (ampm === 'PM' && hours !== '12') {
      hours = String(Number(hours) + 12);
    } else if (ampm === 'AM' && hours === '12') {
      hours = '00';
    }

    const isoFormattedBirthTime = `1970-01-01T${hours}:${minutes}:00.000Z`; // Append time to a neutral date

    apiDispatch(
      updateDetails({
        dateOfBirth: isoFormattedDate,
        // birthTime: isoFormattedBirthTime,
        religion: religion,
        caste: caste,
      }),
    );

    apiDispatch(
      addressDetails({currentCity: currentCity, currentCountry: country}),
    );

    setIsEditing(false);
  };

  return (
    <SafeAreaView style={style.container}>
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
    </SafeAreaView>
  );
};

export default AdminGeneralInformationScreen;
