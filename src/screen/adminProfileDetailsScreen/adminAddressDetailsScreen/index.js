import React, {useState, useEffect} from 'react';
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
import {addressDetails} from '../../../actions/homeActions';
import {useDispatch, useSelector} from 'react-redux';
import {style} from './style';
import {colors} from '../../../utils/colors';

const AdminAddressDetailsScreen = (...params) => {
  const userPersonalData = params[0];
  const apiDispatch = useDispatch();

  const {isAddressLoading} = useSelector(state => state.auth);

  const [residingAddress, setResidingAddress] = useState(
    userPersonalData?.address?.currentResidenceAddress || 'N/A',
  );
  const [currentCity, setCurrentCity] = useState(
    userPersonalData?.address?.currentCity || 'N/A',
  );
  const [currentCountry, setCurrentCountry] = useState(
    userPersonalData?.address?.currentCountry || 'N/A',
  );

  // Combine residingAddress, currentCity, and currentCountry into permanentAddress
  const [permanentAddress, setPermanentAddress] = useState(
    `${userPersonalData?.address?.currentResidenceAddress || 'N/A'}, ${
      userPersonalData?.address?.currentCity || 'N/A'
    }, ${userPersonalData?.address?.currentCountry || 'N/A'}`,
  );

  // Update permanentAddress dynamically when any of the individual address parts change
  useEffect(() => {
    setPermanentAddress(
      `${residingAddress}, ${currentCity}, ${currentCountry}`,
    );
  }, [residingAddress, currentCity, currentCountry]);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    apiDispatch(
      addressDetails({
        currentResidenceAddress: residingAddress,
        currentCity: currentCity,
        currentCountry: currentCountry,
      }),
    );
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.bodyContainer}>
        <View style={style.residencyContainer}>
          <Text style={style.titleText}>Current Residing Address</Text>
          {isEditing ? (
            <TextInput
              value={residingAddress}
              onChangeText={setResidingAddress}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{residingAddress}</Text>
          )}
        </View>

        <View style={style.residencyContainer}>
          <Text style={style.titleText}>Current City</Text>
          {isEditing ? (
            <TextInput
              value={currentCity}
              onChangeText={setCurrentCity}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{currentCity}</Text>
          )}
        </View>

        <View style={style.residencyContainer}>
          <Text style={style.titleText}>Current Residing Country</Text>
          {isEditing ? (
            <TextInput
              value={currentCountry}
              onChangeText={setCurrentCountry}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{currentCountry}</Text>
          )}
        </View>

        <View style={style.residencyContainer}>
          <Text style={style.titleText}>Permanent Address</Text>
          {isEditing ? (
            <TextInput
              value={permanentAddress}
              onChangeText={setPermanentAddress}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{permanentAddress}</Text>
          )}
        </View>
      </View>

      {isEditing ? (
        <View style={style.editButtonContainer}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isAddressLoading}
            style={style.buttonContainer}>
            {isAddressLoading ? (
              <ActivityIndicator size="small" color={colors.blue} />
            ) : (
              <Image source={icons.save_icon} style={style.saveIcon} />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={style.editButtonContainer}>
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            disabled={isAddressLoading}
            style={style.buttonContainer}>
            {isAddressLoading ? (
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

export default AdminAddressDetailsScreen;
