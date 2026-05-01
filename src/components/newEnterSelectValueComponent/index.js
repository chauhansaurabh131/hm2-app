import React, {useState} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import {fontSize} from '../../utils/helpers';

const NewEnterSelectValueComponent = ({
  title,
  value = '',
  onValueChange,
  modalTitle = 'Height',
  modalEgTitle,
  keyboardTypes = 'default',
  emptyText = 'Add',
  EnterModalPlaceholderTittle = 'Enter Height',
  showDivider = true,
  maxLength, // ✅ NEW PROP
}) => {
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleOpen = () => {
    setInputValue(value || '');
    setVisible(true);
  };

  const handleAdd = () => {
    if (!inputValue.trim()) {
      return;
    }
    onValueChange(inputValue.trim());
    Keyboard.dismiss();
    setVisible(false);
  };

  const truncateText = (text, limit = 20) => {
    if (!text) {
      return '';
    }
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  return (
    <>
      {/* SELECT ROW */}
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={handleOpen}>
        <Text style={styles.leftText}>{title}</Text>

        <View style={styles.rightContainer}>
          <Text style={styles.rightText}>
            {value ? truncateText(value) : emptyText}
          </Text>
          <Image source={icons.drooDownLogo} style={styles.arrow} />
        </View>
      </TouchableOpacity>

      {showDivider && <View style={styles.divider} />}

      {/* CENTER MODAL */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <View style={styles.centerWrapper}>
          {/* BACKDROP */}
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              setVisible(false);
            }}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          {/* MODAL CARD */}
          <View style={styles.centerModal}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>

            <View style={styles.inputWrapper}>
              {/* Fake placeholder */}
              {!inputValue && (
                <Text style={styles.fakePlaceholder} pointerEvents="none">
                  <Text style={styles.placeholderMain}>
                    {EnterModalPlaceholderTittle}{' '}
                  </Text>
                  <Text style={styles.placeholderHint}>{modalEgTitle}</Text>
                </Text>
              )}

              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType={keyboardTypes}
                style={styles.input}
                autoFocus
                maxLength={maxLength}
              />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default NewEnterSelectValueComponent;

const styles = StyleSheet.create({
  /* ===== ROW ===== */
  row: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 16,
    backgroundColor: colors.white,
  },

  leftText: {
    fontSize: fontSize(14),
    color: '#8E8E8E',
    fontFamily: 'inter',
    fontWeight: '400',
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rightText: {
    fontSize: fontSize(14),
    color: colors.pureBlack,
    marginRight: 6,
    fontWeight: '800',
    fontFamily: 'inter',
    left: -20,
  },

  arrow: {
    height: 8,
    width: 12,
    tintColor: '#5F6368',
    transform: [{rotate: '-90deg'}],
    left: -15,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    // marginHorizontal: 16,
  },

  /* ===== MODAL ===== */
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  centerModal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    elevation: 8,
  },

  modalTitle: {
    fontSize: fontSize(16),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#000',
  },

  inputWrapper: {
    position: 'relative',
    marginBottom: 30,
  },

  fakePlaceholder: {
    position: 'absolute',
    left: 0,
    top: 10,
    flexDirection: 'row',
    zIndex: 1,
  },

  placeholderMain: {
    fontSize: fontSize(14),
    color: '#000',
    fontWeight: '600',
  },

  placeholderHint: {
    fontSize: fontSize(14),
    color: '#9E9E9E',
  },

  input: {
    height: 40,
    fontSize: fontSize(14),
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#CFCFCF',
    paddingVertical: 6,
  },

  addButton: {
    height: 44,
    backgroundColor: '#000',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addText: {
    color: '#fff',
    fontSize: fontSize(14),
    fontWeight: '600',
  },
});
