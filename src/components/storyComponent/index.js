import React from 'react';
import {
  Image,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {DemoImage} from '../../utils/data';
import LinearGradient from 'react-native-linear-gradient';
import {images} from '../../assets';
import {useNavigation, useRoute} from '@react-navigation/native';

const StoryComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {sharedMedia} = route.params ?? {};

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={{padding: 7}}>
        <TouchableOpacity
          onPress={() => {
            if (sharedMedia) {
              navigation.navigate('StoryShowComponent', {sharedMedia}); // Navigate to StoryShowComponent with sharedMedia data
            } else {
              navigation.navigate('OpenGalleryStoryScreen'); // Navigate to OpenGalleryStoryScreen if sharedMedia is not available
            }
          }}>
          {sharedMedia ? (
            <Image
              source={{uri: sharedMedia.mediaUri}}
              style={styles.usersImage}
            />
          ) : (
            <Image
              source={images.story_Add_Image}
              style={[
                styles.usersImage,
                {
                  backgroundColor: '#F5F5F5',
                  resizeMode: 'stretch',
                  marginLeft: -5,
                },
              ]}
            />
          )}
        </TouchableOpacity>
      </View>
      {DemoImage.map((item, index) => (
        <View
          key={index}
          style={{
            width: 55,
            padding: 5,
            marginLeft: 2,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('StoryShowComponent', {sharedMedia});
            }}>
            <LinearGradient
              colors={['#0F52BA', '#0F52BA', '#0F52BA']}
              style={{padding: 2.5, borderRadius: 50}}>
              <Image source={item.image} style={styles.usersImage} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default StoryComponent;

const styles = StyleSheet.create({
  usersImage: {
    height: 40,
    width: 40,
    borderRadius: 50,
    borderColor: '#ffffff',
  },
});
