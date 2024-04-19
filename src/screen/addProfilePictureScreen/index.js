import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import CommonGradientButton from '../../components/commonGradientButton';

const AddProfilePictureScreen = ({route}) => {
  const navigation = useNavigation();
  const {selectedItems: initialSelectedItems} = route.params;
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1); // Initialize with -1, meaning no image is selected initially
  const [isImageSelected, setIsImageSelected] = useState(false); // State to track if any image is selected

  const {selectedBox} = route.params ?? {};

  console.log(' === selectedBox_AddProfilePictureScreen ===> ', selectedBox);

  const handleAddImage = () => {
    console.log('Add more images');
    navigation.goBack();
  };

  const handleImageClick = index => {
    setSelectedImageIndex(index);
    setIsImageSelected(true); // Set isImageSelected to true when an image is selected
  };

  // Add TouchableOpacity to the selected items list
  const dataWithAddButton = [...selectedItems, {type: 'addButton'}];

  const handleDeleteImage = index => {
    const updatedSelectedItems = [...selectedItems];
    updatedSelectedItems.splice(index, 1); // Remove the item at the specified index
    setSelectedItems(updatedSelectedItems);
    setIsImageSelected(false); // Reset isImageSelected if no images are selected
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{marginHorizontal: wp(18), flex: 1}}>
        <Image
          source={images.happyMilanColorLogo}
          style={{
            width: wp(96),
            height: hp(24),
            marginTop: hp(15),
            resizeMode: 'stretch',
            marginBottom: hp(15),
          }}
        />

        <View style={{marginTop: hp(30), marginBottom: hp(39)}}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins400,
            }}>
            Select Photo to{' '}
            <Text style={{color: colors.blue}}>Set as profile picture</Text>
          </Text>
        </View>
        <FlatList
          data={dataWithAddButton}
          numColumns={3}
          renderItem={({item, index}) => (
            <View
              style={{
                width: '33%',
                height: 106,
                position: 'relative',
                marginBottom: 10,
              }}>
              {item.type === 'addButton' ? (
                <TouchableOpacity
                  style={{
                    width: hp(106),
                    height: hp(106),
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F1F1F1',
                  }}
                  onPress={handleAddImage}>
                  <Text style={{color: colors.blue, fontSize: 30}}>+</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => handleImageClick(index)}
                    style={{
                      width: hp(106),
                      height: hp(106),
                      borderRadius: 10,
                      resizeMode: 'stretch',
                      backgroundColor: 'transparent',
                      overflow: 'hidden',
                    }}>
                    <Image
                      source={{uri: item.node.image.uri}}
                      style={{
                        width: hp(106),
                        height: hp(106),
                        borderRadius: 10,
                        resizeMode: 'stretch',
                      }}
                    />
                    {selectedImageIndex === index && (
                      <View
                        style={{
                          ...StyleSheet.absoluteFillObject,
                          backgroundColor: 'rgba(15, 82, 186, 0.7)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={icons.select_borderWhite_icon}
                          style={{width: 20, height: 20}}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  {item.node.type === 'video/mp4' && (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 40,
                        left: 0,
                        right: 0,
                        padding: 5,
                        alignItems: 'center',
                      }}>
                      <Image
                        source={icons.video_play_icon}
                        style={{width: 25, height: 25}}
                      />
                    </View>
                  )}

                  <TouchableOpacity
                    // onPress={() => {
                    //   console.log(' === press ===> ', 'press');
                    // }}
                    onPress={() => handleDeleteImage(index)}
                    style={{position: 'absolute', right: 17, top: 5}}>
                    <View
                      style={{
                        width: 13,
                        height: 13,
                        borderRadius: 6.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0,0, 0.5)',
                      }}>
                      <Image
                        source={icons.delete_icon}
                        style={{
                          width: 6,
                          height: 7,
                          resizeMode: 'contain',
                          right: 1,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: wp(18),
          paddingBottom: hp(20),
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={0.7}
          style={{
            width: wp(162),
            height: hp(50),
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.blue,
            justifyContent: 'center',
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: colors.black,
              textAlign: 'center',
              fontSize: hp(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins400,
            }}>
            Back
          </Text>
        </TouchableOpacity>

        <CommonGradientButton
          onPress={() => {
            if (isImageSelected) {
              navigation.navigate('PartnerPreferencesScreen', {selectedBox});
            }
          }}
          buttonName={'Continue'}
          containerStyle={{
            width: wp(162),
            height: hp(50),
            marginBottom: 10,
          }}
          buttonTextStyle={{
            fontSize: hp(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins400,
          }}
          disabled={!isImageSelected} // Disable the button when no image is selected
        />
      </View>
    </SafeAreaView>
  );
};

export default AddProfilePictureScreen;
