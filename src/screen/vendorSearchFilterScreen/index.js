import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import CheckBox from 'react-native-check-box';
import {BASE_URL} from '../../utils/constants';

const renderShimmer = () => {
  return (
    <View>
      {[1, 2, 3].map(item => (
        <View
          key={item}
          style={{
            marginTop: hp(10),
            marginHorizontal: 17,
            borderWidth: 1,
            borderColor: '#EFEFEF',
            borderRadius: 15,
            paddingBottom: hp(16),
          }}>
          {/* BANNER IMAGE */}
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={{
              width: '100%',
              height: hp(167),
              borderRadius: 15,
            }}
          />

          {/* PROFILE IMAGE */}
          <View
            style={{
              marginLeft: wp(17),
              marginTop: -25,
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{
                width: hp(50),
                height: hp(50),
                borderRadius: hp(50),
              }}
            />
          </View>

          {/* NAME */}
          <View
            style={{
              marginHorizontal: wp(17),
              marginTop: hp(10),
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{
                width: '60%',
                height: hp(18),
                borderRadius: 6,
              }}
            />

            {/* ADDRESS */}
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{
                width: '90%',
                height: hp(14),
                borderRadius: 6,
                marginTop: hp(10),
              }}
            />

            {/* TAGS */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(18),
              }}>
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={{
                  width: hp(120),
                  height: hp(33),
                  borderRadius: 50,
                  marginRight: wp(10),
                }}
              />

              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={{
                  width: hp(90),
                  height: hp(33),
                  borderRadius: 50,
                  marginRight: wp(10),
                }}
              />

              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={{
                  width: hp(50),
                  height: hp(33),
                  borderRadius: 50,
                }}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const VendorSearchFilterScreen = ({route}) => {
  const {category, location} = route.params;

  // console.log(' === category ===> ', category);

  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);

  // console.log(' === var ===> ', user?.tokens?.access?.token);

  const accessToken = user?.tokens?.access?.token;

  const formattedCategory = category
    ?.replace(/-/g, ' ')
    ?.replace(/\b\w/g, l => l.toUpperCase());

  const [vendors, setVendors] = useState([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [paginationLoading, setPaginationLoading] = useState(false);

  const [hasMoreData, setHasMoreData] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [filteredData, setFilteredData] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  const filterSheetRef = useRef();

  // =========================================
  // FIRST API CALL
  // =========================================

  useFocusEffect(
    useCallback(() => {
      // RESET FILTER
      setFilteredData(false);

      // RESET PAGE
      setPage(1);

      // CLEAR OLD DATA
      setVendors([]);

      // ENABLE PAGINATION
      setHasMoreData(true);

      // API CALL
      getVendors(1, true);
    }, [category]),
  );

  // =========================================
  // GET VENDORS API
  // =========================================

  const getVendors = async (currentPage = 1, isFirst = false) => {
    try {
      if (isFirst) {
        setLoading(true);
      } else {
        setPaginationLoading(true);
      }

      const response = await fetch(
        `${BASE_URL}/api/v1/user/user/vendors-search?businessType=${category}&city=${location}&page=${currentPage}&limit=10`,
      );

      const result = await response.json();

      console.log('API RESPONSE ===>', result);

      const newData = result?.data || [];

      // IF FIRST PAGE
      if (isFirst) {
        setVendors(newData);
      } else {
        setVendors(prev => [...prev, ...newData]);
      }

      // CHECK MORE DATA
      if (newData.length < 10) {
        setHasMoreData(false);
      }
    } catch (error) {
      console.log('API ERROR ===>', error);
    } finally {
      setLoading(false);

      setPaginationLoading(false);
    }
  };

  // =========================================
  // GET VENDORS AREA
  // =========================================

  const getVendorAreas = async () => {
    try {
      setFilterLoading(true);

      const city = location?.split(',')[0];

      const response = await fetch(
        `${BASE_URL}/api/v1/user/user/vendors-areas?businessType=${category}&city=${city}`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${accessToken}`,

            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.json();

      setAreas(result?.data || []);

      filterSheetRef.current.open();

      console.log('AREAS API RESPONSE ===>', result);
    } catch (error) {
      console.log('AREAS API ERROR ===>', error);
    } finally {
      setFilterLoading(false);
    }
  };

  // =========================================
  // GET VENDORS AREA CITY
  // =========================================

  const applyAreaFilter = async () => {
    try {
      setApplyLoading(true);

      const city = location?.split(',')[0];

      const selectedArea = selectedAreas[0];

      const response = await fetch(
        `${BASE_URL}/api/v1/user/user/vendors-search?businessType=${category}&city=${city}&area=${selectedArea}&page=1&limit=5`,
      );

      const result = await response.json();

      console.log('FILTER API RESPONSE ===>', result);

      setFilteredData(true);

      // UPDATE LIST
      setVendors(result?.data || []);

      // CLOSE SHEET
      filterSheetRef.current.close();
    } catch (error) {
      console.log('FILTER API ERROR ===>', error);
    } finally {
      setApplyLoading(false);
    }
  };

  // =========================================
  // LOAD MORE
  // =========================================

  const loadMoreData = () => {
    if (paginationLoading || !hasMoreData) {
      return;
    }

    // STOP OLD API
    if (filteredData) {
      return;
    }

    const nextPage = page + 1;

    setPage(nextPage);

    getVendors(nextPage);
  };

  // =========================================
  // FOOTER LOADER
  // =========================================

  const renderFooter = () => {
    if (!paginationLoading) {
      return null;
    }

    return (
      <ActivityIndicator
        size="small"
        color="#7148E4"
        style={{
          marginVertical: 20,
        }}
      />
    );
  };

  const toggleAreaSelection = area => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(prev => prev.filter(item => item !== area));
    } else {
      setSelectedAreas(prev => [...prev, area]);
    }
  };

  // =========================================
  // RENDER ITEM
  // =========================================

  const renderItem = ({item}) => {
    const services = item?.vendorData?.[0]?.servicesProvided || [];

    console.log(' === var ===> ', item?._id);

    // FORMAT TEXT
    const formattedServices = services.map(service =>
      service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    );

    // FIRST TAG
    const firstService = formattedServices[0];

    // SECOND TAG
    const secondService = formattedServices[1];

    // CHECK LENGTH
    const firstLength = firstService?.length || 0;

    const secondLength = secondService?.length || 0;

    // IF TOO LONG DON'T SHOW SECOND
    const showSecondTag = firstLength < 18 && secondLength < 18;

    // REMAINING COUNT
    const remainingCount = showSecondTag
      ? formattedServices.length - 2
      : formattedServices.length - 1;

    return (
      <TouchableOpacity
        style={{marginTop: hp(10), alignItems: 'center', marginHorizontal: 17}}
        activeOpacity={0.6}
        onPress={() => {
          navigation.navigate('ServicesProfileScreen', {
            vendorId: item?._id,
            location: location,
            category: category,
            previousScreen: 'VendorSearchFilterScreen',
          });
        }}>
        <View style={{width: '100%'}}>
          <View
            style={{
              width: '100%',
              borderWidth: 1,
              borderColor: '#EFEFEF',
              borderRadius: 15,
            }}>
            {/* Background image */}
            <Image
              source={{
                uri:
                  item?.userProfilePic?.[0]?.url ||
                  'https://via.placeholder.com/300',
              }}
              style={{
                width: '100%',
                height: hp(167),
                borderRadius: 15,
              }}
            />

            {/* Profile image */}
            <View style={{top: -25}}>
              <Image
                source={{
                  uri: item?.profilePic || 'https://via.placeholder.com/150',
                }}
                style={{
                  width: hp(50),
                  height: hp(50),
                  marginLeft: wp(17),
                  borderRadius: hp(50),
                  backgroundColor: 'white',
                }}
              />
            </View>

            {/* Studio info */}
            <View style={{marginHorizontal: wp(17)}}>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(18),
                  fontFamily: fontFamily.poppins600,
                }}>
                {item?.name}
              </Text>

              <Text
                style={{
                  color: '#6E6E6E',
                  marginTop: hp(4),
                  fontFamily: fontFamily.poppins400,
                  fontSize: fontSize(11),
                }}>
                {item?.address?.currentResidenceAddress ||
                item?.address?.area ||
                item?.address?.currentCity ||
                item?.address?.currentState
                  ? `${item?.address?.currentResidenceAddress || 'NA'}, ${
                      item?.address?.area || 'NA'
                    }, ${item?.address?.currentCity || 'NA'}, ${
                      item?.address?.currentState || 'NA'
                    }`
                  : 'NA'}
              </Text>

              {/* Tags */}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: hp(15),
                  marginBottom: hp(16),
                }}>
                {/* FIRST TAG */}
                {firstService && (
                  <View
                    style={{
                      height: hp(33),

                      backgroundColor: '#F9F6FF',

                      borderRadius: 50,

                      justifyContent: 'center',

                      alignItems: 'center',

                      flexDirection: 'row',

                      paddingHorizontal: wp(14),

                      marginRight: wp(10),
                    }}>
                    <Image
                      source={icons.wedding_Studio_icon}
                      style={{
                        width: hp(13),
                        height: hp(13),
                        resizeMode: 'contain',
                        marginRight: wp(8),
                        tintColor: '#7148E4',
                      }}
                    />

                    <Text
                      style={{
                        color: colors.pureBlack,

                        fontSize: fontSize(12),

                        fontFamily: fontFamily.poppins400,
                      }}>
                      {firstService}
                    </Text>
                  </View>
                )}

                {/* SECOND TAG */}
                {showSecondTag && secondService && (
                  <View
                    style={{
                      height: hp(33),

                      backgroundColor: '#F9F6FF',

                      borderRadius: 50,

                      justifyContent: 'center',

                      alignItems: 'center',

                      flexDirection: 'row',

                      paddingHorizontal: wp(14),

                      marginRight: wp(10),
                    }}>
                    <Image
                      source={icons.wedding_Studio_icon}
                      style={{
                        width: hp(13),
                        height: hp(13),
                        resizeMode: 'contain',
                        marginRight: wp(8),
                        tintColor: '#7148E4',
                      }}
                    />

                    <Text
                      style={{
                        color: colors.pureBlack,

                        fontSize: fontSize(12),

                        fontFamily: fontFamily.poppins400,
                      }}>
                      {secondService}
                    </Text>
                  </View>
                )}

                {/* COUNT */}
                {remainingCount > 0 && (
                  <View
                    style={{
                      width: hp(55),

                      height: hp(33),

                      backgroundColor: '#F9F6FF',

                      borderRadius: 50,

                      justifyContent: 'center',

                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: colors.pureBlack,

                        fontSize: fontSize(12),

                        fontFamily: fontFamily.poppins400,
                      }}>
                      +{remainingCount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <View
        style={{
          height: hp(50),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={0.6}
          style={{
            width: wp(50),
            justifyContent: 'center',
            alignItems: 'center',
            height: hp(50),
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{width: hp(14), height: hp(14), resizeMode: 'contain'}}
          />
        </TouchableOpacity>

        <Text
          numberOfLines={1}
          style={{
            fontSize: fontSize(14),
            textTransform: 'capitalize',
            fontFamily: fontFamily.poppins500,
            color: colors.pureBlack,
          }}>
          {`${formattedCategory} in ${location}`.length > 33
            ? `${formattedCategory} in ${location}`.substring(0, 33) + '...'
            : `${formattedCategory} in ${location}`}
        </Text>

        <TouchableOpacity
          onPress={() => {
            getVendorAreas();
          }}
          activeOpacity={0.6}
          style={{
            width: wp(60),
            height: hp(50),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: hp(28),
              height: hp(28),
              borderWidth: hp(1),
              borderColor: '#DCDCDC',
              borderRadius: hp(6),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {filterLoading ? (
              <ActivityIndicator size="small" color="#7148E4" />
            ) : (
              <Image
                source={icons.filter_icon}
                style={{
                  width: hp(22),
                  height: hp(20),
                  resizeMode: 'contain',
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* LOADER */}
      {loading ? (
        renderShimmer()
      ) : (
        <FlatList
          data={vendors}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{
            // paddingHorizontal: 16,
            paddingBottom: 30,
          }}
          showsVerticalScrollIndicator={false}
          // PAGINATION
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          // FOOTER LOADER
          ListFooterComponent={renderFooter}
          // EMPTY DATA
          ListEmptyComponent={() => (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 40,
                color: '#000',
              }}>
              No Vendors Found
            </Text>
          )}
        />
      )}

      <RBSheet
        ref={filterSheetRef}
        height={hp(450)}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          draggableIcon: {
            backgroundColor: 'white',
          },

          container: {
            borderTopLeftRadius: hp(25),
            borderTopRightRadius: hp(25),
            backgroundColor: colors.white,
          },
        }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: wp(22),
          }}>
          {/* TITLE */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(18),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(10),
              }}>
              Filter by area
            </Text>

            <TouchableOpacity
              activeOpacity={0.6}
              disabled={selectedAreas.length === 0}
              onPress={() => {
                applyAreaFilter();
              }}
              style={{
                width: wp(88),
                height: hp(36),
                backgroundColor:
                  selectedAreas.length === 0 ? '#D6C8F7' : '#7148E4',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: hp(30),
                top: 3,
                opacity: selectedAreas.length === 0 ? 0.9 : 1,
              }}>
              {applyLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text
                  style={{
                    fontSize: fontSize(16),
                    fontFamily: fontFamily.poppins400,
                    color: colors.white,
                  }}>
                  Apply
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* LINE */}
          <View
            style={{
              width: '100%',
              height: hp(1),
              backgroundColor: '#E7E7E7',
              marginTop: hp(16),
            }}
          />

          {/* AREA LIST */}
          <FlatList
            data={areas}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: hp(20),
              paddingTop: hp(20),
            }}
            renderItem={({item}) => {
              const isSelected = selectedAreas.includes(item?.area);

              // IF ONE SELECTED
              const isDisabled = selectedAreas.length > 0 && !isSelected;

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={isDisabled}
                  onPress={() => {
                    toggleAreaSelection(item?.area);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: hp(10),
                    opacity: isDisabled ? 0.8 : 1,
                  }}>
                  {/* CHECKBOX */}
                  <CheckBox
                    isChecked={isSelected}
                    onClick={() => {
                      toggleAreaSelection(item?.area);
                    }}
                    checkedCheckBoxColor="#7148E4"
                    uncheckedCheckBoxColor={isDisabled ? '#BDBDBD' : '#444'}
                    checkBoxColor={isDisabled ? '#BDBDBD' : '#7148E4'}
                    disabled={isDisabled}
                    style={{
                      transform: [{scale: 1.4}],
                    }}
                  />

                  {/* TEXT */}
                  <Text
                    style={{
                      color: isDisabled ? '#BDBDBD' : colors.pureBlack,
                      fontSize: fontSize(15),
                      fontFamily: fontFamily.poppins500,
                      marginLeft: wp(16),
                    }}>
                    {item?.area}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={() => (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: hp(30),
                  color: colors.pureBlack,
                }}>
                No Areas Found
              </Text>
            )}
          />
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default VendorSearchFilterScreen;
