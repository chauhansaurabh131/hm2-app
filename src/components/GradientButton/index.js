// import React from 'react';
// import {TouchableOpacity, Text} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import style from './style';
//
// const GradientButton = ({
//   buttonName,
//   onPress,
//   containerStyle,
//   buttonTextStyle,
//   whiteBackground,
//   disable,
// }) => {
//   return (
//     <TouchableOpacity disabled={disable} onPress={onPress} activeOpacity={0.7}>
//       <LinearGradient
//         // colors={['#0D4EB3', '#9413D0']}
//         colors={
//           whiteBackground ? ['#FFFFFF', '#FFFFFF'] : ['#0D4EB3', '#9413D0']
//         }
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 0}}
//         style={[style.buttonContainer, containerStyle]}>
//         <Text style={[style.buttonText, buttonTextStyle]}>{buttonName}</Text>
//       </LinearGradient>
//     </TouchableOpacity>
//   );
// };
//
// export default GradientButton;

import React, {useState} from 'react';
import {TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import style from './style';

const GradientButton = ({
  buttonName,
  onPress,
  containerStyle,
  buttonTextStyle,
  whiteBackground,
  disable,
  isLoading, // New prop to indicate loading state
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handlePress = () => {
    setIsClicked(true); // Set isClicked to true when pressed
    onPress(); // Call the onPress function
  };

  return (
    <TouchableOpacity
      disabled={disable || isLoading}
      onPress={handlePress}
      activeOpacity={0.7}>
      <LinearGradient
        colors={
          whiteBackground ? ['#FFFFFF', '#FFFFFF'] : ['#0D4EB3', '#9413D0']
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[style.buttonContainer, containerStyle]}>
        {/* Conditional rendering based on isLoading */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#FFFFFF"
            style={style.loader}
          />
        ) : (
          <Text style={[style.buttonText, buttonTextStyle]}>{buttonName}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
