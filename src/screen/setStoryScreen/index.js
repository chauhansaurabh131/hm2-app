import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video'; // Import Video component

const SetStoryScreen = ({route}) => {
  const navigation = useNavigation();
  const {mediaUri} = route.params;
  const [description, setDescription] = useState('');
  const [isVideo, setIsVideo] = useState(false); // Track if the media is a video

  useEffect(() => {
    // Check if the mediaUri ends with a video file extension
    if (mediaUri && mediaUri.endsWith('.mp4')) {
      setIsVideo(true); // Set isVideo to true if it's a video
    }
  }, [mediaUri]); // Only run this effect when mediaUri changes

  const handleSharePress = () => {
    // Navigate to the desired screen in StackNavigator2 and pass data as route parameters
    navigation.navigate('HomeTabs', {
      screen: 'Home',
      params: {sharedMedia: {mediaUri, description}},
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView>
        {/* Render video if isVideo is true, otherwise render image */}
        {isVideo ? (
          <Video
            source={{uri: mediaUri}}
            style={styles.video}
            resizeMode="cover"
            repeat={true}
          />
        ) : (
          <Image
            source={{uri: mediaUri}}
            style={styles.image}
            resizeMode="stretch"
          />
        )}

        <View style={styles.bodyContainer}>
          <TextInput
            style={styles.captionInput}
            placeholder="Write caption"
            placeholderTextColor={colors.white}
            value={description}
            onChangeText={text => setDescription(text)}
            multiline={true}
            textAlignVertical="top"
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.goBack();
              }}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                style={styles.backButtonGradient}>
                <View style={styles.backButtonContainer}>
                  <Text style={styles.backButtonText}>Back</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSharePress}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  width: wp(93),
                  height: hp(50),
                  borderRadius: 10,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.white,
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins600,
                  }}>
                  Share
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    width: '100%',
    height: 560,
    resizeMode: 'contain',
  },
  video: {
    width: '100%',
    height: 560,
    backgroundColor: 'black',
  },
  captionInput: {
    height: 86,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: colors.white,
    backgroundColor: '#2B2B2B',
    paddingLeft: 20,
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 17,
  },
  button: {
    width: wp(45),
    height: hp(50),
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize(14),
    fontFamily: fontFamily.poppins600,
  },
  bodyContainer: {
    marginHorizontal: 17,
    marginTop: hp(10),
  },
  backButtonGradient: {
    width: wp(93),
    height: hp(50),
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: 'transparent',
  },
  backButtonContainer: {
    borderRadius: 10,
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    margin: isIOS ? 0 : 1,
  },
  backButtonText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: colors.white,
    margin: 10,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
  },
  shareButtonGradient: {
    width: wp(93),
    height: hp(50),
    borderRadius: 10,
    justifyContent: 'center',
  },
});

export default SetStoryScreen;
