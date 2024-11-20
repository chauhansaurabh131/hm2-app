import React, {useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Pinchable from 'react-native-pinchable';
import FastImage from 'react-native-fast-image';

const {width} = Dimensions.get('window');

const ImagePaginationAndPinableComponent = ({images}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef(null);

  const renderItem = ({item}) => {
    return (
      <View style={{flex: 1, backgroundColor: 'black'}}>
        <Pinchable>
          <FastImage
            source={{uri: item}}
            style={{width: width, height: '100%'}}
            resizeMode="contain"
          />
        </Pinchable>
      </View>
    );
  };

  const handleScroll = event => {
    if (event && event.nativeEvent && event.nativeEvent.contentOffset) {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / width);
      setCurrentPage(index);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* FlatList to render images */}
      <FlatList
        ref={flatListRef}
        data={images} // Pass the images prop here
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Pagination as vertical line */}
      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationLine,
              currentPage >= index && styles.paginationLineActive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    position: 'absolute',
    top: 10, // Place near the top
    width: '90%', // Almost full screen width
    flexDirection: 'row',
    justifyContent: 'space-between', // Spread lines evenly
    alignSelf: 'center',
  },
  paginationLine: {
    height: 2, // Thickness of the line
    flex: 1, // Each line takes equal space
    backgroundColor: 'grey',
    marginHorizontal: 4, // Small gap between lines
  },
  paginationLineActive: {
    backgroundColor: 'white', // Highlight active line
  },
});

export default ImagePaginationAndPinableComponent;
