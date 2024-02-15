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

const StoryComponent = () => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={{padding: 7}}>
        <TouchableOpacity>
          <Image
            source={images.story_Add_Image}
            style={[
              styles.usersImage,
              {
                backgroundColor: '#F5F5F5',
                resizeMode: 'stretch',
                marginLeft: -5,
                // marginLeft: 10,
              },
            ]}
          />
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
          <TouchableOpacity activeOpacity={0.7}>
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
