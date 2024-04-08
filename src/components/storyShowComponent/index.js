// import React from 'react';
// import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
//
// const StoryShowComponent = ({onPress}) => {
//   return (
//     <SafeAreaView style={{flex: 1, backgroundColor: 'orange'}}>
//       <TouchableOpacity
//         onPress={onPress}
//         style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text>Story Show Component</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };
//
// export default StoryShowComponent;

import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {icons, images} from '../../assets';
import Video from 'react-native-video';

const {height, width} = Dimensions.get('window');

const StoryShowComponent = () => {
  const navigation = useNavigation();
  const [current, setCurrent] = useState(0);
  const [content, setContent] = useState([
    {
      content: require('../../assets/images/couple_One.png'),
      type: 'image',
      finish: 0,
    },
    {
      content: require('../../assets/images/video_one.mp4'),
      type: 'video',
      finish: 0,
    },
    {
      content: require('../../assets/images/couple_Two.png'),
      type: 'image',
      finish: 0,
    },
    {
      content: require('../../assets/images/demo_5.png'),
      type: 'image',
      finish: 0,
    },
    {
      content: require('../../assets/images/demo_3.png'),
      type: 'image',
      finish: 0,
    },
  ]);

  const progress = useRef(new Animated.Value(0)).current;

  const start = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished || progress._value > 0.5) {
        next();
      }
    });
  };

  const play = () => {
    start();
  };

  const next = () => {
    if (current !== content.length - 1) {
      let tempData = content;
      tempData[current].finish = 1;
      setContent(tempData);
      setCurrent(current + 1);
      progress.setValue(0);
    } else {
      close();
    }
  };

  const previous = () => {
    if (current - 1 >= 0) {
      let tempData = content;
      tempData[current].finish = 0;
      setContent(tempData);
      progress.setValue(0);
      setCurrent(current - 1);
    } else {
      close();
    }
  };

  const close = () => {
    progress.setValue(0);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
      {content[current].type === 'video' ? (
        <Video
          source={content[current].content}
          resizeMode="cover"
          paused={false}
          onLoad={play}
          onEnd={next}
          style={{width: width, height: height}}
        />
      ) : (
        <Image
          source={content[current].content}
          onLoadEnd={start}
          style={{width: width, height: height, resizeMode: 'cover'}}
        />
      )}

      <View
        style={{
          width: width,
          position: 'absolute',
          top: 10,
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        {content.map((item, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              height: 3,
              backgroundColor: 'rgba(255,255,255,.5)',
              marginLeft: 5,
              flexDirection: 'row',
            }}>
            <Animated.View
              style={{
                flex: current === index ? progress : content[index].finish,
                height: 3,
                backgroundColor: 'rgba(255,255,255,1)',
              }}
            />
          </View>
        ))}
      </View>

      <View
        style={{
          width: width,
          height: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'absolute',
          top: 30,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={images.profileDisplayImage}
            style={{width: 40, height: 40, borderRadius: 20, marginLeft: 20}}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              marginLeft: 15,
              color: 'white',
            }}>
            Riya
          </Text>
        </View>
        <TouchableOpacity
          style={{marginRight: 20, marginTop: 15}}
          onPress={close}>
          <Image
            source={icons.x_cancel_icon}
            style={{width: 24, height: 24, tintColor: 'white'}}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: width,
          height: height,
          position: 'absolute',
          top: 100,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{width: '30%', height: '100%'}}
          onPress={previous}>
          <View />
        </TouchableOpacity>
        <TouchableOpacity style={{width: '30%', height: '100%'}} onPress={next}>
          <View />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StoryShowComponent;
