import React, {useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
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

  const renderItem = ({item}) => (
    <View style={{flex: 1}}>
      <Pinchable>
        <FastImage
          source={{uri: item}} // Display the image from the URI
          style={{width: width, height: '100%'}}
          resizeMode="stretch"
        />
      </Pinchable>
    </View>
  );

  const handleScroll = event => {
    if (event && event.nativeEvent && event.nativeEvent.contentOffset) {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / width);
      setCurrentPage(index);
    }
  };

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index || 0);
    }
  }).current;

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        ref={flatListRef}
        data={images} // Pass the images prop here
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold: 50}}
        scrollEventThrottle={16}
      />
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentPage === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pagination: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 13,
    justifyContent: 'space-evenly',
  },
  paginationDot: {
    width: 48.53,
    height: 3,
    borderRadius: 4,
    backgroundColor: 'grey',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
});

export default ImagePaginationAndPinableComponent;
