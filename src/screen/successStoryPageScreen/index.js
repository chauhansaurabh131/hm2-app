import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Share,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import SuccessStoryFlatListComponent from '../../components/SuccessStoryFlatListComponent';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AppColorLogo from '../../components/appColorLogo';
import {useSelector} from 'react-redux';

const SuccessStoryPageScreen = ({route}) => {
  const {story} = route.params;

  const [topModalVisible, setTopModalVisible] = useState(false);
  const [likeData, setLikeData] = useState(null); // For storing response data
  const [likesList, setLikesList] = useState([]); // Store the likes list
  const [storyDetails, setStoryDetails] = useState(story); // Store the story data
  const [viewsList, setViewsList] = useState([]); // Store the views list
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;
  const tokens = user?.tokens?.access?.token;

  const {images, title, content, marriageDate} = story;
  const imageCount = images.length;
  const StoriesId = story?._id;
  const userId = user?.user?.id;

  console.log(' === StoriesId ===> ', StoriesId);

  // Function to call the API to fetch the list of likes
  const fetchLikesPaginated = async () => {
    if (!StoriesId || !tokens) {
      return;
    }

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/story-Like/get-likes-paginated/${StoriesId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokens}`, // Pass the token in the Authorization header
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setLikesList(data?.data || []); // Set the likes list to the state
      } else {
        console.error('Error fetching likes:', data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // Function to call the API to fetch the list of views (paginated)
  const fetchViewsPaginated = async () => {
    if (!StoriesId || !tokens) {
      return;
    }

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/success-story-View/paginated-all/${StoriesId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokens}`, // Pass the token in the Authorization header
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setViewsList(data?.data || []); // Set the views list to the state
      } else {
        console.error('Error fetching views:', data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // Fetch the likes list on component mount or when the story ID changes
  useEffect(() => {
    fetchLikesPaginated();
    fetchViewsPaginated(); // Fetch the views when the component mounts or updates
  }, [StoriesId, tokens]);

  const handleStoryView = async () => {
    if (!StoriesId || !userId || !tokens) {
      return;
    }

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/success-story-View/create-view',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens}`,
          },
          body: JSON.stringify({
            storyId: StoriesId,
            viewerId: userId,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Story view tracked:', data);
      } else {
        console.error('Error tracking story view:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    handleStoryView();
  }, [StoriesId, userId, tokens]);

  // Fetch the story data from the API
  const fetchStoryData = async () => {
    if (!StoriesId || !tokens) {
      return;
    }

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/story/get-story-by-id/${StoriesId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokens}`, // Pass the token in the Authorization header
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setStoryDetails(data); // Set the fetched story details
      } else {
        console.error('Error fetching story:', data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // Use useFocusEffect to refetch the story data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchStoryData();
    }, [StoriesId, tokens]),
  );

  // Fetch the like data from the API
  const fetchLikeData = async () => {
    if (!userId || !StoriesId || !tokens) {
      return;
    }

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/story-Like/get-like-story/${StoriesId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokens}`, // Pass the token in the Authorization header
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setLikeData(data); // Update the state with the response data
      } else {
        console.error('Error fetching like data:', data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLikeData();
    }, [StoriesId, tokens]),
  );

  // Function to handle the "like" action (triggered on icon press)
  const handleLike = async () => {
    if (!userId || !StoriesId || !tokens) {
      return; // Make sure we have all the necessary data
    }

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/story-Like/create-like',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens}`, // Use the user's token for authorization
          },
          body: JSON.stringify({
            storyId: StoriesId,
            isLike: true, // We are "liking" the story
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setLikeData({data: [{isLike: true}]});
        fetchLikeData();
        fetchLikesPaginated();
      } else {
        console.error('Error liking the story:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to handle the "unlike" action (triggered on icon press)
  const handleUnlike = async () => {
    if (!userId || !StoriesId || !tokens || !likeData?.data?.[0]?.id) {
      return; // Ensure necessary data is available
    }

    try {
      const likeId = likeData?.data?.[0]?.id; // ID of the like data to update

      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/story-Like/update-like/${likeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens}`,
          },
          body: JSON.stringify({
            storyId: StoriesId,
            isLike: false, // We are "unliking" the story
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setLikeData({data: [{isLike: false}]});
        fetchLikeData();
        fetchLikesPaginated();
      } else {
        console.error('Error unliking the story:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Check if `likeData` exists and has the required structure
  const isLiked = likeData?.data?.[0]?.isLike;

  // Format the createdAt date
  // const formattedTime = timeAgo(story?.createdAt);

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  // Utility function to format time
  const timeAgo = date => {
    const now = new Date();
    const diffInMs = now - new Date(date); // Difference in milliseconds
    const diffInSec = Math.floor(diffInMs / 1000); // Convert milliseconds to seconds
    const diffInMin = Math.floor(diffInSec / 60); // Convert seconds to minutes
    const diffInHours = Math.floor(diffInMin / 60); // Convert minutes to hours
    const diffInDays = Math.floor(diffInHours / 24); // Convert hours to days
    const diffInMonths = Math.floor(diffInDays / 30); // Convert days to months
    const diffInYears = Math.floor(diffInMonths / 12); // Convert months to years

    // Handle cases for "just now", minutes, hours, days, and long dates
    if (diffInSec < 60) {
      return 'Just now';
    } else if (diffInMin < 60) {
      return `${diffInMin} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hr ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays}d${diffInDays > 1 ? '' : ''} ago`;
    } else if (diffInDays >= 30 && diffInDays < 365) {
      return `${new Date(date).getDate()}-${
        new Date(date).getMonth() + 1
      }-${new Date(date).getFullYear()}`;
    } else {
      return `${new Date(date).getDate()}-${
        new Date(date).getMonth() + 1
      }-${new Date(date).getFullYear()}`;
    }
  };

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle empty string
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const postedFirstName = capitalizeFirstLetter(story?.userId?.name);
  const postedLastName = capitalizeFirstLetter(story?.userId?.lastName);
  const formattedTime = timeAgo(story?.createdAt);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Happy Milan App', // Message to share
      });

      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        <View style={style.headerContainer}>
          <AppColorLogo />

          <TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.profileLogo}
            />
          </TouchableOpacity>
        </View>

        <View style={style.headerTittleContainer}>
          <Text style={style.headerTittleTextStyle}>
            Story of {story?.title || 'Riya & Rohan'}
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            style={style.addPhotoContainer}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={icons.back_arrow_icon}
              style={style.addPhotoImageStyle}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={style.headerUnderLine} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.bodyContainer}>
          <Text style={style.headingDescriptionTextStyle}>
            {story?.content ||
              `When the Tudor king fell for a young lady-in-waiting, Anne Boleyn,
            who possessed eyes "black and beautiful," he was long married to a
            Spanish princess. But Anne refused to be a royal mistress, and the
            king rocked the Western world to win his divorce and make Anne
            queen. Ambassadors could not believe how enslaved the king was by
            his love for Anne. "This accursed Anne has her foot in the stirrup,"
            {'  '} {'\n'} {'\n'}complained the Spanish emissary. To comprehend
            the king's passion, one need only read his 16th century love
            letters, revealing his torment over how elusive she remained: "I beg
            to know expressly your intention touching the love between us…having
            been more than a year wounded by the dart of love, and not yet sure
            whether I shall fail or find a place in your affection." (Their love
            affair ended when he had her beheaded.)`}
          </Text>

          <Text
            style={[style.headingDescriptionTextStyle, {marginTop: hp(20)}]}>
            Posted By
          </Text>

          <View style={style.postedContainer}>
            <Text style={style.postedNameText}>{postedFirstName}</Text>
            <Text style={style.postedNameText}> {postedLastName}</Text>

            <Text style={style.postedTimeText}>{formattedTime}</Text>
          </View>

          <View style={style.bodyShareContainer}>
            <View style={style.bodyShareContainers}>
              <Text style={style.viewsNumber}>
                {viewsList?.totalResults}{' '}
                <Text style={{color: '#929292'}}>Reads</Text>
              </Text>

              <Text style={[style.viewsNumber, {marginLeft: wp(37)}]}>
                {likesList?.totalResults}{' '}
                <Text style={{color: '#929292'}}>Hearts</Text>
              </Text>
            </View>

            <View style={style.bodyShareContainers}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  if (isLiked) {
                    handleUnlike(); // Call the unlike function if the user has already liked the story
                  } else {
                    handleLike(); // Call the like function if the user hasn't liked the story yet
                  }
                }}>
                <Image
                  source={
                    isLiked ? icons.user_like_icon : icons.gradient_disLike_icon
                  }
                  style={style.likeIconContainer}
                />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.5} onPress={handleShare}>
                <Image
                  source={icons.gradient_share_icon}
                  style={style.shareIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={style.bodyUnderLine} />

        <View style={{marginHorizontal: 17}}>
          <Text
            style={{
              marginTop: 20,
              color: colors.black,
              fontSize: hp(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins500,
            }}>
            More Stories
          </Text>

          <SuccessStoryFlatListComponent />

          <HomeTopSheetComponent
            isVisible={topModalVisible}
            onBackdropPress={toggleModal}
            onBackButtonPress={toggleModal}
          />

          <View style={{height: 50}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SuccessStoryPageScreen;
