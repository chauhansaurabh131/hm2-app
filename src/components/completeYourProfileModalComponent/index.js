import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fontSize, hp, wp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';

const CompleteYourProfileModalComponent = ({
  visible,
  onClose,
  onPrimaryPress,
  onSecondaryPress,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            Get more matches—complete your profile!
          </Text>

          {/* Primary Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{width: '100%', marginTop: hp(25)}}
            onPress={onPrimaryPress}>
            <LinearGradient
              colors={['#6A4DE8', '#4C2BBE']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.primaryButton}>
              <Text style={styles.primaryText}>Complete Profile</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSecondaryPress}
            style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Send Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CompleteYourProfileModalComponent;

const styles = StyleSheet.create({
  openButton: {
    alignItems: 'center',
    marginTop: hp(100),
  },
  openText: {
    color: 'black',
    fontSize: fontSize(26),
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(20),
  },

  modalContainer: {
    width: '100%',
    backgroundColor: '#F4F4F4',
    borderRadius: hp(20),
    paddingVertical: hp(30),
    paddingHorizontal: wp(25),
    alignItems: 'center',
  },

  title: {
    textAlign: 'center',
    fontSize: fontSize(18),
    color: '#000',
    fontWeight: '500',
  },

  primaryButton: {
    width: '100%',
    height: hp(50),
    borderRadius: hp(25),
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryText: {
    color: '#FFF',
    fontSize: fontSize(16),
    fontWeight: '600',
  },

  secondaryButton: {
    width: '100%',
    height: hp(50),
    borderRadius: hp(25),
    borderWidth: 1.5,
    borderColor: '#6A4DE8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(15),
    backgroundColor: 'white',
  },

  secondaryText: {
    color: '#6A4DE8',
    fontSize: fontSize(16),
    fontWeight: '500',
  },
});
