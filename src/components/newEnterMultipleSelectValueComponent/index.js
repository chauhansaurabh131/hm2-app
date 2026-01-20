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
} from 'react-native';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import {fontSize} from '../../utils/helpers';

const NewEnterMultipleSelectValueComponent = ({
  title,
  value = [], // ✅ ARRAY
  onValueChange,
  modalTitle = 'City',
  modalEgTitle,
  keyboardTypes = 'default',
  emptyText = 'Add',
  EnterModalPlaceholderTittle = 'Enter',
  showDivider = true,
  valuesBelowContainerStyle,
}) => {
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    // prevent duplicate
    if (value.includes(trimmed)) {
      setInputValue('');
      return;
    }

    onValueChange([...value, trimmed]);
    setInputValue('');
  };

  const handleRemove = item => {
    onValueChange(value.filter(v => v !== item));
  };

  return (
    <>
      {/* ROW */}
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => setVisible(true)}>
        <Text style={styles.leftText}>{title}</Text>

        <View style={styles.rightContainer}>
          <Text style={styles.rightText}>{emptyText}</Text>
          <Image source={icons.drooDownLogo} style={styles.arrow} />
        </View>
      </TouchableOpacity>

      {/* VALUES BELOW ROW */}
      {value.length > 0 && (
        <View style={[styles.valuesBelowContainer, valuesBelowContainerStyle]}>
          <Text style={styles.valuesBelowText}>{value.join(', ')}</Text>
        </View>
      )}

      {showDivider && <View style={styles.divider} />}

      {/* MODAL */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <View style={styles.centerWrapper}>
          {/* BACKDROP */}
          <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          {/* MODAL CARD */}
          <View style={styles.centerModal}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>

            {/* ✅ ADDED VALUES WITH REMOVE */}
            <View style={styles.chipsContainer}>
              {value.map((item, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>

                  <TouchableOpacity
                    onPress={() => handleRemove(item)}
                    style={styles.removeBtn}>
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* INPUT */}
            <View style={styles.inputWrapper}>
              {!inputValue && (
                <Text style={styles.fakePlaceholder}>
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
              />
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setVisible(false)}>
                <Text style={styles.cancelText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },

  leftText: {
    fontSize: fontSize(16),
    color: '#8E8E8E',
    fontFamily: 'inter',
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

  valuesBelowContainer: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },

  valuesBelowText: {
    fontSize: fontSize(16),
    color: '#000',
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
  },

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
    paddingVertical: 20,
    paddingHorizontal: 20,
    elevation: 8,
  },

  modalTitle: {
    fontSize: fontSize(16),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#000',
  },

  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    fontSize: fontSize(13),
    color: '#000',
    marginRight: 6,
  },

  removeBtn: {
    padding: 2,
  },

  removeText: {
    fontSize: fontSize(12),
    color: '#000',
    fontWeight: '700',
  },

  inputWrapper: {
    position: 'relative',
    marginBottom: 24,
  },

  input: {
    height: 40,
    fontSize: fontSize(14),
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#CFCFCF',
    paddingVertical: 6,
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

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cancelButton: {
    height: 44,
    width: '45%',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: '#000',
    fontSize: fontSize(14),
    fontWeight: '600',
  },

  addButton: {
    height: 44,
    width: '45%',
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

export default NewEnterMultipleSelectValueComponent;
