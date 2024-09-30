import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, Text, StyleSheet, Image} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {hp} from '../../utils/helpers';

const DemoCode = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      text: 'Card 1',
      images: [
        require('../../assets/images/couple_One.png'),
        require('../../assets/images/couple_Two.png'),
        require('../../assets/images/couple_Three.png'),
      ],
    },
    {
      id: 2,
      text: 'Card 2',
      image: require('../../assets/images/couple_Two.png'),
    },
    {
      id: 3,
      text: 'Card 3',
      image: require('../../assets/images/couple_Three.png'),
    },
    {
      id: 4,
      text: 'Card 4',
      image: require('../../assets/images/couple_img_three.png'),
    },
    {
      id: 5,
      text: 'Card 5',
      image: require('../../assets/images/couple_logo.png'),
    },
  ]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCardId, setActiveCardId] = useState(1); // Track the active card ID

  useEffect(() => {
    let interval;

    if (activeCardId === 1) {
      // Only change images if Card 1 is active
      interval = setInterval(() => {
        setCurrentImageIndex(
          prevIndex => (prevIndex + 1) % cards[0].images.length,
        );
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [activeCardId, cards[0].images.length]);

  const renderCard = card => {
    const isCardOne = card.id === 1;

    return (
      <View style={styles.card}>
        <Image
          source={isCardOne ? card.images[currentImageIndex] : card.image}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <Text style={styles.cardText}>{card.text}</Text>
      </View>
    );
  };

  const onSwiped = cardIndex => {
    setActiveCardId(cards[cardIndex + 1]?.id || null); // Set the active card ID when swiping
  };

  const onSwipedAll = () => {
    console.log('All cards swiped');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        cards={cards}
        renderCard={renderCard}
        onSwipedAll={onSwipedAll}
        onSwiped={onSwiped} // Handle card swipe event
        stackSize={3}
        backgroundColor="white"
        cardIndex={0}
        animateOverlayLabelsOpacity
        verticalSwipe={false}
        horizontalSwipe={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardText: {
    fontSize: 24,
    color: 'black',
    marginBottom: 20,
  },
  cardImage: {
    width: '95%',
    height: hp(606),
  },
});

export default DemoCode;
