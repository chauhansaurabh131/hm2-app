import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import style from './style';

const SelectImageScreen = ({route}) => {
  const navigation = useNavigation();
  const {photos} = route.params;
  const [selectedItems, setSelectedItems] = useState([]);

  // Function to toggle selection of an item
  const toggleSelection = item => {
    const index = selectedItems.findIndex(
      selectedItem => selectedItem === item,
    );
    if (index !== -1) {
      // Item is already selected, remove it from selectedItems
      setSelectedItems(
        selectedItems.filter(selectedItem => selectedItem !== item),
      );
    } else {
      // Item is not selected, add it to selectedItems
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Function to check if an item is selected
  const isSelected = item => {
    return selectedItems.includes(item);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={style.bodyContainer}>
        <View style={style.imageHeaderContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image source={icons.x_cancel_icon} style={style.cancelIconStyle} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5}>
            <Image
              source={images.profileDisplayImage}
              style={style.profileLogoStyle}
            />
          </TouchableOpacity>
        </View>

        <View style={style.subHeadingContainer}>
          <View style={style.subTextImageContainer}>
            <Text style={style.subTextTittleStyle}>Gallery</Text>

            <Image
              source={icons.down_arrow_icon}
              style={style.dropImageStyle}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddProfilePictureScreen', {selectedItems});
            }}>
            <Image
              source={icons.back_arrow_icon}
              style={style.nextArrowIconStyle}
            />
          </TouchableOpacity>
        </View>

        <View style={{alignItems: 'center', width: '100%'}} />
      </View>
      <View style={style.flatListContainer}>
        <FlatList
          data={photos}
          numColumns={3}
          contentContainerStyle={style.contentContainerStyle}
          renderItem={({item, index}) => {
            const isVideo = item.node.image.uri.endsWith('.mp4');
            const selected = isSelected(item);
            return (
              <TouchableOpacity
                onPress={() =>
                  isVideo ? setSelectedItems([item]) : toggleSelection(item)
                }
                style={[
                  style.flatListImageContainer,
                  {width: Dimensions.get('window').width / 3},
                ]}>
                <Image
                  source={{uri: item.node.image.uri}}
                  style={style.imageStyle}
                />
                {selected && (
                  <View style={style.selectedContainer}>
                    <Image
                      source={icons.select_white_icon}
                      style={style.selectIconStyle}
                    />
                  </View>
                )}
                {isVideo && (
                  <View
                    style={[
                      style.videoImageContainer,
                      {transform: [{translateX: -12.5}, {translateY: -12.5}]},
                    ]}>
                    <Image
                      source={icons.video_play_icon}
                      style={style.videoIconStyle}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SelectImageScreen;
