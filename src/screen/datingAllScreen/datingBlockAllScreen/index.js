import React, {useRef} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {style} from './style';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {icons, images} from '../../../assets';
import ProfileAvatar from '../../../components/letterProfileComponent';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
import NewProfileBottomSheet from '../../../components/newProfileBottomSheet';
import {useEffect, useState} from 'react';
import {colors} from '../../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import CommonGradientButton from '../../../components/commonGradientButton';

const DatingBlockAllScreen = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  // console.log(' === var ===> ', user?.user);

  const [blockedProfiles, setBlockedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  useEffect(() => {
    const fetchBlockedProfiles = async () => {
      setLoading(true); // Show loader
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/friend/get-block-listv2?appUsesType=dating',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          setBlockedProfiles(data?.data?.results || []);
        } else {
          console.error('Failed to fetch blocked profiles:', data);
        }
      } catch (error) {
        console.error('API error:', error);
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchBlockedProfiles();
  }, []);

  const onUnblockedPress = async item => {
    console.log(' === var ===> ', item);

    try {
      const payload = {
        user: item?.friend?._id, // logged-in user's ID
        request: item?._id, // the request ID or blocked item ID
        status: 'removed', // based on the API
      };

      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/respond-friend-req',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Unblocked successfully:', data);
        // Refresh the list or remove the unblocked profile
        setBlockedProfiles(prev => prev.filter(p => p._id !== item._id));
        setModalVisible(false);
      } else {
        console.error('❌ Unblock failed:', data);
      }
    } catch (error) {
      console.error('🚨 API error:', error);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={style.renderContainer}>
        <View style={style.renderBody}>
          {item?.friend?.profilePic ? (
            <Image
              source={{uri: item?.friend.profilePic}}
              style={style.renderUserProfile}
            />
          ) : (
            <ProfileAvatar
              firstName={item?.friend?.firstName || item?.friend?.name}
              lastName={item?.friend?.lastName}
              textStyle={style.renderUserProfile}
              profileTexts={{fontSize: fontSize(10)}}
            />
          )}

          <View>
            <Text style={style.renderNoProfileText}>
              {item?.friend?.firstName || item?.friend?.name}{' '}
              {item?.friend?.lastName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          // onPress={() => onUnblockedPress(item)}
          onPress={() => {
            setSelectedItem(item);
            setModalVisible(true);
          }}
          style={style.unblockButton}>
          <Text style={style.unblockText}>Unblock</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />
          <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
            {userImage ? (
              <Image
                source={{uri: userImage}}
                style={style.profileImageStyle}
              />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName}
                lastName={user?.user?.lastName}
                textStyle={style.profileImageStyle}
                profileTexts={{fontSize: fontSize(10)}}
              />
            )}
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View style={style.headingTittleContainer}>
          <Text style={style.headingCredentialsText}>Blocked Profiles</Text>
          <TouchableOpacity
            style={style.backButtonContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back_arrow_icon}
              style={style.backButtonIconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={style.underLineHeaderStyle} />

      {loading ? (
        <View style={style.loaderContainer}>
          <ActivityIndicator size="large" color={colors.black || '#000'} />
        </View>
      ) : (
        <FlatList
          data={blockedProfiles}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: hp(250),
              }}>
              <Image
                source={icons.smile_emoji_icon}
                style={{width: hp(50), height: hp(50)}}
              />
              <Text
                style={{
                  color: colors.black,
                  marginTop: hp(10),
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins500,
                }}>
                No One Friend Block
              </Text>
            </View>
          }
        />
      )}

      {/*<Modal*/}
      {/*  transparent={true}*/}
      {/*  animationType="none"*/}
      {/*  visible={modalVisible}*/}
      {/*  onRequestClose={() => setModalVisible(false)}>*/}
      {/*  <View*/}
      {/*    style={{*/}
      {/*      flex: 1,*/}
      {/*      justifyContent: 'center',*/}
      {/*      backgroundColor: 'rgba(0,0,0,0.5)',*/}
      {/*      alignItems: 'center',*/}
      {/*    }}>*/}
      {/*    <View*/}
      {/*      style={{*/}
      {/*        backgroundColor: 'white',*/}
      {/*        borderRadius: 15,*/}
      {/*        alignItems: 'center',*/}
      {/*        width: '95%',*/}
      {/*      }}>*/}
      {/*      <Text*/}
      {/*        style={{*/}
      {/*          fontSize: fontSize(18),*/}
      {/*          lineHeight: hp(24),*/}
      {/*          fontFamily: fontFamily.poppins400,*/}
      {/*          color: colors.black,*/}
      {/*          marginTop: hp(51),*/}
      {/*        }}>*/}
      {/*        Confirm unblocking{' '}*/}
      {/*        {selectedItem?.friend?.firstName || selectedItem?.friend?.name}?*/}
      {/*      </Text>*/}

      {/*      <View*/}
      {/*        style={{*/}
      {/*          flexDirection: 'row',*/}
      {/*          marginTop: hp(38),*/}
      {/*          justifyContent: 'space-evenly',*/}
      {/*          marginBottom: hp(39),*/}
      {/*          // backgroundColor: 'grey',*/}
      {/*          // marginHorizontal: 34,*/}
      {/*        }}>*/}
      {/*        <TouchableOpacity*/}
      {/*          activeOpacity={0.7}*/}
      {/*          onPress={() => {*/}
      {/*            setModalVisible(false);*/}
      {/*          }}>*/}
      {/*          <LinearGradient*/}
      {/*            colors={['#0D4EB3', '#9413D0']}*/}
      {/*            style={{*/}
      {/*              width: wp(126),*/}
      {/*              height: hp(50),*/}
      {/*              borderRadius: 50,*/}
      {/*              borderWidth: 1,*/}
      {/*              justifyContent: 'center',*/}
      {/*              borderColor: 'transparent', // Set border color to transparent*/}
      {/*            }}>*/}
      {/*            <View*/}
      {/*              style={{*/}
      {/*                borderRadius: 50, // <-- Inner Border Radius*/}
      {/*                flex: 1,*/}
      {/*                backgroundColor: colors.white,*/}
      {/*                justifyContent: 'center',*/}
      {/*                margin: isIOS ? 0 : 1,*/}
      {/*              }}>*/}
      {/*              <Text*/}
      {/*                style={{*/}
      {/*                  textAlign: 'center',*/}
      {/*                  backgroundColor: 'transparent',*/}
      {/*                  color: colors.black,*/}
      {/*                  margin: 10,*/}
      {/*                  fontSize: fontSize(14),*/}
      {/*                  lineHeight: hp(21),*/}
      {/*                  fontFamily: fontFamily.poppins600,*/}
      {/*                }}>*/}
      {/*                Cancel*/}
      {/*              </Text>*/}
      {/*            </View>*/}
      {/*          </LinearGradient>*/}
      {/*        </TouchableOpacity>*/}

      {/*        <CommonGradientButton*/}
      {/*          // onPress={onHideProfilePress}*/}
      {/*          buttonName={'Yes, Hide'}*/}
      {/*          containerStyle={{*/}
      {/*            width: hp(126),*/}
      {/*            height: hp(50),*/}
      {/*            borderRadius: 50,*/}
      {/*          }}*/}
      {/*        />*/}
      {/*      </View>*/}
      {/*    </View>*/}
      {/*  </View>*/}
      {/*</Modal>*/}

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: '90%',
              // height: hp(264),
              backgroundColor: 'white',
              // padding: 20,
              borderRadius: 20,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: fontSize(18),
                lineHeight: hp(30),
                color: colors.black,
                marginTop: hp(51),
                fontFamily: fontFamily.poppins400,
              }}>
              Confirm unblocking{' '}
              {selectedItem?.friend?.firstName || selectedItem?.friend?.name}?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(38),
                justifyContent: 'space-evenly',
                marginBottom: hp(39),
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  style={{
                    width: wp(126),
                    height: hp(50),
                    borderRadius: 50,
                    borderWidth: 1,
                    justifyContent: 'center',
                    borderColor: 'transparent', // Set border color to transparent
                  }}>
                  <View
                    style={{
                      borderRadius: 50, // <-- Inner Border Radius
                      flex: 1,
                      backgroundColor: colors.white,
                      justifyContent: 'center',
                      margin: isIOS ? 0 : 1,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        backgroundColor: 'transparent',
                        color: colors.black,
                        margin: 10,
                        fontSize: fontSize(14),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins600,
                      }}>
                      Cancel
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <CommonGradientButton
                onPress={() => {
                  onUnblockedPress(selectedItem);
                }}
                buttonName={'Yes'}
                containerStyle={{
                  width: hp(126),
                  height: hp(50),
                  borderRadius: 50,
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DatingBlockAllScreen;
