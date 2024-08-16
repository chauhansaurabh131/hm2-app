import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  FlatList,
  Image,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {hp} from '../../utils/helpers';

const {width} = Dimensions.get('window');

const ImagePaginationComponent = ({imageUrls}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef(null);

  const renderItem = ({item}) => (
    <View style={{flex: 1}}>
      <Image
        source={{uri: item}}
        style={{width: width, height: hp(500), backgroundColor: 'black'}}
        resizeMode="contain"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
        style={styles.gradient}
      />
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
        data={imageUrls}
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
        {imageUrls.map((_, index) => (
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
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200, // Adjust the height as per your requirement
  },
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

export default ImagePaginationComponent;
