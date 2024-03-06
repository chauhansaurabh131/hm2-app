import React, {useMemo, useRef} from 'react';
import {Button, SafeAreaView, Text} from 'react-native';
import BottomSheet, {useBottomSheetModal} from '@gorhom/bottom-sheet';

const AlertsScreen = () => {
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
  const bottomSheetRef = useRef(null);

  // const Open = () => bottomSheetRef.current?.expand();
  const Open = () => bottomSheetRef?.current?.expand();
  const Closr = () => bottomSheetRef.current?.close();

  return (
    <SafeAreaView style={{flex: 1}}>
      <Button title={'Open'} onPress={Open} />
      <Button title={'close'} onPress={Closr} />
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <Text>Bottom,</Text>
      </BottomSheet>
    </SafeAreaView>
  );
};
export default AlertsScreen;
