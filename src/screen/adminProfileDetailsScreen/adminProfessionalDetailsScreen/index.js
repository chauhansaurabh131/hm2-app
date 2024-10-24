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
import {useDispatch, useSelector} from 'react-redux';
import {style} from './style';
import {professionalDetail} from '../../../actions/homeActions';
import {colors} from '../../../utils/colors';

const AdminProfessionalDetailsScreen = (...params) => {
  const userPersonalData = params[0];

  const apiDispatch = useDispatch();

  // const {isSendRequestLoading} = useSelector(state => state.auth);
  // console.log(' === isSendRequestLoading ===> ', isSendRequestLoading);

  const [currentDesignation, setCurrentDesignation] = useState(
    userPersonalData?.userProfessional?.jobTitle || 'N/A',
  );
  const [jobType, setJobType] = useState(
    userPersonalData?.userProfessional?.jobType || 'N/A',
  );
  const [companyName, setCompanyName] = useState(
    userPersonalData?.userProfessional?.companyName || 'N/A',
  );
  const [salary, setSalary] = useState(
    userPersonalData?.userProfessional?.currentSalary || 'N/A',
  );
  const [workCity, setWorkCity] = useState(
    userPersonalData?.userProfessional?.workCity || 'N/A',
  );
  const [workCountry, setWorkCountry] = useState(
    userPersonalData?.userProfessional?.workCountry || 'N/A',
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    apiDispatch(
      professionalDetail({
        jobTitle: currentDesignation,
        jobType: jobType,
        companyName: companyName,
        currentSalary: salary,
        workCity: workCountry,
        workCountry: workCountry,
      }),
    );
    setIsEditing(false);
    // Save data to your backend or perform any other necessary action
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.bodyContainer}>
        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>Current Designation</Text>
          {isEditing ? (
            <TextInput
              value={currentDesignation}
              onChangeText={setCurrentDesignation}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{currentDesignation}</Text>
          )}
        </View>

        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>Job Type</Text>
          {isEditing ? (
            <TextInput
              value={jobType}
              onChangeText={setJobType}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{jobType}</Text>
          )}
        </View>

        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>Company Name</Text>
          {isEditing ? (
            <TextInput
              value={companyName}
              onChangeText={setCompanyName}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{companyName}</Text>
          )}
        </View>

        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>Annual Salary</Text>
          {isEditing ? (
            <TextInput
              value={salary}
              onChangeText={setSalary}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{salary}</Text>
          )}
        </View>

        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>Work in City</Text>
          {isEditing ? (
            <TextInput
              value={workCity}
              onChangeText={setWorkCity}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{workCity}</Text>
          )}
        </View>

        <View style={style.bodySubContainer}>
          <Text style={style.tittleText}>Work in Country</Text>
          {isEditing ? (
            <TextInput
              value={workCountry}
              onChangeText={setWorkCountry}
              style={style.textInputContainer}
            />
          ) : (
            <Text style={style.subTittleText}>{workCountry}</Text>
          )}
        </View>
      </View>

      {isEditing ? (
        <View style={style.buttonContainer}>
          <TouchableOpacity
            onPress={handleSave}
            // disabled={isSendRequestLoading}
            style={style.buttonBodyContainer}>
            {/*{isSendRequestLoading ? (*/}
            {/*  <ActivityIndicator size="small" color={colors.blue} />*/}
            {/*) : (*/}
            <Image source={icons.save_icon} style={style.saveIcon} />
            {/*)}*/}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={style.buttonContainer}>
          <TouchableOpacity
            // disabled={isSendRequestLoading}
            onPress={() => setIsEditing(true)}
            style={style.buttonBodyContainer}>
            {/*{isSendRequestLoading ? (*/}
            {/*  <ActivityIndicator size="small" color={colors.blue} />*/}
            {/*) : (*/}
            <Image source={icons.edit_icon} style={style.editIcon} />
            {/*)}*/}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AdminProfessionalDetailsScreen;
