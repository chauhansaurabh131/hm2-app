import React, {useRef, useState, useEffect} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily} from '../../utils/helpers';
import {icons} from '../../assets';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../actions/homeActions';

const Abc = () => {
  const hobbiesBottomSheetRef = useRef();
  const apiDispatch = useDispatch();
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  const {user} = useSelector(state => state.auth);
  console.log(' === user ===> ', user?.user?.hobbies);

  // Ensure that hobbies are handled as an array and split properly
  useEffect(() => {
    if (user?.user?.hobbies) {
      const hobbies =
        typeof user?.user?.hobbies === 'string'
          ? user?.user?.hobbies.split(',').map(item => item.trim()) // Split string into array and trim spaces
          : user?.user?.hobbies; // Ensure it's an array

      setSelectedHobbies(hobbies);
    }
  }, [user?.user?.hobbies]);

  const handleHobbiesSelectPurpose = purpose => {
    if (selectedHobbies.includes(purpose)) {
      setSelectedHobbies(selectedHobbies.filter(item => item !== purpose));
    } else {
      setSelectedHobbies([...selectedHobbies, purpose]);
    }
  };

  // Function to remove a selected purpose
  const handleHobbiesRemovePurpose = purpose => {
    setSelectedHobbies(selectedHobbies.filter(item => item !== purpose));
  };

  const onAddPress = () => {
    apiDispatch(
      updateDetails({
        hobbies: selectedHobbies, // Send the string instead of array
      }),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginTop: 20, marginHorizontal: 17, flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'orange',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: fontFamily.poppins600,
            }}>
            Purpose
          </Text>
          <TouchableOpacity
            onPress={() => hobbiesBottomSheetRef.current.open()}>
            <Image source={icons.rightSideIcon} />
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 20}}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: fontFamily.poppins600,
            }}>
            Selected Purposes:
          </Text>
          {/* Display each purpose in a separate box */}
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
            {selectedHobbies.length > 0 ? (
              selectedHobbies.map((purpose, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: '#f0f0f0',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 20,
                    marginRight: 10,
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'black', marginRight: 10}}>
                    {purpose}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleHobbiesRemovePurpose(purpose)}>
                    <Text style={{color: 'red'}}>X</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={{color: 'grey'}}>No purpose selected</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={{marginTop: 50, alignItems: 'center'}}
          onPress={onAddPress}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Component */}
      <RBSheet
        ref={hobbiesBottomSheetRef}
        height={400}
        openDuration={250}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
          },
        }}>
        <View>
          <Text style={{fontSize: 18, fontFamily: fontFamily.poppins600}}>
            Select Purpose
          </Text>
          <TouchableOpacity
            onPress={() => handleHobbiesSelectPurpose('Writing')}>
            <Text style={{color: 'black', marginTop: 10}}>Writing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleHobbiesSelectPurpose('Play Instrument')}>
            <Text style={{color: 'black', marginTop: 10}}>Play Instrument</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleHobbiesSelectPurpose('Game')}>
            <Text style={{color: 'black', marginTop: 10}}>Game</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleHobbiesSelectPurpose('Movie')}>
            <Text style={{color: 'black', marginTop: 10}}>Movie</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleHobbiesSelectPurpose('Sports')}>
            <Text style={{color: 'black', marginTop: 10}}>Sports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleHobbiesSelectPurpose('Running')}>
            <Text style={{color: 'black', marginTop: 10}}>Running</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleHobbiesSelectPurpose('Cycling')}>
            <Text style={{color: 'black', marginTop: 10}}>Cycling</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default Abc;
