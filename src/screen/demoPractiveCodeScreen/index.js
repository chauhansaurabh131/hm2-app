import React, {useMemo, useRef} from 'react';
import {Button, SafeAreaView, Text, View} from 'react-native';
import BottomSheet, {
  BottomSheetModalProvider,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import {useIsFocused} from '@react-navigation/native'; // Import the hook for detecting focus

const DemoPractiveCodeScreen = () => {
  const snapPoints = useMemo(() => ['50%', '75%'], []);
  const bottomSheetRef = useRef(null);
  const isFocused = useIsFocused(); // Check if the screen is focused

  const handleOpenBottom = () => bottomSheetRef.current?.expand();
  const handleCloseBottom = () => bottomSheetRef.current?.close();

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
        <Button title={'open'} onPress={handleOpenBottom} />
        <Button title={'Close'} onPress={handleCloseBottom} />
        {isFocused && ( // Conditionally render based on screen focus
          <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
            <View>
              <Text>Bottom Sheet</Text>
            </View>
          </BottomSheet>
        )}
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default DemoPractiveCodeScreen;
