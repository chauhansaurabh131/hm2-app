// import React, {Fragment, ReactNode, useEffect, useState} from 'react';
// import {Pressable, StyleSheet, SafeAreaView, Button, Text} from 'react-native';
// import Animated, {
//   FadeIn,
//   FadeOut,
//   runOnJS,
//   SlideInDown,
//   SlideOutDown,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
//   withTiming,
// } from 'react-native-reanimated';
// import {
//   GestureHandlerRootView,
//   Gesture,
//   GestureDetector,
// } from 'react-native-gesture-handler';
// import {useRoute} from '@react-navigation/native';
//
// const PressAnimated = Animated.createAnimatedComponent(Pressable);
// const HEIGHT = 300;
// const CLAMP = 20;
//
// function App() {
//   const [isOpen, setIsOpen] = useState(false);
//   const offset = useSharedValue(0);
//
//   const panGesture = Gesture.Pan()
//     .onChange(event => {
//       const offsetDelta = event.changeY + offset.value;
//       const clamp = Math.max(-CLAMP, offsetDelta);
//       offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
//     })
//     .onFinalize(() => {
//       if (offset.value < HEIGHT / 3) {
//         offset.value = withSpring(0);
//       } else {
//         offset.value = withTiming(HEIGHT, {}, () => {
//           runOnJS(handleBackdropPress)();
//         });
//       }
//     });
//
//   const translateY = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           translateY: offset.value,
//         },
//       ],
//     };
//   }, []);
//
//   const handleBackdropPress = () => {
//     setIsOpen(false);
//   };
//
//   useEffect(() => {
//     function onOpen() {
//       if (isOpen) {
//         offset.value = 0;
//       }
//     }
//     onOpen();
//   }, [isOpen]);
//
//   return (
//     <GestureHandlerRootView style={{flex: 1}}>
//       <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
//         <Button
//           title={isOpen ? 'Close' : 'Open'}
//           onPress={() => setIsOpen(prevState => !prevState)}
//         />
//         {isOpen && (
//           <Fragment>
//             <PressAnimated
//               onPress={handleBackdropPress}
//               entering={FadeIn}
//               exiting={FadeOut}
//               style={styles.backdrop}
//             />
//             <GestureDetector gesture={panGesture}>
//               <Animated.View
//                 entering={SlideInDown.springify().damping(12)}
//                 exiting={SlideOutDown}
//                 style={[styles.view, translateY]}>
//                 {/* Your component in bottom sheet */}
//
//                 <Text>sjdvksdvkn</Text>
//               </Animated.View>
//             </GestureDetector>
//           </Fragment>
//         )}
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// }
//
// const styles = StyleSheet.create({
//   backdrop: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.45)',
//     zIndex: 1,
//   },
//   view: {
//     backgroundColor: 'white',
//     height: HEIGHT,
//     width: '100%',
//     position: 'absolute',
//     bottom: -CLAMP * 1.1,
//     zIndex: 1,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
// });
//
// export default App;

import React, {Fragment, useEffect, useState} from 'react';
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
import {fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {colors} from '../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

const PressAnimated = Animated.createAnimatedComponent(Pressable);
// const HEIGHT = 500;
const HEIGHT = isIOS ? 530 : 500;
const CLAMP = 20;

function App() {
  const [isOpen, setIsOpen] = useState(false);
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
      <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        {/*<Button*/}
        {/*  title={isOpen ? 'Close' : 'Open'}*/}
        {/*  onPress={() => setIsOpen(prevState => !prevState)}*/}
        {/*/>*/}

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
                    flex: 1,
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // marginTop: 23,
                  }}>
                  {/*<Text>sjdvksdvkn</Text>*/}

                  <View
                    style={{
                      // backgroundColor: 'orange',
                      flex: 1,
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
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: fontSize(14),
                          lineHeight: hp(21),
                          fontWeight: '500',
                        }}>
                        HM 10000122
                      </Text>
                      <View
                        style={{
                          height: hp(13),
                          borderWidth: 0.9,
                          borderColor: '#BEBEBE',
                          marginLeft: hp(10),
                          marginRight: hp(10),
                          top: 5,
                        }}
                      />
                      <Text
                        style={{
                          color: '#BEBEBE',
                          fontSize: fontSize(14),
                          lineHeight: hp(21),
                          fontWeight: '500',
                        }}>
                        FREE Profile
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        setIsOpen(false);
                      }}
                      style={{marginTop: hp(9)}}>
                      <LinearGradient
                        colors={['#0D4EB3', '#9413D0']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1.5}}
                        style={{
                          width: 136,
                          height: 40,
                          borderRadius: 10,
                          flexDirection: 'row',
                          // justifyContent: 'center',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={{color: colors.white, marginLeft: hp(20)}}>
                          Upgrade
                        </Text>
                        <Image
                          source={icons.crownIcon}
                          style={{
                            width: hp(18.88),
                            height: hp(16),
                            tintColor: colors.white,
                            marginRight: hp(22.12),
                          }}
                        />
                      </LinearGradient>
                    </TouchableOpacity>

                    <View
                      style={{
                        width: '100%',
                        borderWidth: 0.5,
                        // borderColor: '#F2F2F2',
                        borderColor: colors.gray,
                        marginTop: hp(17),
                        marginRight: 100,
                      }}
                    />

                    <View style={{marginTop: hp(21)}}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          // navigation.navigate('MyProfileScreen');
                          // toggleModal();
                          setIsOpen(false);
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginBottom: hp(19),
                            alignItems: 'center',
                          }}>
                          <Image
                            source={icons.profileLogo}
                            style={{
                              width: hp(17.22),
                              height: hp(16),
                              tintColor: colors.black,
                              resizeMode: 'stretch',
                            }}
                          />
                          <Text
                            style={{
                              color: colors.black,
                              marginLeft: hp(17.78),
                              fontSize: fontSize(14),
                              lineHeight: hp(21),
                              fontWeight: '400',
                            }}>
                            My Profile
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          // navigation.navigate('AccountsScreen');
                          // toggleModal();
                          setIsOpen(false);
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: hp(19),
                          }}>
                          <Image
                            source={icons.settingIcon}
                            style={{
                              width: hp(15.49),
                              height: hp(16),
                              tintColor: colors.black,
                              resizeMode: 'stretch',
                            }}
                          />
                          <Text
                            style={{
                              color: colors.black,
                              marginLeft: hp(18.51),
                              fontSize: fontSize(14),
                              lineHeight: hp(21),
                              fontWeight: '400',
                            }}>
                            Accounts
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          // navigation.navigate('PrivacyScreen');
                          console.log(' press> ', 'press');
                          // toggleModal(); // Close the modal after navigation
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: hp(19),
                          }}>
                          <Image
                            source={icons.logLogo}
                            style={{
                              width: hp(12.44),
                              height: hp(16),
                              tintColor: colors.black,
                              resizeMode: 'stretch',
                            }}
                          />
                          <Text
                            style={{
                              color: colors.black,
                              marginLeft: hp(21.56),
                              fontSize: fontSize(14),
                              lineHeight: hp(21),
                              fontWeight: '400',
                            }}>
                            Privacy Policy
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          // marginBottom: hp(19),
                        }}>
                        <Image
                          source={icons.linkDevicesIcon}
                          style={{
                            width: hp(18.02),
                            height: hp(14),
                            tintColor: colors.black,
                            resizeMode: 'contain',
                          }}
                        />
                        <Text
                          style={{
                            color: colors.black,
                            marginLeft: hp(15.98),
                            fontSize: fontSize(14),
                            lineHeight: hp(21),
                            fontWeight: '400',
                          }}>
                          Link a Device
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          width: '100%',
                          height: 50,
                          backgroundColor: '#F4FAFF',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 10,
                          marginTop: 25,
                        }}>
                        <Text
                          style={{
                            color: colors.black,
                            fontSize: fontSize(14),
                            lineHeight: hp(21),
                            fontWeight: '400',
                          }}>
                          Log Out
                        </Text>
                        <View style={{width: 17}} />
                        <Image
                          source={icons.logOutIcon}
                          style={{width: hp(14.7), height: hp(17.27)}}
                        />
                      </TouchableOpacity>
                    </View>
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
    zIndex: 1,
  },
  view: {
    backgroundColor: 'white',
    height: HEIGHT,
    width: '100%',
    position: 'absolute',
    top: -CLAMP * 1.1,
    zIndex: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default App;
