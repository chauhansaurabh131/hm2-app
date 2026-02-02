import PremiumMatchesComponent from '../../components/PremiumMatchesComponent';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {fontFamily, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {useState} from 'react';

const DemoCode = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const showCustomAlert = message => {
    setAlertMessage(message);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* 🔔 Custom Alert */}
      {showAlert && (
        <View
          style={{
            position: 'absolute',
            top: hp(40),
            alignSelf: 'center',
            backgroundColor: '#333',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 30,
            zIndex: 1000,
          }}>
          <Text
            style={{
              color: '#fff',
              fontFamily: fontFamily.poppins400,
            }}>
            {alertMessage}
          </Text>
        </View>
      )}

      <ScrollView>
        <View>
          <View style={{marginTop: hp(10), flex: 1}}>
            <PremiumMatchesComponent
              onShowAlert={showCustomAlert} // 👈 PASS CALLBACK
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DemoCode;
