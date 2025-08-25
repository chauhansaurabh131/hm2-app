import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';

const Abc = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const [creditData, setCreditData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCredit = async () => {
      if (!accessToken || !userId) {
        console.warn('Missing accessToken or userId');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/user/get-credit/${userId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch credit data');
        }

        const data = await response.json();
        setCreditData(data);
      } catch (error) {
        console.error('Error fetching credit:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCredit();
  }, [accessToken, userId]);

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : creditData ? (
        <Text>Credit: {JSON.stringify(creditData?.credit?.creditBalance)}</Text>
      ) : (
        <Text>No credit data</Text>
      )}
    </SafeAreaView>
  );
};

export default Abc;
