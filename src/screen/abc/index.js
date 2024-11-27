import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

const Abc = () => {
  const refRBSheet = useRef();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleLogoutPress = () => {
    refRBSheet.current.close(); // Close the bottom sheet
    setTimeout(() => {
      setModalVisible(true); // Open the modal after closing the bottom sheet
    }, 250); // Delay to ensure smooth transition
  };

  const confirmLogout = () => {
    setModalVisible(false); // Close the modal
    console.log('Logged Out'); // Replace with actual logout functionality
  };

  const cancelLogout = () => {
    setModalVisible(false); // Close the modal
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Trigger to open the bottom sheet */}
      <TouchableOpacity onPress={() => refRBSheet.current.open()}>
        <Text style={styles.openText}>Open</Text>
      </TouchableOpacity>

      {/* Bottom Sheet Component */}
      <RBSheet
        ref={refRBSheet}
        height={300}
        openDuration={250}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        {/* Content inside the bottom sheet */}
        <SafeAreaView style={styles.sheetContent}>
          <TouchableOpacity onPress={handleLogoutPress}>
            <Text style={styles.sheetText}>Log Out</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </RBSheet>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={cancelLogout}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelLogout}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  openText: {
    fontSize: 18,
    color: 'blue',
  },
  sheetContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetText: {
    fontSize: 16,
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  confirmButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Abc;
