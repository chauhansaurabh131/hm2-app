import React, {useEffect} from 'react';
import {SafeAreaView, Text, TouchableOpacity, Alert} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import {colors} from '../../utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import {paymentDetails} from '../../actions/homeActions';

const Message = () => {
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(paymentDetails());
  }, [dispatch]);

  const payment = useSelector(state => state.home);
  const PlanDetails = payment?.paymentDetail;
  const token = user?.tokens?.access?.token;

  const handlePayment = async () => {
    try {
      // Create the order
      const response = await axios.post(
        'https://happymilan.tech/api/v1/user/razorpay/order',
        {planId: PlanDetails?.data[0]?.id},
        {headers: {Authorization: `Bearer ${token}`}},
      );

      console.log('Order Creation Response:', response.data);

      const {orderId, amount, paymentHistoryToken} = response.data;

      if (!paymentHistoryToken) {
        throw new Error('Payment history token is missing from the response');
      }

      console.log('Payment History Token:', paymentHistoryToken);

      // Proceed with Razorpay payment
      const options = {
        description: 'Credits towards consultation',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: 'rzp_live_2SoKzqAUA6FY69',
        amount: amount.toString(),
        order_id: orderId,
        name: 'foo',
        prefill: {
          email: 'void@razorpay.com',
          contact: '9191919191',
          name: 'Razorpay Software',
        },
        theme: {color: '#F37254'},
      };

      RazorpayCheckout.open(options)
        .then(async data => {
          const {razorpay_payment_id} = data;

          console.log(`Success: ${razorpay_payment_id}`);
          console.log('Payment History Token:', paymentHistoryToken);
          console.log('===  Token:', token);

          // Verification API call with paymentHistoryToken as query parameter
          try {
            const verificationResponse = await axios.post(
              `https://happymilan.tech/api/v1/user/razorpay/is-order-complete?paymentHistoryToken=${encodeURIComponent(
                paymentHistoryToken,
              )}&authToken=${encodeURIComponent(token)}`,
              {razorpay_payment_id},
              {headers: {Authorization: `Bearer ${token}`}},
            );

            console.log(
              'Payment verification response:',
              verificationResponse.data,
            );
            Alert.alert('Success', 'Payment verified successfully.');
          } catch (verificationError) {
            console.error(
              'Verification Error:',
              verificationError.response?.data || verificationError.message,
            );
            Alert.alert(
              'Error',
              'Payment verification failed. Please contact support.',
            );
          }
        })
        .catch(error => {
          console.error(`Payment Error: ${error.code} | ${error.description}`);
          Alert.alert('Payment Error', 'Payment failed. Please try again.');
        });
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to create order. Please try again.');
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
