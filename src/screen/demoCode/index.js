import React from 'react';
import {SafeAreaView} from 'react-native';
import ProfileCheckboxGroup from '../../components/profileCheckBox';
import {useSelector} from 'react-redux';

const DemoCode = () => {
  const {user} = useSelector(state => state.auth);

  console.log(' === name  ===> ', user?.user.name);
  console.log(
    ' === `${user?.user.firstName} ${user?.user.lastName}`  ===> ',
    `${user?.user.firstName} ${user?.user.lastName}`,
  );
  console.log(' === user?.user.firstName  ===> ', user?.user.firstName);
  console.log(
    ' === `Profile ID: ${user?.user.userUniqueId}`  ===> ',
    `Profile ID: ${user?.user.userUniqueId}`,
  );

  const Display_Name = [
    {id: 1, label: `${user?.user.firstName} ${user?.user.lastName}`},
    {id: 2, label: user?.user.firstName},
    {id: 3, label: `Profile ID: ${user?.user.userUniqueId}`},
  ];

  const selectedId =
    Display_Name.findIndex(item => item.label === user?.user.name) + 1;

  const handleCheckboxChange = label => {
    console.log('Selected Label:', label);
  };

  return (
    <SafeAreaView style={{flex: 1, marginTop: 50, marginLeft: 50}}>
      <ProfileCheckboxGroup
        data={Display_Name}
        selectedId={selectedId || 1} // Default to 1 if `selectedId` is undefined
        onChange={handleCheckboxChange}
      />
    </SafeAreaView>
  );
};

export default DemoCode;
