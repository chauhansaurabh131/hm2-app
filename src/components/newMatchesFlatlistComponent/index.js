import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import {icons, images} from '../../assets';
import {fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const data = [
  {
    id: 1,
    name: 'Daksh Acharya',
    source: require('../../assets/images/demo_6.png'),
    age: '32',
    state: 'Gujarat',
    city: 'Mahesana',
    county: 'India',
  },
  {
    id: 2,
    name: 'Aadi Adhvaryu ',
    source: require('../../assets/images/demo_5.png'),
    age: '30',
    state: 'Gujarat',
    city: 'Vododara',
    county: 'India',
  },
  {
    id: 3,
    name: 'Aadvik Patel',
    source: require('../../assets/images/demo_3.png'),
    age: '29',
    state: 'Gujarat',
    city: 'Vododara',
    county: 'India',
  },
  // Add more images as needed
];

const NewMatchesFlatlistComponent = () => {
  const [showAll, setShowAll] = useState(false);

  const renderImageItem = ({item}) => (
    <View style={{margin: 5}}>
      <Image
        source={item.images}
        style={{width: 100, height: 100, borderRadius: 5}}
      />
    </View>
  );

  return (
    <View style={{flex: 1, padding: 10, marginLeft: -12}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {!showAll ? (
          data.slice(0, 3).map(item => (
            <View key={item.id} style={{margin: 5}}>
              <Image
                source={item.source}
                style={{
                  width: wp(110),
                  height: hp(136),
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              />
              <Text
                style={{
                  fontSize: fontSize(10),
                  lineHeight: hp(15),
                  fontWeight: '700',
                  color: colors.black,
                  textAlign: 'center',
                }}>
                {item.name}
              </Text>
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <Text
                  style={{
                    fontSize: fontSize(8),
                    lineHeight: hp(12),
                    color: colors.black,
                    fontWeight: '400',
                    marginRight: 2,
                  }}>
                  {item.age}
                </Text>
                <Text
                  style={{
                    fontSize: fontSize(8),
                    lineHeight: hp(12),
                    color: colors.black,
                    fontWeight: '400',
                    marginRight: 2,
                  }}>
                  yrs,
                </Text>
                <Text
                  style={{
                    fontSize: fontSize(8),
                    lineHeight: hp(12),
                    color: colors.black,
                    fontWeight: '400',
                    marginRight: 2,
                  }}>
                  {item.state}
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <Text
                  style={{
                    fontSize: fontSize(8),
                    lineHeight: hp(12),
                    color: colors.black,
                    fontWeight: '400',
                    marginRight: 2,
                  }}>
                  {item.city},
                </Text>
                <Text
                  style={{
                    fontSize: fontSize(8),
                    lineHeight: hp(12),
                    color: colors.black,
                    fontWeight: '400',
                    marginRight: 2,
                  }}>
                  {item.county}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  marginTop: hp(6),
                }}>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity>
                    <Image
                      source={icons.thumsDownIcon}
                      style={{width: hp(20), height: hp(20)}}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity>
                    <Image
                      source={icons.likeIcon}
                      style={{width: hp(20), height: hp(20)}}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <TouchableOpacity>
                    <Image
                      source={icons.shareIcon}
                      style={{width: hp(20), height: hp(20)}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <FlatList
            data={data}
            keyExtractor={item => item.id.toString()}
            renderItem={renderImageItem}
            numColumns={3}
          />
        )}
      </View>
      {/*<TouchableOpacity onPress={() => setShowAll(!showAll)}>*/}
      <TouchableOpacity>
        <Text style={{textAlign: 'center', marginTop: 20, color: colors.black}}>
          {/*{showAll ? 'Show Less' : 'Show All Results'}*/}
          Show All Results
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewMatchesFlatlistComponent;
