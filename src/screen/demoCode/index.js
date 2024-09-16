import React, {useState, useEffect} from 'react';
import {Dimensions, View, Text, Image, StyleSheet} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {images} from '../../assets';
import {wp} from '../../utils/helpers'; // Update your image imports as necessary

const {width: viewportWidth} = Dimensions.get('window');

const DemoCode = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aImageIndex, setAImageIndex] = useState(0);
  const [bImageIndex, setBImageIndex] = useState(0); // State for B images

  // Define images for title 'A'
  const aImages = [
    images.looking_love_img,
    images.couple_One_Image,
    images.couple_Two_Image,
    images.couple_Three_Image,
  ];

  // Define images for title 'B'
  const bImages = [
    images.couple_Three_Image,
    images.demo_Five_Image,
    images.demo_Two_Image,
  ];

  const imageDatas = [
    {id: '1', source: aImages[aImageIndex], title: 'A'},
    {id: '2', source: bImages[bImageIndex], title: 'B'}, // Update for multiple images for B
    {id: '3', source: images.movie_date_img, title: 'C'},
    {id: '4', source: images.foodies_img, title: 'D'},
    {id: '5', source: images.travel_Buddies_img, title: 'E'},
    {id: '6', source: images.game_lover_img, title: 'F'},
    {id: '7', source: images.chit_chat_img, title: 'G'},
    {id: '8', source: images.adventurous_img, title: 'H'},
  ];

  // Separate useEffect for A images
  useEffect(() => {
    if (imageDatas[currentIndex].title === 'A') {
      const interval = setInterval(() => {
        setAImageIndex(prevIndex => (prevIndex + 1) % aImages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, aImageIndex]);

  // Separate useEffect for B images
  useEffect(() => {
    if (imageDatas[currentIndex].title === 'B') {
      const interval = setInterval(() => {
        setBImageIndex(prevIndex => (prevIndex + 1) % bImages.length);
        console.log('B Image Index Updated:', bImageIndex); // Logging for debugging
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, bImageIndex]);

  const handleSwiped = index => {
    setCurrentIndex(index % imageDatas.length);
  };

  const renderPagination = () => {
    const totalDots =
      imageDatas[currentIndex].title === 'A'
        ? aImages.length
        : imageDatas[currentIndex].title === 'B'
        ? bImages.length
        : 1; // Adjust for other images that don't have multiple slides

    const activeIndex =
      imageDatas[currentIndex].title === 'A'
        ? aImageIndex
        : imageDatas[currentIndex].title === 'B'
        ? bImageIndex
        : 0;

    return (
      <View style={styles.paginationContainer}>
        {Array.from({length: totalDots}).map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderCard = (item, index) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={item.source} style={styles.image} />
        <View style={styles.paginationWrapper}>
          {index === currentIndex && renderPagination()}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={imageDatas}
        renderCard={card => renderCard(card, imageDatas.indexOf(card))}
        cardIndex={currentIndex}
        backgroundColor={'#f7f7f7'}
        stackSize={3}
        infinite={true}
        onSwiped={handleSwiped}
        onSwipedRight={cardIndex => {
          console.log('Liked:', imageDatas[cardIndex]);
        }}
        onSwipedLeft={cardIndex => {
          console.log('Disliked:', imageDatas[cardIndex]);
        }}
        verticalSwipe={false}
        horizontalSwipe={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 5,
    padding: 10,
    backgroundColor: 'orange',
    position: 'relative',
  },
  paginationWrapper: {
    position: 'absolute',
    top: 10,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  image: {
    width: wp(300),
    height: '100%',
    borderRadius: 10,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  paginationContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paginationDot: {
    width: 35,
    height: 8,
    borderRadius: 4,
    margin: 5,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  inactiveDot: {
    backgroundColor: 'black',
  },
});

export default DemoCode;
