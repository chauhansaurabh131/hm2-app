import React, {useRef} from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

const Abc = () => {
  // Create a reference to the Bottom Sheet
  const threeDotBottomSheetRef = useRef();

  // Function to open the Bottom Sheet
  const openBottomSheet = () => {
    threeDotBottomSheetRef.current.open();
  };

  return (
    <SafeAreaView>
      {/* TouchableOpacity to make the Text clickable */}
      <TouchableOpacity onPress={openBottomSheet}>
        <Text>Click to open Bottom Sheet</Text>
      </TouchableOpacity>

      {/* Bottom Sheet Component */}
      <RBSheet
        ref={threeDotBottomSheetRef}
        closeOnDragDown={true} // Allows drag to close
        closeOnPressMask={true} // Allows closing when clicking outside the sheet
        height={300} // Adjust height of Bottom Sheet
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <Text>This is the content of the Bottom Sheet</Text>
        <Text>
          this is my demo for proper project working or not that why i commit a
          code and run to my real project
        </Text>
      </RBSheet>
    </SafeAreaView>
  );
};

export default Abc;
