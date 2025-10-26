import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  ActivityIndicator,
  FlatList,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

// 🔹 Separate render item component
const PlanItem = ({item}) => {
  return (
    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
      <Text style={{fontSize: 16, fontWeight: 'bold'}}>
        {item?.name || 'No Name'}
      </Text>
      <Text>{item?.price ? `Price: ${item.price}` : 'No Price'}</Text>
    </View>
  );
};

const DemoCode = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://stag.mntech.website/api/v1/admin/plan/get-plan-dating',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(' === Plans Response ===> ', response.data);
      setPlans(response.data?.data || []);
    } catch (error) {
      console.error(
        'Error fetching plans:',
        error?.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Call API every time this screen is focused
  useFocusEffect(
    useCallback(() => {
      if (accessToken) {
        fetchPlans();
      }
    }, [accessToken]),
  );

  return (
    <SafeAreaView style={{flex: 1, padding: 16}}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <PlanItem item={item} />}
          ListEmptyComponent={<Text>No plans found</Text>}
        />
      )}
    </SafeAreaView>
  );
};

export default DemoCode;
