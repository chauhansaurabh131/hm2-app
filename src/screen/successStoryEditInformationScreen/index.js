import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {launchImageLibrary} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import style from '../../components/GradientButton/style';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';

const SuccessStoryEditInformationScreen = ({route}) => {
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescrition] = useState('');
  const [birthday, setBirthday] = useState('');
  const [selectedImages, setSelectedImages] = useState([null, null, null]);
  const navigation = useNavigation();

  const handlePublish = () => {
    // Navigate to SuccessStoryPageScreen and pass the name as a parameter
    console.log(' ===  name  var Image===> ', {
      name: name,
      selectedImages: selectedImages,
    });
    // navigation.navigate('SuccessStoryPageScreen', {name: name});
    navigation.navigate('SuccessStoryPageScreen', {
      name: name,
      selectedImages: selectedImages,
      description: description,
    });
  };
  const ImagePicker = index => {
    let options = {
      StorageOptions: {
        path: 'image',
      },
    };

    launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        const updatedSelectedImages = [...selectedImages];
        updatedSelectedImages[index] = response.assets[0].uri;
        setSelectedImages(updatedSelectedImages);
      }
    });
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  const handleBirthdayChange = text => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/\D/g, '');

    // Format the date with slashes
    let formattedBirthday = '';
    if (numericValue.length <= 2) {
      formattedBirthday = numericValue;
    } else if (numericValue.length <= 4) {
      formattedBirthday =
        numericValue.substring(0, 2) + '/' + numericValue.substring(2);
    } else if (numericValue.length <= 6) {
      formattedBirthday =
        numericValue.substring(0, 2) +
        '/' +
        numericValue.substring(2, 4) +
        '/' +
        numericValue.substring(4);
    } else {
      // If more than 8 characters are entered, trim the input to 8 characters
      formattedBirthday =
        numericValue.substring(0, 2) +
        '/' +
        numericValue.substring(2, 4) +
        '/' +
        numericValue.substring(4, 8);
    }

    setBirthday(formattedBirthday);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: 17}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: hp(12),
          }}>
          <Image
            source={images.happyMilanColorLogo}
            style={{
              width: wp(96),
              height: hp(24),
              resizeMode: 'contain',
              marginTop: hp(2),
            }}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>
            <Image
              source={images.profileDisplayImage}
              style={{
                width: hp(24),
                height: hp(24),
                borderRadius: 50,
                marginRight: hp(10.5),
                resizeMode: 'stretch',
                right: -7,
                marginTop: hp(2),
              }}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(16),
            lineHeight: hp(24),
            fontFamily: fontFamily.poppins400,
            marginTop: hp(35),
            marginBottom: hp(20),
          }}>
          Let's spread your love story to the world.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginHorizontal: 17,
            marginTop: 10,
          }}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins400,
            }}>
            Me & His Name
          </Text>

          <TextInput
            placeholder={'Name'}
            placeholderTextColor={'grey'}
            // value={name}
            value={name.toString()}
            onChangeText={setName}
            style={{
              width: '100%',
              height: hp(50),
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.black,
              marginTop: hp(10),
              padding: 10,
              color: colors.black,
            }}
          />

          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins400,
              marginTop: hp(25),
            }}>
            When did you get married?
          </Text>

          <TextInput
            placeholder={'DD/MM/YYYY'}
            placeholderTextColor={'grey'}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: 'black',
              marginTop: 10,
              padding: 10,
              color: colors.black,
            }}
            onChangeText={handleBirthdayChange}
            value={birthday}
            keyboardType="numeric"
          />

          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins400,
              marginTop: hp(25),
            }}>
            Type or Paste Your Story
          </Text>

          <TextInput
            numberOfLines={20}
            multiline={true}
            placeholderTextColor={colors.black}
            value={description.toString()}
            onChangeText={setDescrition}
            style={{
              height: hp(150),
              borderWidth: 1,
              borderColor: colors.black,
              borderRadius: 10,
              justifyContent: 'flex-start',
              marginTop: hp(12),
              padding: 10,
              textAlignVertical: 'top',
              color: colors.black,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 14,
            }}>
            <TouchableOpacity
              onPress={() => ImagePicker(0)}
              style={{
                width: wp(165),
                height: hp(245),
                backgroundColor: '#F8F8F8',
                borderRadius: 10,
                justifyContent: 'center', // Center content vertically
                alignItems: 'center', // Center content horizontally
              }}>
              {selectedImages[0] ? (
                <Image
                  source={{uri: selectedImages[0]}}
                  style={{width: wp(165), height: hp(245), borderRadius: 10}}
                />
              ) : (
                <>
                  <Image
                    source={icons.add_image_icon}
                    style={{width: 50, height: 50}}
                  />
                  <Text style={{color: colors.black, marginTop: 5}}>
                    Add Photo
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => ImagePicker(1)}
              style={{
                width: wp(165),
                height: hp(245),
                backgroundColor: '#F8F8F8',
                borderRadius: 10,
                justifyContent: 'center', // Center content vertically
                alignItems: 'center', // Center content horizontally
              }}>
              {selectedImages[1] ? (
                <Image
                  source={{uri: selectedImages[1]}}
                  style={{width: wp(165), height: hp(245), borderRadius: 10}}
                />
              ) : (
                <>
                  <Image
                    source={icons.add_image_icon}
                    style={{width: 50, height: 50}}
                  />
                  <Text style={{color: colors.black, marginTop: 5}}>
                    Add Photo
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => ImagePicker(2)}
            style={{
              width: '100%',
              height: hp(245),
              backgroundColor: '#F8F8F8',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: 14,
            }}>
            {selectedImages[2] ? (
              <Image
                source={{uri: selectedImages[2]}}
                style={{width: '100%', height: hp(245), borderRadius: 10}}
              />
            ) : (
              <>
                <Image
                  source={icons.add_image_icon}
                  style={{width: 50, height: 50}}
                />
                <Text style={{color: colors.black, marginTop: 5}}>
                  Add Photo
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 54,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                width: 100,
                height: 50,
                backgroundColor: '#F8F8F8',
                justifyContent: 'center', // Center content vertically
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Not now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={handlePublish}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  width: 100,
                  height: 50,
                  borderRadius: 10,
                  justifyContent: 'center',
                }}>
                <Text style={{textAlign: 'center', color: colors.white}}>
                  Publish
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{height: 30}} />
        </View>

        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SuccessStoryEditInformationScreen;
