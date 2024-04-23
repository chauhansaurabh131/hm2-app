import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  Modal,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const DemoPractiveCodeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);

  const openModal = () => {
    setModalVisible(true);
    setStep(1); // Reset step to 1 when modal opens
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text onPress={openModal}>Demo</Text>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        {/*<TouchableWithoutFeedback onPress={closeModal}>*/}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              width: wp(340),
              height: hp(550),
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'red',
                alignItems: 'center',
                marginTop: hp(25),
                marginHorizontal: 20,
              }}>
              <Text
                style={{
                  fontSize: fontSize(20),
                  lineHeight: hp(30),
                  fontFamily: fontFamily.poppins500,
                  color: colors.black,
                }}>
                Your Match :
                <Text
                  style={{
                    color: colors.blue,
                    fontSize: fontSize(20),
                    lineHeight: hp(30),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  {' '}
                  85%
                </Text>
              </Text>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 0,
                  height: 24,
                  width: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={closeModal}>
                <Image
                  source={icons.x_cancel_icon}
                  style={{width: 13, height: 13}}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: hp(26),
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <Image
                source={images.profileDisplayImage}
                style={{
                  width: hp(64),
                  height: 64,
                  borderRadius: 50,
                  marginRight: -15,
                  zIndex: 1,
                }}
              />
              <Image
                source={images.demo_Five_Image}
                style={{
                  width: hp(64),
                  height: 64,
                  borderRadius: 50,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: hp(15),
                alignItems: 'center',
              }}>
              <Image
                source={icons.couple_icon}
                style={{
                  width: hp(16),
                  height: hp(14),
                  resizeMode: 'contain',
                  tintColor: '#8225AF',
                  marginRight: wp(10),
                }}
              />
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(12),
                  lineHeight: hp(18),
                  fontFamily: fontFamily.poppins400,
                }}>
                You & Rohan Matched
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                borderWidth: 0.5,
                borderColor: 'black',
                marginTop: 17,
              }}
            />

            <Text
              style={{
                color: colors.blue,
                fontSize: fontSize(12),
                lineHeight: hp(18),
                fontFamily: fontFamily.poppins500,
                textAlign: 'center',
                marginTop: hp(17),
              }}>
              Based on Your Partner Preference
            </Text>

            <View style={{marginHorizontal: 20, marginTop: hp(13)}}>
              {step === 1 && (
                <>
                  <Text
                    style={{
                      fontSize: fontSize(12),
                      lineHeight: hp(18),
                      fontFamily: fontFamily.poppins400,
                      color: colors.black,
                    }}>
                    Religion
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins700,
                        color: colors.black,
                      }}>
                      Hindu
                    </Text>
                    <Image
                      source={icons.confirm_check_icon}
                      style={{
                        width: hp(18),
                        height: hp(18),
                        resizeMode: 'contain',
                        tintColor: colors.blue,
                      }}
                    />
                  </View>

                  <View style={{marginTop: hp(14)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      Height
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                        }}>
                        4.5 to 5.3ft
                      </Text>
                      <Image
                        source={icons.confirm_check_icon}
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                          tintColor: colors.blue,
                        }}
                      />
                    </View>
                  </View>

                  <View style={{marginTop: hp(14)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      Age
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                        }}>
                        27 - 34
                      </Text>
                      <Image
                        source={icons.confirm_check_icon}
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                          tintColor: colors.blue,
                        }}
                      />
                    </View>
                  </View>

                  <View style={{marginTop: hp(14)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      Weight
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                        }}>
                        52 to 68 kg
                      </Text>
                      <Image
                        source={icons.confirm_check_icon}
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                          tintColor: colors.blue,
                        }}
                      />
                    </View>
                  </View>
                </>
              )}

              {step === 2 && (
                <>
                  <Text
                    style={{
                      fontSize: fontSize(12),
                      lineHeight: hp(18),
                      fontFamily: fontFamily.poppins400,
                      color: colors.black,
                    }}>
                    Caste
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins700,
                        color: colors.black,
                      }}>
                      Patel
                    </Text>
                    <Image
                      source={icons.confirm_check_icon}
                      style={{
                        width: hp(18),
                        height: hp(18),
                        resizeMode: 'contain',
                        tintColor: colors.blue,
                      }}
                    />
                  </View>

                  <View style={{marginTop: hp(14)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      Sub Caste
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                        }}>
                        Kadava Patidar, Leva Patidar
                      </Text>
                      <Image
                        source={icons.confirm_check_icon}
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                          tintColor: colors.blue,
                        }}
                      />
                    </View>
                  </View>

                  <View style={{marginTop: hp(14)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      Prefer City
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                        }}>
                        Delhi, Mumbai, New Your
                      </Text>
                      <Image
                        source={icons.confirm_check_icon}
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                          tintColor: colors.blue,
                        }}
                      />
                    </View>
                  </View>

                  <View style={{marginTop: hp(14)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      Prefer Country
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                        }}>
                        India, USA, UK
                      </Text>
                      <Image
                        source={icons.confirm_check_icon}
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                          tintColor: colors.blue,
                        }}
                      />
                    </View>
                  </View>
                </>
              )}

              {step === 3 && (
                <>
                  <Text
                    style={{
                      fontSize: fontSize(12),
                      lineHeight: hp(18),
                      fontFamily: fontFamily.poppins400,
                      color: colors.black,
                    }}>
                    Degree
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins700,
                        color: colors.black,
                      }}>
                      BCA, Bsc, MBA
                    </Text>
                    <Image
                      source={icons.confirm_check_icon}
                      style={{
                        width: hp(18),
                        height: hp(18),
                        resizeMode: 'contain',
                        tintColor: colors.blue,
                      }}
                    />
                  </View>

                  <View style={{marginTop: hp(14)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      Profession
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                        }}>
                        Software, Medical Officer
                      </Text>
                      <Image
                        source={icons.confirm_check_icon}
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                          tintColor: colors.blue,
                        }}
                      />
                    </View>
                  </View>

                  <View style={{marginTop: hp(14)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      Annual Income
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                        }}>
                        10 to 35 lac
                      </Text>
                      <Image
                        source={icons.confirm_check_icon}
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                          tintColor: colors.blue,
                        }}
                      />
                    </View>
                  </View>

                  <View style={{marginTop: hp(14)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      Job Type
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                        }}>
                        Government, Private
                      </Text>
                      <Image
                        source={icons.confirm_check_icon}
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                          tintColor: colors.blue,
                        }}
                      />
                    </View>
                  </View>
                </>
              )}

              {step === 4 && (
                <>
                  <Text
                    style={{
                      fontSize: fontSize(12),
                      lineHeight: hp(18),
                      fontFamily: fontFamily.poppins400,
                      color: colors.black,
                    }}>
                    Prefer Diet
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins700,
                        color: colors.black,
                      }}>
                      Vegetarian, All
                    </Text>
                    <Image
                      source={icons.confirm_check_icon}
                      style={{
                        width: hp(18),
                        height: hp(18),
                        resizeMode: 'contain',
                        tintColor: colors.blue,
                      }}
                    />
                  </View>

                  <View style={{marginTop: hp(14)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      Creative
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                        }}>
                        Writing, Painting, Reading
                      </Text>
                      <Image
                        source={icons.confirm_check_icon}
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                          tintColor: colors.blue,
                        }}
                      />
                    </View>
                  </View>

                  <View style={{marginTop: hp(14)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      Fun
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                        }}>
                        Watching Movie, Traveling
                      </Text>
                      <Image
                        source={icons.confirm_check_icon}
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                          tintColor: colors.blue,
                        }}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                position: 'absolute',
                bottom: 30,
                flex: 1,
                alignSelf: 'center',
                width: '90%',
              }}>
              <TouchableOpacity
                onPress={handleBack}
                disabled={step === 1}
                style={{
                  width: wp(30),
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.rightSideIcon}
                  style={{
                    width: 13.24,
                    height: 24,
                    resizeMode: 'contain',
                    transform: [{rotate: '180deg'}],
                    tintColor: step === 1 ? '#E4E4E4' : 'black',
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {[1, 2, 3, 4].map(item => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setStep(item)}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 50,
                      backgroundColor: step === item ? '#0F52BA' : '#ECECEC',
                      marginHorizontal: 10,
                    }}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleNext}
                disabled={step === 4}
                style={{
                  width: wp(30),
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.rightSideIcon}
                  style={{
                    width: 13.24,
                    height: 24,
                    resizeMode: 'contain',
                    tintColor: step === 4 ? '#E4E4E4' : 'black',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/*</TouchableWithoutFeedback>*/}
      </Modal>
    </SafeAreaView>
  );
};

export default DemoPractiveCodeScreen;
