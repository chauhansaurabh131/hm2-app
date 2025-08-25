// Message.js
import React, {useEffect} from 'react';
import {SafeAreaView, Text, TouchableOpacity, Alert} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import {colors} from '../../utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import {paymentDetails} from '../../actions/homeActions';
import Config from 'react-native-config'; // For environment variables

const Message = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const payment = useSelector(state => state.home);
  const PlanDetails = payment?.paymentDetail;

  const token = user?.tokens?.access?.token;

  // Use env variable or fallback
  const API_URL = Config.API_URL || 'https://stag.mntech.website/api';

  useEffect(() => {
    dispatch(paymentDetails());
  }, [dispatch]);

  const handlePayment = async () => {
    try {
      // 1. Create Razorpay Order
      const response = await axios.post(
        `${API_URL}/v1/user/razorpay/order`,
        {planId: PlanDetails?.data[0]?.id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true', // optional
          },
        },
      );

      const {id: orderId, amount, paymentHistoryToken} = response.data;

      if (!paymentHistoryToken) {
        throw new Error('Payment history token missing');
      }

      // 2. Construct callback URL for Razorpay server to notify backend
      const callbackUrl = `${API_URL}/v1/user/razorpay/is-order-complete?authToken=${encodeURIComponent(
        token,
      )}&paymentHistoryToken=${encodeURIComponent(paymentHistoryToken)}`;

      // 3. Razorpay Options
      const options = {
        key: 'rzp_live_OyWOR7Tj1c7Vnh',
        name: 'Happy Milan',
        description: 'Credits towards consultation',
        image: 'https://i.imgur.com/3g7nmJC.png',
        order_id: orderId,
        amount: amount.toString(), // In paise
        currency: 'INR',
        callback_url: callbackUrl,
        prefill: {
          name: user?.name || 'User',
          email: user?.email || 'test@example.com',
          contact: user?.phone || '9999999999',
        },
        theme: {color: '#0F52BA'},
      };

      // 4. Open Razorpay payment screen
      RazorpayCheckout.open(options)
        .then(data => {
          console.log('Payment Success:', data);
          Alert.alert('Payment Successful', 'We are verifying your payment.');
          // Verification handled by callback_url server-side
        })
        .catch(error => {
          console.error('Payment Failed:', error);
          Alert.alert(
            'Payment Error',
            error.description || 'Please try again.',
          );
        });
    } catch (error) {
      console.error(
        'Order Creation Error:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Unable to initiate payment.');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <TouchableOpacity onPress={handlePayment}>
        <Text style={{color: colors.black, alignSelf: 'center'}}>Payment</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Message;
