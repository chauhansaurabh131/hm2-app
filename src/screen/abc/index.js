import React from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

// Function to convert "DD/MM/YYYY" format to "DD MMM YYYY"
const formatDate = dateString => {
  if (!dateString) {
    return '';
  } // Check if dateString exists and is valid

  const [day, month, year] = dateString.split('/'); // Split the date string
  const date = new Date(`${year}-${month}-${day}`); // Create a Date object

  const dayPart = new Intl.DateTimeFormat('en-US', {day: 'numeric'}).format(
    date,
  );
  const monthPart = new Intl.DateTimeFormat('en-US', {month: 'short'}).format(
    date,
  );
  const yearPart = new Intl.DateTimeFormat('en-US', {year: 'numeric'}).format(
    date,
  );

  return `${dayPart} ${monthPart} ${yearPart}`; // Return the date in "DD MMM YYYY" format
};

const Abc = ({route}) => {
  const {story} = route.params; // Extract the story data from the route

  console.log(' === story ===> ', story);

  // Ensure story object exists and has the necessary properties
  // if (
  //   !story ||
  //   !story.images ||
  //   !story.title ||
  //   !story.content ||
  //   !story.marriageDate
  // ) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <Text>Story data is incomplete.</Text>
  //     </SafeAreaView>
  //   );
  // }

  const {images, title, content, marriageDate} = story;

  console.log(' === formatted marriageDate ===> ', formatDate(marriageDate));

  // Get the total number of images to determine the width dynamically
  const imageCount = images.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageRow}>
        {images.map((imageUrl, index) => (
          <Image
            key={index}
            source={{uri: imageUrl}}
            style={[
              styles.storyImage,
              {width: (Dimensions.get('window').width - 40) / imageCount}, // Adjust width based on image count
            ]}
          />
        ))}
      </View>

      {/* Story Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Story Content */}
      <Text style={styles.content}>{content}</Text>

      {/* Formatted Marriage Date */}
      <Text style={styles.date}>{formatDate(marriageDate) || 'N/A'}</Text>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Keep space between only when there are 3 or more images
    alignItems: 'center',
    marginBottom: 20,
  },
  storyImage: {
    height: 200, // Fixed height for the image
    borderRadius: 15, // Rounded corners
    marginHorizontal: 5, // Space between images
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  content: {
    fontSize: 16,
    color: '#666',
  },
  date: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
});

export default Abc;
