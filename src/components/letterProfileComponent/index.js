// import React from 'react';
// import {Text, View, StyleSheet} from 'react-native';
//
// // Function to generate a random color
// const getRandomColor = () => {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };
//
// const ProfileAvatar = ({firstName, lastName, textStyle, profileTexts}) => {
//   // Get the first letter of both the first and last names
//   const firstLetter = firstName?.[0]?.toUpperCase();
//   const lastLetter = lastName?.[0]?.toUpperCase();
//
//   // Generate a random background color
//   const randomColor = getRandomColor();
//
//   return (
//     <View
//       style={[styles.profileCircle, {backgroundColor: randomColor}, textStyle]}>
//       <Text style={[styles.profileText, profileTexts]}>
//         {firstLetter}
//         {lastLetter}
//       </Text>
//     </View>
//   );
// };
//
// const styles = StyleSheet.create({
//   profileCircle: {
//     width: 110,
//     height: 136,
//     borderRadius: 10,
//     justifyContent: 'center',
//     backgroundColor: '#ccc',
//   },
//   profileText: {
//     color: 'white',
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });
//
// export default ProfileAvatar;

import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {hp} from '../../utils/helpers';

// Function to get a color based on name
const getColorFromName = name => {
  const colors = [
    '#FFA500',
    '#CD5C5C',
    '#9932CC',
    '#663399',
    '#FFD700',
    '#6A5ACD',
    '#7B68EE',
    '#C0C0C0',
    '#2F4F4F',
    '#B22222',
    '#696969',
    '#A9A9A9',
    '#8B0000',
    '#800000',
    '#CD853F',
    '#DEB887',
    '#F4A460',
    '#A0522D',
    '#6495ED',
    '#000080',
    '#4682B4',
    '#8FBC8B',
    '#800080',
    '#00BFFF',
    '#32CD32',
    '#FF69B4',
    '#9370DB',
    '#FF6347',
    '#2E8B57',
    '#20B2AA',
  ];

  // Create a simple hash from the name string
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const ProfileAvatar = ({firstName, lastName, textStyle, profileTexts}) => {
  const initials = `${firstName?.[0] || ''}${
    lastName?.[0] || ''
  }`.toUpperCase();
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  const bgColor = getColorFromName(fullName);

  return (
    <View style={[styles.profileCircle, {backgroundColor: bgColor}, textStyle]}>
      <Text style={[styles.profileText, profileTexts]}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCircle: {
    width: hp(110),
    height: hp(136),
    borderRadius: 6,
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
  profileText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileAvatar;
