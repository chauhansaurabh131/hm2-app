import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  Modal,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {images} from '../../assets';
import {colors} from '../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';

const Abc = () => {
  // State to handle modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView>
      {/* The Text that triggers the modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>Open</Text>
      </TouchableOpacity>

      {/* Modal Component */}
      <Modal
        // animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: wp(340),
              height: hp(420),
              backgroundColor: 'white',
              borderRadius: 14,
              alignItems: 'center',
            }}>
            <Image source={images.modal_top_img} style={{width: '100%'}} />

            <Text
              style={{
                fontSize: fontSize(20),
                lineHeight: hp(30),
                fontFamily: fontFamily.poppins600,
                color: colors.white,
                marginTop: -60,
              }}>
              Congratulations
            </Text>

            <View style={{marginTop: 70, alignItems: 'center'}}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(24),
                  lineHeight: hp(36),
                  fontFamily: fontFamily.poppins600,
                }}>
                Complete Your Profile
              </Text>

              <Text
                style={{
                  marginHorizontal: wp(31),
                  fontFamily: fontFamily.poppins400,
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  color: colors.black,
                  textAlign: 'center',
                  marginTop: hp(27),
                }}>
                Your privacy is our priority. Take{'\n'}advantage of our
                security features,{'\n'}and be assured that your information is
                {'\n'}in safe hands
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              // onPress={handleButtonClick}
              onPress={() => {
                setModalVisible(false);
              }}
              style={{
                // backgroundColor: 'red',
                flex: 1,
                position: 'absolute',
                bottom: 50,
              }}>
              <LinearGradient
                colors={['#0F52BA', '#BA0FA9']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 2}}
                style={{
                  marginTop: hp(50),
                  width: wp(176),
                  height: hp(50),
                  borderRadius: 25,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.white,
                    textAlign: 'center',
                    fontSize: fontSize(16),
                    lineHeight: hp(26),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  Let’s do it
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Abc;
