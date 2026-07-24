import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fontFamily, fontSize, hp, wp } from '../../utils/helpers';
import { icons } from '../../assets';
import { useNavigation, useRoute } from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import DocumentPicker from 'react-native-document-picker';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import RNBlobUtil from 'react-native-blob-util';
import axios from 'axios';

const VendorClaimYourBusinessScreen = () => {
  const route = useRoute();

  const { vendorData, vendorId, location, category, previousScreen } =
    route.params || {};

  const navigation = useNavigation();

  const [businessName, setBusinessName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const [city, setCity] = useState('');
  const [isCityFocused, setIsCityFocused] = useState(false);

  const [name, setName] = useState('');
  const [isNameFocused, setIsNameFocused] = useState(false);

  const [number, setNumber] = useState('');
  const [isNumberFocused, setIsNumberFocused] = useState(false);

  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const refRoleSheet = useRef();

  const [selectedRole, setSelectedRole] = useState('');

  const refDocumentTypeSheet = useRef();

  const [selectedDocumentType, setSelectedDocumentType] = useState('');

  const [documentFile, setDocumentFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const roles = [
    'Owner',
    'Manager',
    'Partner',
    'Employee',
    'Marketing Head',
    'Operations Head',
    'Other',
  ];

  const documentTypes = [
    'GST Certificate',
    'Business Registration Certificate',
    'Shop License',
    'Visiting Card',
    'Letter on company letterhead',
    'Invoice issued by the business',
  ];

  const BLOCKED_EMAIL_DOMAINS = [
    'yopmail.com',
    'yopmail.fr',
    'yopmail.net',
    'yapmail.com',
    'mailinator.com',
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'throwawaymail.com',
    'example.com',
    'example.org',
    'example.net',
  ];

  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return false;
    }

    const domain = email.split('@')[1]?.toLowerCase();

    return !BLOCKED_EMAIL_DOMAINS.includes(domain);
  };

  const isFormValid =
    businessName.trim() &&
    city.trim() &&
    name.trim() &&
    number.trim().length === 10 &&
    isValidEmail(email.trim()) &&
    selectedRole &&
    selectedDocumentType &&
    documentFile;

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });

      console.log('Document =>', res);

      setDocumentFile(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log(err);
      }
    }
  };

  const getContentType = fileName => {
    const ext = fileName.split('.').pop().toLowerCase();

    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';

      case 'png':
        return 'image/png';

      case 'pdf':
        return 'application/pdf';

      default:
        return 'application/octet-stream';
    }
  };

  const uploadDocument = async () => {
    try {
      if (!documentFile) {
        throw new Error('No document selected');
      }

      const contentType = getContentType(documentFile.name);

      // 1. Get Presigned URL
      const { data } = await axios.post(
        'https://test.mntech.website/api/v1/s3/uploadclaimdoc',
        {
          name: 'claim-document',
          key: documentFile.name,
          contentType,
        },
      );

      console.log('Upload API =>', data);

      const uploadUrl = data?.data?.url;
      const docUrl = data?.data?.docUrl;

      if (!uploadUrl || !docUrl) {
        throw new Error('Failed to get presigned URL');
      }

      // 2. Decode local file path
      const rawUri = documentFile.fileCopyUri || documentFile.uri;
      const localPath = decodeURIComponent(rawUri.replace('file://', ''));

      console.log('Local Path =>', localPath);

      // 3. Upload binary file data to S3 using RNBlobUtil.wrap
      const uploadResponse = await RNBlobUtil.fetch(
        'PUT',
        uploadUrl,
        {
          'Content-Type': contentType,
          'x-amz-acl': 'public-read',
        },
        RNBlobUtil.wrap(localPath),
      );

      const status = uploadResponse.info().status;
      console.log('Upload Status =>', status);

      if (status !== 200 && status !== 204) {
        throw new Error(`Upload failed with status ${status}`);
      }

      return docUrl;
    } catch (e) {
      console.log('Upload Error =>', e);
      return null;
    }
  };

  const submitClaimRequest = async () => {
    try {
      if (
        !businessName ||
        !city ||
        !name ||
        !number ||
        !email ||
        !selectedRole ||
        !selectedDocumentType ||
        !documentFile
      ) {
        Toast.show({
          type: 'error',
          text1: 'Please fill all details',
        });
        return;
      }

      setLoading(true);

      // Upload to S3
      const documentUrl = await uploadDocument();

      if (!documentUrl) {
        Toast.show({
          type: 'error',
          text1: 'Failed to upload document',
        });
        setLoading(false);
        return;
      }

      console.log('Document URL =>', documentUrl);

      // Final API
      const response = await axios.post(
        'https://test.mntech.website/api/v1/user/claim-request',
        {
          vendorId,
          businessName,
          city,
          fullName: name,
          mobileNumber: number,
          email,
          role: selectedRole,
          documentProofName: selectedDocumentType,
          documentProof: documentUrl,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Claim Response =>', response.data);

      Toast.show({
        type: 'success',
        text1: 'Request submitted successfully',
      });

      navigation.navigate('VendorRequestSubmitScreen', {
        vendorData,
        vendorId,
        location,
        category,
        previousScreen,
      });
    } catch (error) {
      console.log(error?.response?.data || error);

      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      {/* Header */}
      <View
        style={{
          height: hp(54),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 0,
            width: wp(50),
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{
              width: hp(14),
              height: hp(14),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins600,
          }}>
          Claim Your Business
        </Text>
      </View>
      <View
        style={{ width: '100%', height: hp(1), backgroundColor: '#E6E6E6' }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginHorizontal: wp(18), marginTop: hp(22) }}>
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins500,
            }}>
            Business Details
          </Text>

          <View
            style={{
              marginTop: hp(20),
              borderWidth: hp(1),
              borderColor: isFocused ? '#7148E4' : '#D9D9D9',
              // borderColor: 'gray',
              borderRadius: hp(10),
              height: hp(50),
              justifyContent: 'center',
              paddingHorizontal: wp(16),
            }}>
            {(isFocused || businessName) && (
              <View
                style={{
                  position: 'absolute',
                  top: -10,
                  left: wp(16),
                  backgroundColor: colors.white,
                  paddingHorizontal: wp(6),
                }}>
                <Text
                  style={{
                    color: isFocused ? '#7148E4' : 'gray',
                    fontSize: fontSize(12),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Business Name
                </Text>
              </View>
            )}

            <TextInput
              value={businessName}
              onChangeText={setBusinessName}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused || businessName ? '' : 'Business Name'}
              placeholderTextColor="#848484"
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                padding: 0,
              }}
            />
          </View>

          {/* City */}
          <View
            style={{
              marginTop: hp(20),
              borderWidth: hp(1),
              borderColor: isCityFocused ? '#7148E4' : '#D9D9D9',
              borderRadius: hp(10),
              height: hp(50),
              justifyContent: 'center',
              paddingHorizontal: wp(16),
            }}>
            {(isCityFocused || city) && (
              <View
                style={{
                  position: 'absolute',
                  top: -10,
                  left: wp(16),
                  backgroundColor: colors.white,
                  paddingHorizontal: wp(6),
                }}>
                <Text
                  style={{
                    color: isCityFocused ? '#7148E4' : 'gray',
                    fontSize: fontSize(12),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  City
                </Text>
              </View>
            )}

            <TextInput
              value={city}
              onChangeText={setCity}
              onFocus={() => setIsCityFocused(true)}
              onBlur={() => setIsCityFocused(false)}
              placeholder={isCityFocused || city ? '' : 'City'}
              placeholderTextColor="#848484"
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                padding: 0,
              }}
            />
          </View>

          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins500,
              marginVertical: hp(17),
            }}>
            Your Details
          </Text>

          {/* Name */}
          <View
            style={{
              borderWidth: hp(1),
              borderColor: isNameFocused ? '#7148E4' : '#D9D9D9',
              borderRadius: hp(10),
              height: hp(50),
              justifyContent: 'center',
              paddingHorizontal: wp(16),
            }}>
            {(isNameFocused || name) && (
              <View
                style={{
                  position: 'absolute',
                  top: -10,
                  left: wp(16),
                  backgroundColor: colors.white,
                  paddingHorizontal: wp(6),
                }}>
                <Text
                  style={{
                    color: isNameFocused ? '#7148E4' : 'gray',
                    fontSize: fontSize(12),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Full Name
                </Text>
              </View>
            )}

            <TextInput
              value={name}
              onChangeText={setName}
              onFocus={() => setIsNameFocused(true)}
              onBlur={() => setIsNameFocused(false)}
              placeholder={isNameFocused || name ? '' : 'Full Name'}
              placeholderTextColor="#848484"
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                padding: 0,
              }}
            />
          </View>

          {/* Number */}
          <View
            style={{
              marginTop: hp(20),
              borderWidth: hp(1),
              borderColor: isNumberFocused ? '#7148E4' : '#D9D9D9',
              borderRadius: hp(10),
              height: hp(50),
              justifyContent: 'center',
              paddingHorizontal: wp(16),
            }}>
            {(isNumberFocused || number) && (
              <View
                style={{
                  position: 'absolute',
                  top: -10,
                  left: wp(16),
                  backgroundColor: colors.white,
                  paddingHorizontal: wp(6),
                }}>
                <Text
                  style={{
                    color: isNumberFocused ? '#7148E4' : 'gray',
                    fontSize: fontSize(12),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Mobile Number
                </Text>
              </View>
            )}

            <TextInput
              value={number}
              onChangeText={setNumber}
              onFocus={() => setIsNumberFocused(true)}
              onBlur={() => setIsNumberFocused(false)}
              placeholder={isNumberFocused || number ? '' : 'Mobile Number'}
              placeholderTextColor="#848484"
              keyboardType={'number-pad'}
              maxLength={10}
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                padding: 0,
              }}
            />
          </View>

          {/* Email */}
          <View
            style={{
              marginTop: hp(20),
              borderWidth: hp(1),
              borderColor: isEmailFocused ? '#7148E4' : '#D9D9D9',
              borderRadius: hp(10),
              height: hp(50),
              justifyContent: 'center',
              paddingHorizontal: wp(16),
            }}>
            {(isEmailFocused || email) && (
              <View
                style={{
                  position: 'absolute',
                  top: -10,
                  left: wp(16),
                  backgroundColor: colors.white,
                  paddingHorizontal: wp(6),
                }}>
                <Text
                  style={{
                    color: isEmailFocused ? '#7148E4' : 'gray',
                    fontSize: fontSize(12),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Email
                </Text>
              </View>
            )}

            {/*<TextInput*/}
            {/*  value={email}*/}
            {/*  onChangeText={setEmail}*/}
            {/*  onFocus={() => setIsEmailFocused(true)}*/}
            {/*  onBlur={() => setIsEmailFocused(false)}*/}
            {/*  placeholder={isEmailFocused || email ? '' : 'Email'}*/}
            {/*  placeholderTextColor="#848484"*/}
            {/*  style={{*/}
            {/*    color: colors.pureBlack,*/}
            {/*    fontSize: fontSize(14),*/}
            {/*    fontFamily: fontFamily.poppins400,*/}
            {/*    padding: 0,*/}
            {/*  }}*/}
            {/*/>*/}

            <TextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => {
                setIsEmailFocused(false);

                if (email && !isValidEmail(email.trim())) {
                  Toast.show({
                    type: 'error',
                    text1: 'Please enter a valid business email',
                  });
                }
              }}
              placeholder={isEmailFocused || email ? '' : 'Email'}
              placeholderTextColor="#848484"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                padding: 0,
              }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => refRoleSheet.current?.open()}
            style={{
              marginTop: hp(20),
              borderWidth: hp(1),
              borderColor: '#D9D9D9',
              borderRadius: hp(10),
              height: hp(50),
              justifyContent: 'center',
              paddingHorizontal: wp(16),
            }}>
            {selectedRole ? (
              <>
                <View
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: wp(16),
                    backgroundColor: colors.white,
                    paddingHorizontal: wp(6),
                  }}>
                  <Text
                    style={{
                      color: 'gray',
                      fontSize: fontSize(12),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Your Role
                  </Text>
                </View>

                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  {selectedRole}
                </Text>
              </>
            ) : (
              <Text
                style={{
                  color: '#848484',
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins400,
                }}>
                Your Role
              </Text>
            )}

            <Image
              source={icons.down_arrow_icon} // your dropdown icon
              style={{
                width: hp(10),
                height: hp(10),
                resizeMode: 'contain',
                position: 'absolute',
                right: wp(16),
                tintColor: '#5F6368',
              }}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins500,
              marginVertical: hp(17),
            }}>
            Verification
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => refDocumentTypeSheet.current?.open()}
            style={{
              borderWidth: hp(1),
              borderColor: '#D9D9D9',
              borderRadius: hp(10),
              height: hp(50),
              justifyContent: 'center',
              paddingHorizontal: wp(16),
            }}>
            {selectedDocumentType ? (
              <>
                <View
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: wp(16),
                    backgroundColor: colors.white,
                    paddingHorizontal: wp(6),
                  }}>
                  <Text
                    style={{
                      color: 'gray',
                      fontSize: fontSize(12),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Select Document Type
                  </Text>
                </View>

                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  {selectedDocumentType}
                </Text>
              </>
            ) : (
              <Text
                style={{
                  color: '#848484',
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins400,
                }}>
                Select Document Type
              </Text>
            )}

            <Image
              source={icons.down_arrow_icon}
              style={{
                width: hp(10),
                height: hp(10),
                resizeMode: 'contain',
                position: 'absolute',
                right: wp(16),
                tintColor: '#5F6368',
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePickDocument}
            style={{
              marginTop: hp(19),
              height: hp(50),
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: '#7148E4',
              borderRadius: hp(25),
              backgroundColor: '#FAF7FF',
              justifyContent: 'center',
              paddingHorizontal: wp(18),
            }}>
            {!documentFile ? (
              <Text
                style={{
                  color: '#7148E4',
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins500,
                  textAlign: 'center',
                }}>
                Select Document
              </Text>
            ) : (
              <>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  style={{
                    color: '#7148E4',
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins500,
                    marginRight: wp(35),
                  }}>
                  {documentFile?.name}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setDocumentFile(null)}
                  style={{
                    position: 'absolute',
                    right: wp(15),
                    width: hp(22),
                    height: hp(22),
                    borderRadius: hp(11),
                    backgroundColor: '#7148E4',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={icons.date_cancel_icon}
                    style={{
                      width: hp(8),
                      height: hp(8),
                      tintColor: '#FFF',
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>

          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(13),
              fontFamily: fontFamily.poppins400,
              marginTop: hp(20),
              textAlign: 'center',
            }}>
            By submitting, I confirm I own or am authorized to{'\n'}manage this
            business. <TouchableOpacity><Text style={{ color: '#7148E4' }}>Term & Policy</Text></TouchableOpacity>
          </Text>

          <TouchableOpacity
            activeOpacity={0.6}
            disabled={!isFormValid || loading}
            onPress={submitClaimRequest}
            style={{
              width: '100%',
              height: hp(50),
              backgroundColor: isFormValid ? '#7148E4' : '#C7B8F4',
              borderRadius: hp(50),
              marginTop: hp(23),
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isFormValid ? 1 : 0.6,
            }}>
            {loading ? (
              <ActivityIndicator color="#FFF" size={'large'} />
            ) : (
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins400,
                }}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(30) }} />
      </ScrollView>

      <RBSheet
        ref={refRoleSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={hp(480)}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.4)',
          },
          draggableIcon: {
            backgroundColor: '#D9D9D9',
          },
          container: {
            borderTopLeftRadius: hp(20),
            borderTopRightRadius: hp(20),
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(18),
            fontFamily: fontFamily.poppins600,
            color: colors.pureBlack,
            marginHorizontal: wp(20),
            marginTop: hp(10),
            marginBottom: hp(15),
          }}>
          Select Role
        </Text>

        <View
          style={{ width: '100%', height: hp(1), backgroundColor: '#DADADA' }}
        />

        {roles.map(role => (
          <TouchableOpacity
            key={role}
            activeOpacity={0.7}
            onPress={() => {
              setSelectedRole(role);
              refRoleSheet.current?.close();
            }}
            style={{
              height: hp(55),
              justifyContent: 'center',
              paddingHorizontal: wp(20),
              borderBottomWidth: hp(0.7),
              borderBottomColor: '#E9E9E9',
            }}>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(15),
                fontFamily: fontFamily.poppins400,
              }}>
              {role}
            </Text>
          </TouchableOpacity>
        ))}
      </RBSheet>

      <RBSheet
        ref={refDocumentTypeSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={hp(440)}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.4)',
          },
          draggableIcon: {
            backgroundColor: '#D9D9D9',
          },
          container: {
            borderTopLeftRadius: hp(20),
            borderTopRightRadius: hp(20),
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(16),
            fontFamily: fontFamily.poppins600,
            color: colors.pureBlack,
            marginHorizontal: wp(20),
            marginTop: hp(10),
            marginBottom: hp(15),
          }}>
          Select Document Type
        </Text>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#DADADA',
          }}
        />

        {documentTypes.map(item => (
          <TouchableOpacity
            key={item}
            activeOpacity={0.7}
            onPress={() => {
              setSelectedDocumentType(item);
              refDocumentTypeSheet.current?.close();
            }}
            style={{
              height: hp(55),
              justifyContent: 'center',
              paddingHorizontal: wp(20),
              borderBottomWidth: hp(0.7),
              borderBottomColor: '#E9E9E9',
            }}>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </RBSheet>

      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default VendorClaimYourBusinessScreen;
