import React, {useState} from 'react';
import {SafeAreaView, Text, View, StyleSheet, Button} from 'react-native';

import NewTextInputComponent from '../../components/newTextInputComponent';
import {icons} from '../../assets'; // Import the CustomTextInput component

const Message = () => {
  const [text, setText] = useState('');

  const handleChangeText = input => {
    setText(input);
  };

  const handlePress = () => {
    console.log('TextInput value:', text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Message</Text>
      <NewTextInputComponent
        value={text}
        onChangeText={handleChangeText}
        placeholder="Your Email or Mobile"
        style={styles.textInput}
        LeftIconName={icons.profileLogo}
      />
      {/*<Button title="Submit" onPress={handlePress} />*/}

      <NewTextInputComponent
        value={text}
        onChangeText={handleChangeText}
        placeholder="Enter Password"
        style={styles.textInput}
        LeftIconName={icons.logLogo}
        RightIconName={icons.secureEyeLogo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  textInput: {
    marginBottom: 20,
  },
});

export default Message;
