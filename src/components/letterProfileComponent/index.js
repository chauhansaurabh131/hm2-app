import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

// Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ProfileAvatar = ({firstName, lastName}) => {
  // Get the first letter of both the first and last names
  const firstLetter = firstName?.[0]?.toUpperCase();
  const lastLetter = lastName?.[0]?.toUpperCase();

  // Generate a random background color
  const randomColor = getRandomColor();

  return (
    <View style={[styles.profileCircle, {backgroundColor: randomColor}]}>
      <Text style={styles.profileText}>
        {firstLetter}
        {lastLetter} {/* Display both first and last name initials */}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCircle: {
    justifyContent: 'center',
    alignItems: 'center',

    flex: 1,
  },
  profileText: {
    color: 'white',
    fontSize: 28, // Size of the initials (adjusted for two letters)
    fontWeight: 'bold',
  },
});

export default ProfileAvatar;
