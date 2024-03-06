import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  FlatList,
  Image,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {images} from '../../assets'; // Assuming you have your images imported correctly
import {hp, screenWidth} from '../../utils/helpers';

const {width} = Dimensions.get('window');

const ImagePaginationComponent = () => {
  const User_Pictures = [
    {
      id: '1',
      pic: images.user_one_Image,
    },
    {
      id: '2',
      pic: images.user_Two_Image,
    },
    {
      id: '3',
      pic: images.demo_Six_Image,
    },
    {
      id: '4',
      pic: images.demo_Seven_Image,
    },
    {
      id: '5',
      pic: images.demo_Three_Image,
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef(null);

  const renderItem = ({item}) => (
    <Image
      source={item.pic}
      style={{width: width, height: hp(500)}}
      resizeMode="contain"
    />
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
        data={User_Pictures}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold: 50}}
        scrollEventThrottle={16}
      />
      <View style={styles.pagination}>
        {User_Pictures.map((_, index) => (
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
    // backgroundColor: '#888',
    backgroundColor: 'grey',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
});

export default ImagePaginationComponent;
