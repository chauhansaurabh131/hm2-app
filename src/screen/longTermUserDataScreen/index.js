import React, {useState} from 'react';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import NewDataComponent from '../../components/longtermHomeComponent/newDataComponent';
import NearByMatchDataComponent from '../../components/longtermHomeComponent/nearByMatchDataComponent';
import MyMatchesDataComponent from '../../components/longtermHomeComponent/myMatchesDataComponent';

const LongTermUserDataScreen = ({onShowAlert}) => {
  const [selectedTab, setSelectedTab] = useState('New');

  const tabs = ['New', 'My Matches', 'Nearby Matches'];

  const renderContent = () => {
    switch (selectedTab) {
      case 'New':
        return <NewDataComponent onShowAlert={onShowAlert} />;
      case 'My Matches':
        return <MyMatchesDataComponent onShowAlert={onShowAlert} />;
      case 'Nearby Matches':
        return <NearByMatchDataComponent onShowAlert={onShowAlert} />;
      default:
        return null;
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        {/* 🔹 Tabs */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#EBF2FE',
            borderRadius: 30,
            padding: hp(5),
            height: hp(40),
            marginHorizontal: wp(18),
          }}>
          {tabs.map(tab => {
            const isActive = selectedTab === tab;

            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  borderRadius: hp(25),
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(11),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 🔹 Content */}
        <View style={{marginTop: hp(0), flex: 1}}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
};

export default LongTermUserDataScreen;
