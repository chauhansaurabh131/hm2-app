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
import {colors} from '../../../utils/colors';
import {icons} from '../../../assets';
import {style} from './style';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../../actions/homeActions';

const AdminContactDetailsScreen = (...params) => {
  const userPersonalData = params[0];
  const apiDispatch = useDispatch();

  const {isUpdatingProfile} = useSelector(state => state.auth);

  console.log(' === var ===> ', isUpdatingProfile);
  // console.log(' === AdminContactDetailsScreen ===> ', userPersonalData?.email);

  const [mobileNumber, setMobileNumber] = useState(
    userPersonalData?.mobileNumber || 'N/A',
  );
  const [homeNumber, setHomeNumber] = useState(
    userPersonalData?.homeMobileNumber || 'N/A',
  );
  const [email, setEmail] = useState(userPersonalData?.email || 'N/A');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    apiDispatch(
      updateDetails({
        mobileNumber: mobileNumber,
        homeMobileNumber: homeNumber,
        email: email,
      }),
    );
    setIsEditing(false);
    // Save data to your backend or perform any other necessary action
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.bodyContainer}>
        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>Mobile Number</Text>
          {isEditing ? (
            <TextInput
              value={mobileNumber}
              keyboardType={'phone-pad'}
              maxLength={10}
              onChangeText={text => {
                const cleanedText = text.replace(/[^0-9]/g, ''); // Only allow numbers
                setMobileNumber(cleanedText);
              }}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{mobileNumber}</Text>
          )}
        </View>

        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>Home Mobile Number</Text>
          {isEditing ? (
            <TextInput
              value={homeNumber}
              keyboardType={'phone-pad'}
              maxLength={10}
              onChangeText={text => {
                const cleanedText = text.replace(/[^0-9]/g, ''); // Only allow numbers
                setHomeNumber(cleanedText);
              }}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{homeNumber}</Text>
          )}
        </View>

        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>Date of Birth</Text>
          {isEditing ? (
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{email}</Text>
          )}
        </View>
      </View>

      {isEditing ? (
        <View style={style.buttonContainer}>
          <TouchableOpacity
            disabled={isUpdatingProfile}
            onPress={handleSave}
            style={style.buttonBodyContainer}>
            {isUpdatingProfile ? (
              <ActivityIndicator size="small" color={colors.blue} />
            ) : (
              <Image source={icons.save_icon} style={style.saveIcon} />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={style.buttonContainer}>
          <TouchableOpacity
            disabled={isUpdatingProfile}
            onPress={() => setIsEditing(true)}
            style={style.buttonBodyContainer}>
            {isUpdatingProfile ? (
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

export default AdminContactDetailsScreen;
