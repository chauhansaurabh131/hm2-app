import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import LinearGradient from 'react-native-linear-gradient';
import {style} from './style';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAllRequestedDating,
  getAllAcceptedDating,
} from '../../actions/homeActions';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import {useNavigation} from '@react-navigation/native';

const imageData = [
  {id: '1', source: images.meet_new_friends_img, title: 'Meet New Friends'},
  {id: '2', source: images.looking_love_img, title: 'Looking for Love'},
  {id: '3', source: images.movie_date_img, title: 'Movie Date'},
  {id: '4', source: images.foodies_img, title: 'Foodies'},
  {id: '5', source: images.travel_Buddies_img, title: 'Travel Buddies'},
  {id: '6', source: images.game_lover_img, title: 'Game Lover'},
  {id: '7', source: images.chit_chat_img, title: 'Chit-Chat'},
  {id: '8', source: images.adventurous_img, title: 'Adventurous'},
];

const imageDatas = [
  {
    id: '1',
    source: images.meet_new_friends_img,
    title: 'Rishikesh Shah',
    labelOnline: 'online',
    occupation: 'Software Designer',
  },
  {
    id: '2',
    source: images.looking_love_img,
    title: 'Ronit Kumar',
    occupation: 'Software Designer',
  },
  {
    id: '3',
    source: images.movie_date_img,
    title: 'Priyal Mehta',
    labelOnline: 'online',
    occupation: 'Software Designer',
  },
  {
    id: '4',
    source: images.foodies_img,
    title: 'Ritik Gajjar',
    occupation: 'Software Designer',
  },
  {
    id: '5',
    source: images.travel_Buddies_img,
    title: 'Meet Patel',
    occupation: 'Software Designer',
  },
  {
    id: '6',
    source: images.game_lover_img,
    title: 'Niketan Sharma',
    occupation: 'Software Designer',
  },
  {
    id: '7',
    source: images.chit_chat_img,
    title: 'Chit-Chat',
    occupation: 'Software Designer',
  },
  {
    id: '8',
    source: images.adventurous_img,
    title: 'Rahul Mistry',
    occupation: 'Software Designer',
  },
];

const DatingExploreScreen = () => {
  const [selectedText, setSelectedText] = useState('Category');
  const bottomSheetRef = useRef(null); // Create a ref for the bottom sheet
  const [selectedUser, setSelectedUser] = useState(null); //
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRequestedDating());
    dispatch(getAllAcceptedDating());
  }, [dispatch]);

  const {user} = useSelector(state => state.auth);
  const {getAllRequest, getAllAccepted} = useSelector(state => state.home);
  const users = getAllRequest?.data?.results || [];
  const userImage = user?.user?.profilePic;
  const acceptedUsers = getAllAccepted?.data?.results || [];

  const topModalBottomSheetRef = useRef(null);
  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  useEffect(() => {
    // Filter the `acceptedUsers` list based on `searchText`
    if (searchText.trim() === '') {
      setFilteredUsers(getAllAccepted?.data?.results); // Show all users if search text is empty
    } else {
      const filtered = acceptedUsers.filter(item => {
        const user = item.friendList || item.userList; // Assuming `friendList` or `userList` contains the name
        return user?.name?.toLowerCase().includes(searchText.toLowerCase());
      });
      setFilteredUsers(filtered);
    }
  }, [searchText, acceptedUsers]);

  const handleImagePress = title => {
    console.log('Image clicked:', title);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => handleImagePress(item.title)}>
      <View style={style.imageContainer}>
        <Image source={item.source} style={style.image} />
        <View style={style.textContainer}>
          <Text style={style.text}>{item.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAcceptedItem = ({item}) => {
    // console.log(' === var ===> ', item?.friendList?.datingData[0]?.Occupation);
    const user = item.friendList || [];
    const profilePic = user?.profilePic;
    const name = user?.name || 'No Name';
    const Occupation = item?.friendList?.datingData[0]?.Occupation;

    return (
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#F9FBFF"
        onPress={() => {
          // console.log(' === item ===> ', user);
          navigation.navigate('DatingUserDetailsScreen', {userData: user});
        }}>
        <View
          style={{
            flexDirection: 'row', // Display items in a row
            alignItems: 'center', // Align image and text vertically
            paddingVertical: hp(10),
            position: 'relative',
          }}>
          <Image
            source={profilePic ? {uri: profilePic} : images.empty_male_Image}
            style={{
              width: wp(47), // Adjust the size as needed
              height: hp(47),
              borderRadius: 50,
              marginRight: wp(10),
              resizeMode: 'cover',
            }}
          />
          {/*source={profilePic ? {uri: profilePic} : images.empty_male_Image}*/}
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: fontSize(14),
                  color: colors.black,
                  fontFamily: fontFamily.poppins600,
                  lineHeight: hp(21),
                }}>
                {name}
              </Text>
              {item.labelOnline && (
                <View
                  style={{
                    width: hp(35),
                    height: hp(12),
                    borderRadius: 25,
                    backgroundColor: '#24FF00A8',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: wp(6),
                    top: 3,
                  }}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: fontSize(9),
                      lineHeight: hp(12),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    {item.labelOnline}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                fontSize: fontSize(10),
                lineHeight: hp(14),
                fontFamily: fontFamily.poppins400,
                color: colors.black,
              }}>
              {Occupation}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              width: 30,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setSelectedUser(item.title); // Set the selected user's name
              bottomSheetRef.current.open(); // Open the bottom sheet
            }}>
            <Image
              source={icons.three_dots_icon}
              style={{width: 20, height: 20, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      </TouchableHighlight>
    );
  };

  const timeAgo = timestamp => {
    const now = new Date();
    const createdDate = new Date(timestamp);
    const difference = now - createdDate;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return 'just now';
    }
    if (minutes < 60) {
      return `${minutes} min ago`;
    }
    if (hours < 24) {
      return `${hours}h${hours > 1 ? '' : ''} ago`;
    }
    return `${days}d${days > 1 ? '' : ''} ago`;
  };

  const requestRenderItem = ({item}) => {
    const user = item.user; // Assuming `user` contains name, profilePic, and datingData
    const occupation = user?.datingData?.[0]?.Occupation;
    const relativeTime = timeAgo(item?.createdAt);
    const profilePic = user?.profilePic;

    // console.log(' === var ===> ', user?.profilePic);

    return (
      <View style={style.requestRenderContainer}>
        <Image
          source={profilePic ? {uri: profilePic} : images.empty_male_Image}
          style={style.renderUserProfileImage}
        />
        <View style={style.requestRenderBodyContainer}>
          <View style={style.requestRenderNameContainer}>
            <Text style={style.requestRenderName}>
              {user?.name || 'No Name'}
            </Text>

            <Text style={style.requestRenderRelative}>{relativeTime}</Text>
          </View>

          <Text style={style.requestRenderOccupation}>
            {occupation || 'No Occupation'}
          </Text>

          <View style={style.requestRenderButtonContainer}>
            <TouchableOpacity>
              <Image
                source={icons.dating_cancel_icon}
                style={[style.requestRenderButton, {marginRight: hp(12)}]}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image
                source={icons.dating_check_icon}
                style={style.requestRenderButton}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        {/* Header */}
        <View style={style.headersContainer}>
          <Image source={images.happyMilanColorLogo} style={style.logo} />
          <TouchableOpacity
            activeOpacity={0.7}
            style={{alignSelf: 'center'}}
            onPress={openBottomSheet}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

      {/* Category / Paired Buttons */}
      <View style={style.bodyContainer}>
        <View style={style.buttonGroup}>
          {/* Category Button */}
          <TouchableOpacity onPress={() => setSelectedText('Category')}>
            {selectedText === 'Category' ? (
              <LinearGradient
                colors={['#8225AF', '#0F52BA']}
                start={{x: 1.0, y: 0.5}}
                end={{x: 0.0, y: 0.5}}
                style={style.activeButton}>
                <Text style={style.activeButtonText}>Category</Text>
              </LinearGradient>
            ) : (
              <View style={style.inactiveButton}>
                <Text style={style.inactiveButtonText}>Category</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Paired Button */}
          <TouchableOpacity onPress={() => setSelectedText('Accepted')}>
            {selectedText === 'Accepted' ? (
              <LinearGradient
                colors={['#8225AF', '#0F52BA']}
                start={{x: 1.0, y: 0.5}}
                end={{x: 0.0, y: 0.5}}
                style={style.activeButton}>
                <Text style={style.activeButtonText}>Accepted</Text>
              </LinearGradient>
            ) : (
              <View style={style.inactiveButton}>
                <Text style={style.inactiveButtonText}>Accepted</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelectedText('Requests')}>
            {selectedText === 'Requests' ? (
              <LinearGradient
                colors={['#8225AF', '#0F52BA']}
                start={{x: 1.0, y: 0.5}}
                end={{x: 0.0, y: 0.5}}
                style={style.activeButton}>
                <Text style={style.activeButtonText}>Requests</Text>
              </LinearGradient>
            ) : (
              <View style={style.inactiveButton}>
                <Text style={style.inactiveButtonText}>Requests</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Conditionally render based on selected button */}
        <View style={style.categoryBodyContainer}>
          {selectedText === 'Category' && (
            <FlatList
              data={imageData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              numColumns={2} // Grid layout with 2 columns
              columnWrapperStyle={style.row} // Space between columns
              contentContainerStyle={style.flatListContentContainer}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{height: 70}} />} // Spacer at the bottom
              key={`category-${selectedText}`}
            />
          )}
          {selectedText === 'Accepted' && (
            <>
              <View
                style={{
                  marginBottom: hp(10),
                  flexDirection: 'row',
                  alignItems: 'center',
                  // backgroundColor: '#f4f4f4',
                  borderRadius: 50,
                  paddingHorizontal: 17,
                  width: '100%',
                  height: hp(50),
                  borderWidth: 1,
                  borderColor: '#F0F0F0',
                  marginTop: hp(10),
                }}>
                <TextInput
                  style={{flex: 1, height: 40, fontSize: 16}}
                  placeholder="Search by name"
                  placeholderTextColor={'black'}
                  value={searchText}
                  onChangeText={setSearchText}
                />

                <Image
                  source={icons.search_icon}
                  style={{
                    width: hp(16),
                    height: hp(16),
                    tintColor: colors.black,
                  }}
                />
              </View>

              {filteredUsers?.length === 0 ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: hp(10),
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#999',
                      fontFamily: fontFamily.poppins400,
                    }}>
                    No Data Found
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredUsers}
                  renderItem={renderAcceptedItem}
                  keyExtractor={item => item._id}
                  contentContainerStyle={{paddingBottom: hp(20)}}
                />
              )}
              <RBSheet
                ref={bottomSheetRef}
                height={270} // Adjust height as needed
                openDuration={250}
                customStyles={{
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: wp(20),
                    marginTop: hp(29),
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      bottomSheetRef.current.close(); // Use close() instead of Close()
                    }}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={icons.share_icon}
                      style={{
                        width: hp(13),
                        height: hp(14),
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={{
                        color: colors.black,
                        marginLeft: wp(20),
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Share Profile
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      bottomSheetRef.current.close(); // Use close() instead of Close()
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: hp(21),
                    }}>
                    <Image
                      source={icons.block_icon}
                      style={{
                        width: hp(13),
                        height: hp(14),
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={{
                        color: colors.black,
                        marginLeft: wp(20),
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Block {selectedUser}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      bottomSheetRef.current.close(); // Use close() instead of Close()
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: hp(21),
                    }}>
                    <Image
                      source={icons.report_icon}
                      style={{
                        width: hp(13),
                        height: hp(14),
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={{
                        color: colors.black,
                        marginLeft: wp(20),
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Report Profile
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      bottomSheetRef.current.close(); // Use close() instead of Close()
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: hp(21),
                    }}>
                    <Image
                      source={icons.copy_icon}
                      style={{
                        width: hp(13),
                        height: hp(14),
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={{
                        color: colors.black,
                        marginLeft: wp(20),
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Copy URL
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      bottomSheetRef.current.close(); // Use close() instead of Close()
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: hp(21),
                    }}>
                    <Image
                      source={icons.copy_icon}
                      style={{
                        width: hp(13),
                        height: hp(14),
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={{
                        color: colors.black,
                        marginLeft: wp(20),
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Unfriend
                    </Text>
                  </TouchableOpacity>
                </View>
              </RBSheet>
            </>
          )}
          {selectedText === 'Requests' && (
            // <View style={{marginTop: hp(34)}}>
            <View>
              <FlatList
                data={users}
                keyExtractor={item => item._id}
                renderItem={requestRenderItem}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DatingExploreScreen;
