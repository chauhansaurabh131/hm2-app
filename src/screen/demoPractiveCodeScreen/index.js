import React, {useState, useRef} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const DemoPractiveCodeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [textLayout, setTextLayout] = useState(null);
  const textRef = useRef(null);

  const handleLoaderClick = () => {
    setIsLoading(true);

    // Simulate a network request or any async operation
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Loader will be visible for 3 seconds
  };

  const onTextLayout = event => {
    setTextLayout(event.nativeEvent.layout);
  };

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={handleLoaderClick} style={{marginBottom: 20}}>
        <Text>LOADER</Text>
      </TouchableOpacity>

      {/*<ShimmerPlaceholder*/}
      {/*  style={{width: 100, height: 100, borderRadius: 50}}*/}
      {/*  // shimmerColors={['#564d4d', '#8e8e8e', '#564d4d']}*/}
      {/*/>*/}

      <View style={{width: '100%'}}>
        <FlatList
          data={[1, 1, 1, 1, 1, 1, 1, 1]}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: '100%',
                  height: 100,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <ShimmerPlaceholder
                  style={{width: 100, height: 100, borderRadius: 50}}
                  // shimmerColors={['#564d4d', '#8e8e8e', '#564d4d']}
                />
                <View style={{marginLeft: 10}}>
                  <ShimmerPlaceholder
                    style={{width: 100, height: 20}}
                    // shimmerColors={['#564d4d', '#8e8e8e', '#564d4d']}
                  />
                  <ShimmerPlaceholder
                    style={{width: 100, height: 20, marginTop: 10}}
                    // shimmerColors={['#564d4d', '#8e8e8e', '#564d4d']}
                  />
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default DemoPractiveCodeScreen;
