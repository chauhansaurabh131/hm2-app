import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import CommonGradientButton from '../../components/commonGradientButton';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const NewMainScreen = () => {
  const navigation = useNavigation();

  const imageData = [
    {id: '1', src: images.main_Screen_Img_one},
    {id: '2', src: images.main_Screen_Img_two},
    {id: '3', src: images.main_Screen_Img_three},
    {id: '4', src: images.main_Screen_Img_four},
  ];

  const texts = [
    'Single App\n Multiple Choices',
    'Create\n Long Term Profile',
    'Create\n Dating Profile',
    'Create\n Social Profile',
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity for text
  const flatListRef = useRef(null); // Ref for FlatList

  // Initialize Animated Values for dots
  const dotAnimations = texts.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update image index
      const nextIndex = (currentIndex + 1) % imageData.length; // Use +1 instead of +0.9
      setCurrentIndex(nextIndex);

      // Scroll to the next image
      flatListRef.current.scrollToIndex({index: nextIndex, animated: true});

      // Start fade-out animation for text
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300, // Fade-out duration
        useNativeDriver: true,
      }).start(() => {
        // Update text index
        const nextTextIndex = (currentTextIndex + 1) % texts.length;
        setCurrentTextIndex(nextTextIndex);

        // Animate dot color transitions
        Animated.parallel([
          Animated.timing(dotAnimations[currentTextIndex], {
            toValue: 0, // Transition to gray
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(dotAnimations[nextTextIndex], {
            toValue: 1, // Transition to black
            duration: 400,
            useNativeDriver: false,
          }),
        ]).start();

        // Start fade-in animation for text
        Animated.timing(fadeAnim, {
          duration: 400,
          toValue: 1, // Fade-in duration
          useNativeDriver: true,
        }).start();
      });
    }, 2000); // Change image and text every 2 seconds

    return () => clearInterval(intervalId);
  }, [
    currentTextIndex,
    currentIndex,
    fadeAnim,
    dotAnimations,
    imageData.length,
    texts.length,
  ]);

  // Helper function to get item layout
  const getItemLayout = (data, index) => ({
    length: wp(169) + wp(10) * 0.5, // Item width + horizontal margins
    offset: (wp(169) + wp(10) * 0.5) * index,
    index,
  });

  // Helper function to handle scroll to index failures
  const onScrollToIndexFailed = info => {
    const {index} = info;
    // You can use this function to handle cases where scrollToIndex fails
    console.warn('Failed to scroll to index:', index);
  };

  const OnGetStarted = () => {
    navigation.navigate('NewSignUpScreen');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Image
        source={images.happyMilanColorLogo}
        style={{
          marginTop: hp(29),
          marginLeft: wp(33),
          resizeMode: 'stretch',
          width: hp(96),
          height: hp(24),
        }}
      />

      <View style={{marginTop: hp(30)}}>
        <FlatList
          ref={flatListRef}
          data={imageData}
          horizontal
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={{marginHorizontal: wp(10)}}>
              <Image
                source={item.src}
                style={{
                  width: wp(169),
                  height: hp(240),
                  resizeMode: 'contain',
                }}
              />
            </View>
          )}
          contentContainerStyle={{paddingHorizontal: wp(20)}}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          getItemLayout={getItemLayout} // Add getItemLayout
          onScrollToIndexFailed={onScrollToIndexFailed} // Add onScrollToIndexFailed
        />

        {/* Animated Text */}
        <Animated.Text
          style={{
            marginTop: hp(20),
            textAlign: 'center',
            color: colors.black,
            opacity: fadeAnim, // Bind opacity to animated value
            fontSize: hp(28),
            lineHeight: hp(42),
            fontFamily: fontFamily.poppins700,
          }}>
          {texts[currentTextIndex]}
        </Animated.Text>

        <Text
          style={{
            textAlign: 'center',
            color: colors.black,
            marginTop: hp(17),
            fontSize: fontSize(12),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins400,
          }}>
          Welcome to HappyMilan your hub for finding a life
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: colors.black,
            fontSize: fontSize(12),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins400,
          }}>
          partner, exploring dating opportunities, and{' '}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: colors.black,
            fontSize: fontSize(12),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins400,
          }}>
          making new friends.{' '}
        </Text>

        {/* Pagination Dots with Color Animation */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            // backgroundColor: 'red',
            // marginTop: hp(10),
          }}>
          {texts.map((_, index) => {
            const dotColor = dotAnimations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [colors.gray, colors.black], // Transition from gray to black
            });

            return (
              <Animated.View
                key={index}
                style={{
                  height: hp(15),
                  width: hp(15),
                  borderRadius: hp(50),
                  marginHorizontal: wp(10),
                  backgroundColor: dotColor, // Bind backgroundColor to animated value
                  marginTop: hp(35),
                }}
              />
            );
          })}
        </View>

        <View style={{marginHorizontal: 34}}>
          <CommonGradientButton
            buttonName={'Get Started'}
            containerStyle={{width: wp(300), marginTop: hp(35)}}
            onPress={OnGetStarted}
            // loading={loading}
          />

          <TouchableOpacity
            style={{
              width: wp(300),
              height: hp(50),
              borderWidth: 1,
              borderColor: '#D8D8D8',
              borderRadius: 30,
              alignSelf: 'center',
              marginTop: hp(19),
              justifyContent: 'center',
            }}
            onPress={() => {
              navigation.navigate('NewLogInScreen');
            }}>
            <Text
              style={{
                color: colors.black,
                textAlign: 'center',
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins500,
              }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewMainScreen;
