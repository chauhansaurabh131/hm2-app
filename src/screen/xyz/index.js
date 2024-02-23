import React, {Fragment, ReactNode, useEffect, useState} from 'react';
import {Pressable, StyleSheet, SafeAreaView, Button, Text} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInDown,
  SlideOutDown,
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
import {useRoute} from '@react-navigation/native';

const PressAnimated = Animated.createAnimatedComponent(Pressable);
const HEIGHT = 300;
const CLAMP = 20;

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const offset = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onChange(event => {
      const offsetDelta = event.changeY + offset.value;
      const clamp = Math.max(-CLAMP, offsetDelta);
      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < HEIGHT / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(HEIGHT, {}, () => {
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
      <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <Button
          title={isOpen ? 'Close' : 'Open'}
          onPress={() => setIsOpen(prevState => !prevState)}
        />
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
                entering={SlideInDown.springify().damping(12)}
                exiting={SlideOutDown}
                style={[styles.view, translateY]}>
                {/* Your component in bottom sheet */}

                <Text>sjdvksdvkn</Text>
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
    zIndex: 1,
  },
  view: {
    backgroundColor: 'white',
    height: HEIGHT,
    width: '100%',
    position: 'absolute',
    bottom: -CLAMP * 1.1,
    zIndex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default App;
