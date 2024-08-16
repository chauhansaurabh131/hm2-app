import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Modal} from 'react-native';
import EmojiSelector from 'react-native-emoji-selector';
import Icon from 'react-native-vector-icons/FontAwesome';

const EmojiInput = () => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiSelect = emoji => {
    setText(prevText => prevText + emoji);
    setShowEmojiPicker(false); // Close emoji picker after selecting an emoji
  };

  return (
    <View style={{flex: 1, padding: 10}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
        }}>
        <TouchableOpacity onPress={() => setShowEmojiPicker(true)}>
          <Icon name="smile-o" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={{flex: 1, marginLeft: 10}}
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
        />
      </View>

      <Modal visible={showEmojiPicker} animationType="slide" transparent={true}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <EmojiSelector
            onEmojiSelected={handleEmojiSelect}
            showSearchBar={false}
            columns={8}
          />
        </View>
      </Modal>
    </View>
  );
};

export default EmojiInput;
