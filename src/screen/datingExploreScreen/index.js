import React, {useRef, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import LinearGradient from 'react-native-linear-gradient';
import {style} from './style';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import RBSheet from 'react-native-raw-bottom-sheet';

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
  {id: '1', source: images.meet_new_friends_img, title: 'Meet New Friends'},
  {id: '2', source: images.looking_love_img, title: 'Looking for Love'},
  {id: '3', source: images.movie_date_img, title: 'Movie Date'},
  {id: '4', source: images.foodies_img, title: 'Foodies'},
  {id: '5', source: images.travel_Buddies_img, title: 'Travel Buddies'},
  {id: '6', source: images.game_lover_img, title: 'Game Lover'},
  {id: '7', source: images.chit_chat_img, title: 'Chit-Chat'},
  {id: '8', source: images.adventurous_img, title: 'Adventurous'},
];

const DatingExploreScreen = () => {
  const [selectedText, setSelectedText] = useState('Category');
  const bottomSheetRef = useRef(null); // Create a ref for the bottom sheet
  const [selectedUser, setSelectedUser] = useState(null); //

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

  const pairedRenderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row', // Display items in a row
        alignItems: 'center', // Align image and text vertically
        paddingVertical: hp(10),
        position: 'relative',
      }}>
      <Image
        source={item.source}
        style={{
          width: wp(47), // Adjust the size as needed
          height: hp(47),
          borderRadius: 50,
          marginRight: wp(10),
          resizeMode: 'cover',
        }}
      />
      <Text
        style={{
          fontSize: fontSize(16),
          color: 'black',
          fontFamily: fontFamily.poppins500,
        }}>
        {item.title}
      </Text>
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
  );

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        {/* Header */}
        <View style={style.headersContainer}>
          <Image source={images.happyMilanColorLogo} style={style.logo} />
          <TouchableOpacity activeOpacity={0.7} style={{alignSelf: 'center'}}>
            <Image
              source={images.profileDisplayImage}
              style={style.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

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
          <TouchableOpacity onPress={() => setSelectedText('Paired')}>
            {selectedText === 'Paired' ? (
              <LinearGradient
                colors={['#8225AF', '#0F52BA']}
                start={{x: 1.0, y: 0.5}}
                end={{x: 0.0, y: 0.5}}
                style={style.activeButton}>
                <Text style={style.activeButtonText}>Paired</Text>
              </LinearGradient>
            ) : (
              <View style={style.inactiveButton}>
                <Text style={style.inactiveButtonText}>Paired</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Conditionally render based on selected button */}
        <View style={style.categoryBodyContainer}>
          {selectedText === 'Category' ? (
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
          ) : (
            <>
              <FlatList
                data={imageDatas}
                renderItem={pairedRenderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{paddingBottom: hp(20)}}
                key={`paired-${selectedText}`}
              />
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
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DatingExploreScreen;
