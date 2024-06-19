import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {images} from '../../assets';
import CommonGradientButton from '../../components/commonGradientButton';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useNavigation, useRoute} from '@react-navigation/native';

const SetProfilePictureScreen = () => {
  const [photo, setPhoto] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  const {selectedBox} = route.params ?? {};

  // const getAllPhotos = () => {
  //   CameraRoll.getPhotos({
  //     first: 20,
  //     assetType: 'All',
  //   })
  //     .then(r => {
  //       setPhoto(r.edges);
  //       navigation.navigate('SelectImageScreen', {
  //         photos: r.edges,
  //         selectedBox: selectedBox,
  //       });
  //     })
  //     .catch(err => {
  //       console.error('Error fetching photos:', err);
  //     });
  // };

  const getAllPhotos = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'All',
    })
      .then(r => {
        setPhoto(r.edges);

        // Check if photos are retrieved and log the first image details
        if (r.edges.length > 0) {
          console.log('First photo:', r.edges[0].node.image);
        } else {
          console.log('No photos found');
        }

        console.log(' === r.edges ===> ', r.edges[0].node.image);

        navigation.navigate('SelectImageScreen', {
          photos: r.edges,
          selectedBox: selectedBox,
        });
      })
      .catch(err => {
        console.error('Error fetching photos:', err);
      });
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.bodyContainer}>
        <Image source={images.happyMilanColorLogo} style={style.appLogoStyle} />

        <View style={style.tittleTextContainer}>
          <Text style={style.headingTextStyle}>
            Upload Photos
            <Text style={style.subHeadingTextStyle}> (Min. 6 Photos)</Text>
          </Text>
        </View>

        {/*ADD PHOTO BUTTON*/}
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            getAllPhotos();
          }}
          style={style.addPhotoButtonStyle}>
          <Text style={style.addPhotoButtonTextStyle}>Add Photos</Text>
        </TouchableOpacity>

        {/*BACK & DO IT LATER BUTTON*/}
        <View style={style.bottomButtonContainer}>
          <View style={style.bottomButtonBodyContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={style.backButtonStyle}
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={style.backButtonTextStyle}>Back</Text>
            </TouchableOpacity>

            <CommonGradientButton
              onPress={() => {
                navigation.navigate('PartnerPreferencesScreen');
              }}
              buttonName={'I’ll Do Later'}
              containerStyle={style.laterButtonStyle}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SetProfilePictureScreen;
