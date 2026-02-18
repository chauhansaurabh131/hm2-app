import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  Modal,
  View,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {fontSize, hp, wp} from '../../utils/helpers';
import CompleteYourProfileModalComponent from '../../components/completeYourProfileModalComponent';

const DemoCode = () => {
  const [profileCompleteModal, setProfileCompleteModal] = useState(false);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TouchableOpacity
        style={{marginTop: hp(50)}}
        onPress={() => setProfileCompleteModal(true)}>
        <Text
          style={{
            color: 'black',
            fontSize: fontSize(26),
            textAlign: 'center',
          }}>
          Open
        </Text>
      </TouchableOpacity>

      <CompleteYourProfileModalComponent
        visible={profileCompleteModal}
        onClose={() => setProfileCompleteModal(false)}
        onPrimaryPress={() => {
          setProfileCompleteModal(false);
          // navigation.navigate('CreatingProfileScreen');
          console.log(' === onPrimaryPress ===> ');
        }}
        onSecondaryPress={() => {
          setProfileCompleteModal(false);
          console.log('Send Request Clicked');
        }}
      />
    </SafeAreaView>
  );
};

export default DemoCode;
