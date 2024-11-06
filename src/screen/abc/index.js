import React, {useRef} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

const Abc = () => {
  const sheetRef = useRef(null);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => sheetRef.current.open()} // Open the bottom sheet on click
        style={styles.button}>
        <Text style={styles.buttonText}>Open</Text>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <RBSheet
        ref={sheetRef}
        height={300} // Height of the bottom sheet
        // openDuration={250} // Duration of the opening animation
        closeOnDragDown={true} // Allow closing the sheet by dragging it down
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        {/* Content inside the bottom sheet */}
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetText}>
            This is the bottom sheet content!
          </Text>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomSheetContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetText: {
    fontSize: 18,
  },
});

export default Abc;
