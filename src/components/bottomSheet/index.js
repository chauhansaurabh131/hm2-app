import React, {Fragment, useEffect} from 'react';
import {
  Pressable,
  StyleSheet,
  SafeAreaView,
  Button,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInUp,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import {fontSize, hp, isIOS} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {colors} from '../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

const PressAnimated = Animated.createAnimatedComponent(Pressable);
const HEIGHT = isIOS ? 530 : 500;
const CLAMP = 20;

function BottomSheet({isOpen, setIsOpen}) {
  const offset = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onChange(event => {
      const offsetDelta = event.changeY + offset.value;
      const clamp = Math.min(CLAMP, offsetDelta);
      offset.value = offsetDelta < 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value > -HEIGHT / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(-HEIGHT, {}, () => {
          runOnJS(handleBackdropPress)();
        });
      }
    });

  const translateY = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: offset.value,
        },
      ],
    };
  }, []);

  const handleBackdropPress = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    function onOpen() {
      if (isOpen) {
        offset.value = 0;
      }
    }
    onOpen();
  }, [isOpen]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'green',
          zIndex: 99,
        }}>
        {isOpen && (
          <Fragment>
            <PressAnimated
              onPress={handleBackdropPress}
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.backdrop}
            />
            <GestureDetector gesture={panGesture}>
              <Animated.View
                entering={SlideInUp.springify().damping(12)}
                exiting={SlideOutUp}
                style={[styles.view, translateY]}>
                {/* Your component in top sheet */}
                <View
                  style={{
                    marginTop: 23,
                    marginHorizontal: 27,
                  }}>
                  <Image
                    source={images.profileDisplayImage}
                    style={{
                      height: hp(60),
                      width: hp(60),
                      borderRadius: 50,
                      marginTop: hp(23),
                    }}
                  />
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: fontSize(22),
                      lineHeight: hp(33),
                      fontWeight: '600',
                      marginTop: hp(10),
                    }}>
                    Riya Shah
                  </Text>
                  <View style={{flexDirection: 'row', marginTop: hp(3)}}>
                    {/* Content */}
                  </View>
                </View>
              </Animated.View>
            </GestureDetector>
          </Fragment>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    flex: 1,
    zIndex: 1,
  },
  view: {
    backgroundColor: 'white',
    height: HEIGHT,
    width: '100%',
    position: 'absolute',
    top: -110, // Set top to 0 to position the sheet at the top of the screen
    zIndex: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default BottomSheet;
