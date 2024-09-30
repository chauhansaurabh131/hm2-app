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
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const SelectImageScreen = ({route}) => {
  const navigation = useNavigation();
  const {photos} = route.params;

  const [selectedItems, setSelectedItems] = useState([]);

  // Function to toggle selection of an item
  const toggleSelection = item => {
    const isItemSelected = selectedItems.includes(item);

    if (isItemSelected) {
      // Item is already selected, remove it from selectedItems
      setSelectedItems(
        selectedItems.filter(selectedItem => selectedItem !== item),
      );
    } else if (selectedItems.length < 6) {
      // Item is not selected and the limit of 6 is not reached, add it to selectedItems
      setSelectedItems([...selectedItems, item]);
    } else {
      // Show a message or handle the case where the maximum limit is reached
      alert('You can only select up to 6 images.');
    }
  };

  // Function to check if an item is selected
  const isSelected = item => {
    return selectedItems.includes(item);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{marginHorizontal: wp(18)}}>
        <View
          style={{
            marginTop: hp(18),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={icons.x_cancel_icon}
              style={{width: hp(16), height: hp(16), resizeMode: 'contain'}}
            />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5}>
            <Image
              source={images.profileDisplayImage}
              style={{
                width: hp(24),
                height: hp(24),
                resizeMode: 'stretch',
                borderRadius: 50,
                marginRight: 3,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: hp(20),
            marginBottom: hp(18),
          }}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
                color: colors.black,
              }}>
              Gallery
            </Text>

            <Image
              source={icons.down_arrow_icon}
              style={{
                width: wp(11.31),
                height: hp(6.71),
                resizeMode: 'contain',
                marginLeft: wp(10),
                top: 2,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // console.log(' === selectedItems ===> ', selectedItems);
              navigation.navigate('AddProfilePictureScreen', {
                selectedItems: selectedItems,
              });
            }}>
            <Image
              source={icons.back_arrow_icon}
              style={{
                width: hp(20),
                height: hp(20),
                resizeMode: 'contain',
                marginRight: 3,
                tintColor: colors.blue,
                transform: [{rotate: '180deg'}],
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{flex: 1}}>
        <FlatList
          data={photos}
          numColumns={3}
          contentContainerStyle={{paddingBottom: hp(10)}}
          renderItem={({item, index}) => {
            const isVideo = item.node.image.uri.endsWith('.mp4');
            const selected = isSelected(item);
            return (
              <TouchableOpacity
                onPress={() =>
                  isVideo ? setSelectedItems([item]) : toggleSelection(item)
                }
                style={[
                  {
                    height: 200,
                    borderRadius: 10,
                    backgroundColor: 'grey',
                    margin: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  },
                  {width: Dimensions.get('window').width / 3},
                ]}>
                <Image
                  source={{uri: item.node.image.uri}}
                  style={{width: '100%', height: '100%', position: 'absolute'}}
                />
                {selected && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 10,
                      padding: 5,
                      borderRadius: 5,
                      right: 8,
                    }}>
                    <Image
                      source={icons.select_white_icon}
                      style={{width: hp(12), height: hp(12)}}
                    />
                  </View>
                )}
                {isVideo && (
                  <View
                    style={[
                      {
                        position: 'absolute',
                        bottom: '30%',
                        left: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        padding: 5,
                        borderRadius: 5,
                      },
                      {transform: [{translateX: -12.5}, {translateY: -12.5}]},
                    ]}>
                    <Image
                      source={icons.video_play_icon}
                      style={{width: hp(25), height: hp(25)}}
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
