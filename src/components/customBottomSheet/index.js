import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const CustomBottomSheet = ({ref}) => {
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  return (
    <BottomSheet
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}>
      <View style={{backgroundColor: 'white', padding: 20}}>
        <Text>Content inside the bottom sheet</Text>
      </View>
    </BottomSheet>
  );
};

export default CustomBottomSheet;
