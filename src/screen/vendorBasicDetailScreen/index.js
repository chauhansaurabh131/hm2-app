import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {addressDetails, updateDetails} from '../../actions/homeActions';
import {changeStack} from '../../actions/authActions';

const EnumOfServicesProvided = {
  photo_studio: {
    WEDDING_PHOTOGRAPHY: 'wedding-photography',
    PRE_WEDDING_PHOTOGRAPHY: 'pre-wedding-photography',
    ENGAGEMENT_PHOTOGRAPHY: 'engagement-photography',
    MATERNITY_PHOTOGRAPHY: 'maternity-photography',
    NEWBORN_OR_BABY_PHOTOGRAPHY: 'newborn-or-baby-photography',
    KIDS_PHOTOGRAPHY: 'kids-photography',
    FAMILY_PORTRAIT_PHOTOGRAPHY: 'family-portrait-photography',
    COUPLE_PHOTOGRAPHY: 'couple-photography',
    FASHION_PHOTOGRAPHY: 'fashion-photography',
    MODEL_PORTFOLIO_PHOTOGRAPHY: 'model-portfolio-photography',
    CORPORATE_BUSINESS_PHOTOGRAPHY: 'corporate-business-photography',
    PRODUCT_PHOTOGRAPHY: 'product-photography',
    FOOD_PHOTOGRAPHY: 'food-photography',
    REAL_ESTATE_PROPERTY_PHOTOGRAPHY: 'real-estate-property-photography',
    EVENT_PHOTOGRAPHY_BIRTHDAY_PARTY_CORPORATE_EVENT:
      'event-photography-birthday-party-corporate-event',
    PASSPORT_SIZE_PHOTO: 'passport-size-photo',
    ID_VISA_PHOTO: 'id-visa-photo',
    WEDDING_VIDEOGRAPHY: 'wedding-videography',
    PRE_WEDDING_CINEMATIC_VIDEO: 'pre-wedding-cinematic-video',
    EVENT_VIDEOGRAPHY: 'event-videography',
    CORPORATE_VIDEO_SHOOT: 'corporate-video-shoot',
    MUSIC_VIDEO_SHOOT: 'music-video-shoot',
    YOUTUBE_SOCIAL_MEDIA_VIDEO_SHOOT: 'youtube-social-media-video-shoot',
    DRONE_VIDEOGRAPHY: 'drone-videography',
    PHOTO_EDITING_RETOUCHING: 'photo-editing-retouching',
    BACKGROUND_REMOVAL_CHANGE: 'background-removal-change',
    PHOTO_RESTORATION_OLD_PHOTOS_REPAIR: 'photo-restoration-old-photos-repair',
    ALBUM_DESIGN: 'album-design',
    WEDDING_ALBUM_DESIGN: 'wedding-album-design',
    PHOTO_COLOR_CORRECTION: 'photo-color-correction',
    PHOTO_PRINTING: 'photo-printing',
    CANVAS_PRINTING: 'canvas-printing',
    PHOTO_FRAMES: 'photo-frames',
    PHOTO_ALBUMS: 'photo-albums',
    MUG_TSHIRT_PHOTO_PRINTING: 'mug-tshirt-photo-printing',
    PHOTO_LAMINATION: 'photo-lamination',
    STUDIO_RENTAL_FOR_PHOTOSHOOT: 'studio-rental-for-photoshoot',
    MAKEUP_ARTIST_FOR_PHOTOSHOOT: 'makeup-artist-for-photoshoot',
    PROPS_COSTUME_RENTAL: 'props-costume-rental',
    GREEN_SCREEN_PHOTOGRAPHY: 'green-screen-photography',
  },

  catering: {
    WEDDING_CONSULTATION: 'wedding-consultation',
    BUDGET_PLANNING: 'budget-planning',
    VENUE_SELECTION: 'venue-selection',
    THEME_CONCEPT_DESIGN: 'theme-concept-design',
    VENDOR_SELECTION_MANAGEMENT: 'vendor-selection-management',
    WEDDING_TIMELINE_PLANNING: 'wedding-timeline-planning',
    GUEST_LIST_MANAGEMENT: 'guest-list-management',
    INVITATION_RSVP_MANAGEMENT: 'invitation-rsvp-management',
    CATERING_ARRANGEMENT: 'catering-arrangement',
    PHOTOGRAPHY_VIDEOGRAPHY: 'photography-videography',
    DECORATION_FLORAL_DESIGN: 'decoration-floral-design',
    ENTERTAINMENT_DJ_BAND_PERFORMERS: 'entertainment-dj-band-performers',
    MAKEUP_STYLING_ARTISTS: 'makeup-styling-artists',
    WEDDING_CAKE_ARRANGEMENT: 'wedding-cake-arrangement',
    LIGHTING_SOUND_SETUP: 'lighting-sound-setup',
    TRANSPORTATION_GUEST_LOGISTICS: 'transportation-guest-logistics',
    CEREMONY_PLANNING: 'ceremony-planning',
    RECEPTION_PLANNING: 'reception-planning',
    STAGE_MANDAP_SETUP: 'stage-mandap-setup',
    WEDDING_DAY_COORDINATION: 'wedding-day-coordination',
    GUEST_HOSPITALITY_MANAGEMENT: 'guest-hospitality-management',
    SECURITY_CROWD_MANAGEMENT: 'security-crowd-management',
    DESTINATION_WEDDING_PLANNING: 'destination-wedding-planning',
    CULTURAL_TRADITIONAL_CEREMONY_PLANNING:
      'cultural-traditional-ceremony-planning',
    PRE_WEDDING_EVENTS: 'pre-wedding-events',
    HONEYMOON_PLANNING: 'honeymoon-planning',
    BRIDAL_GROOM_STYLING: 'bridal-groom-styling',
    WEDDING_WEBSITE_DIGITAL_INVITATION: 'wedding-website-digital-invitation',
    GIFT_MANAGEMENT: 'gift-management',
    THANK_YOU_CARD_ARRANGEMENTS: 'thank-you-card-arrangements',
    ALBUM_VIDEO_DELIVERY: 'album-video-delivery',
    VENDOR_PAYMENT_COORDINATION: 'vendor-payment-coordination',
  },

  wedding_planner: {
    WEDDING_CONSULTATION: 'wedding-consultation',
    BUDGET_PLANNING: 'budget-planning',
    VENUE_SELECTION: 'venue-selection',
    THEME_CONCEPT_DESIGN: 'theme-concept-design',
    VENDOR_SELECTION_MANAGEMENT: 'vendor-selection-management',
    WEDDING_TIMELINE_PLANNING: 'wedding-timeline-planning',
    GUEST_LIST_MANAGEMENT: 'guest-list-management',
    INVITATION_RSVP_MANAGEMENT: 'invitation-rsvp-management',
    CATERING_ARRANGEMENT: 'catering-arrangement',
    PHOTOGRAPHY_VIDEOGRAPHY: 'photography-videography',
    DECORATION_FLORAL_DESIGN: 'decoration-floral-design',
    ENTERTAINMENT_DJ_BAND_PERFORMERS: 'entertainment-dj-band-performers',
    MAKEUP_STYLING_ARTISTS: 'makeup-styling-artists',
    WEDDING_CAKE_ARRANGEMENT: 'wedding-cake-arrangement',
    LIGHTING_SOUND_SETUP: 'lighting-sound-setup',
    TRANSPORTATION_GUEST_LOGISTICS: 'transportation-guest-logistics',
    CEREMONY_PLANNING: 'ceremony-planning',
    RECEPTION_PLANNING: 'reception-planning',
    STAGE_MANDAP_SETUP: 'stage-mandap-setup',
    WEDDING_DAY_COORDINATION: 'wedding-day-coordination',
    GUEST_HOSPITALITY_MANAGEMENT: 'guest-hospitality-management',
    SECURITY_CROWD_MANAGEMENT: 'security-crowd-management',
    DESTINATION_WEDDING_PLANNING: 'destination-wedding-planning',
    CULTURAL_TRADITIONAL_CEREMONY_PLANNING:
      'cultural-traditional-ceremony-planning',
    PRE_WEDDING_EVENTS: 'pre-wedding-events',
    HONEYMOON_PLANNING: 'honeymoon-planning',
    BRIDAL_GROOM_STYLING: 'bridal-groom-styling',
    WEDDING_WEBSITE_DIGITAL_INVITATION: 'wedding-website-digital-invitation',
    GIFT_MANAGEMENT: 'gift-management',
    THANK_YOU_CARD_ARRANGEMENTS: 'thank-you-card-arrangements',
    ALBUM_VIDEO_DELIVERY: 'album-video-delivery',
    VENDOR_PAYMENT_COORDINATION: 'vendor-payment-coordination',
  },

  event_decoration: {
    WEDDING_DECORATION: 'wedding-decoration',
    ENGAGEMENT_DECORATION: 'engagement-decoration',
    RECEPTION_DECORATION: 'reception-decoration',
    BIRTHDAY_PARTY_DECORATION: 'birthday-party-decoration',
    ANNIVERSARY_DECORATION: 'anniversary-decoration',
    BABY_SHOWER_DECORATION: 'baby-shower-decoration',
    MEHNDI_HALDI_DECORATION: 'mehndi-haldi-decoration',
    SANGEET_DECORATION: 'sangeet-decoration',
    RING_CEREMONY_DECORATION: 'ring-ceremony-decoration',
    PROPOSAL_DECORATION: 'proposal-decoration',
    CORPORATE_EVENT_DECORATION: 'corporate-event-decoration',
    STAGE_DECORATION: 'stage-decoration',
    EXHIBITION_STALL_DECORATION: 'exhibition-stall-decoration',
    CONFERENCE_DECORATION: 'conference-decoration',
    PRODUCT_LAUNCH_DECORATION: 'product-launch-decoration',
    THEME_PARTY_DECORATION: 'theme-party-decoration',
    FLORAL_DECORATION: 'floral-decoration',
    BALLOON_DECORATION: 'balloon-decoration',
    LIGHT_DECORATION: 'light-decoration',
    MANDAP_DECORATION: 'mandap-decoration',
    ENTRANCE_GATE_DECORATION: 'entrance-gate-decoration',
    TABLE_CHAIR_DECORATION: 'table-chair-decoration',
    CEILING_DECORATION: 'ceiling-decoration',
    BACKDROP_DECORATION: 'backdrop-decoration',
    GARDEN_OUTDOOR_DECORATION: 'garden-outdoor-decoration',
    DESTINATION_WEDDING_DECORATION: 'destination-wedding-decoration',
    CAR_DECORATION: 'car-decoration',
    HOUSE_DECORATION_FOR_EVENTS: 'house-decoration-for-events',
    FESTIVAL_DECORATION: 'festival-decoration',
    CUSTOMIZED_THEME_DECORATION: 'customized-theme-decoration',
  },

  jewellery_shop: {
    GOLD_JEWELLERY: 'gold-jewellery',
    DIAMOND_JEWELLERY: 'diamond-jewellery',
    SILVER_JEWELLERY: 'silver-jewellery',
    PLATINUM_JEWELLERY: 'platinum-jewellery',
    BRIDAL_JEWELLERY: 'bridal-jewellery',
    ANTIQUE_JEWELLERY: 'antique-jewellery',
    TEMPLE_JEWELLERY: 'temple-jewellery',
    CUSTOM_JEWELLERY: 'custom-jewellery',
    KIDS_JEWELLERY: 'kids-jewellery',
    CUSTOM_JEWELLERY_DESIGN: 'custom-jewellery-design',
    PERSONALIZED_NAME_JEWELLERY: 'personalized-name-jewellery',
    BRIDAL_JEWELLERY_DESIGN: 'bridal-jewellery-design',
    JEWELLERY_REMODELING_REDESIGN: 'jewellery-remodeling-redesign',
    JEWELLERY_REPAIR: 'jewellery-repair',
    RING_RESIZING: 'ring-resizing',
    STONE_REPLACEMENT: 'stone-replacement',
    JEWELLERY_POLISHING: 'jewellery-polishing',
    JEWELLERY_CLEANING: 'jewellery-cleaning',
    DIAMOND_CERTIFICATION: 'diamond-certification',
    JEWELLERY_VALUATION_APPRAISAL: 'jewellery-valuation-appraisal',
    HALLMARK_GOLD_JEWELLERY: 'hallmark-gold-jewellery',
    GOLD_EXCHANGE: 'gold-exchange',
    OLD_GOLD_PURCHASE: 'old-gold-purchase',
    GOLD_COINS_BARS: 'gold-coins-bars',
    JEWELLERY_BUYBACK: 'jewellery-buyback',
    BRIDAL_JEWELLERY_RENTAL: 'bridal-jewellery-rental',
    JEWELLERY_ENGRAVING: 'jewellery-engraving',
    JEWELLERY_INSURANCE_ASSISTANCE: 'jewellery-insurance-assistance',
    JEWELLERY_GIFT_PACKAGING: 'jewellery-gift-packaging',
  },

  beauty_salon: {
    BRIDAL_HD_MAKEUP: 'bridal-hd-makeup',
    AIRBRUSH_BRIDAL_MAKEUP: 'airbrush-bridal-makeup',
    TRADITIONAL_BRIDAL_MAKEUP: 'traditional-bridal-makeup',
    RECEPTION_MAKEUP: 'reception-makeup',
    ENGAGEMENT_MAKEUP: 'engagement-makeup',
    PARTY_MAKEUP_SANGEET_MEHENDI: 'party-makeup-sangeet-mehendi',
    BRIDAL_HAIR_STYLING: 'bridal-hair-styling',
    BRIDAL_BUN: 'bridal-bun',
    CURLS_BRAIDS_WAVES: 'curls-braids-waves',
    HAIR_EXTENSIONS: 'hair-extensions',
    HAIR_ACCESSORIES_SETTING: 'hair-accessories-setting',
    PRE_BRIDAL_SKIN_CARE_TREATMENT: 'pre-bridal-skin-care-treatment',
    FACIAL_SKIN_GLOW_TREATMENT: 'facial-skin-glow-treatment',
    BODY_POLISHING: 'body-polishing',
    DETAN_BLEACH: 'detan-bleach',
    FULL_BODY_WAXING: 'full-body-waxing',
    THREADING_EYEBROW_SHAPING: 'threading-eyebrow-shaping',
    HAIR_SPA: 'hair-spa',
    KERATIN_TREATMENT: 'keratin-treatment',
    DEEP_CONDITIONING_TREATMENT: 'deep-conditioning-treatment',
    HAIR_COLOR_HIGHLIGHTS: 'hair-color-highlights',
    BRIDAL_MANICURE: 'bridal-manicure',
    BRIDAL_PEDICURE: 'bridal-pedicure',
    NAIL_ART: 'nail-art',
    BODY_MASSAGE: 'body-massage',
    BODY_WRAP: 'body-wrap',
    AROMATHERAPY_TREATMENT: 'aromatherapy-treatment',
    RELAXATION_SPA: 'relaxation-spa',
    BRIDAL_MAKEUP_TRIAL: 'bridal-makeup-trial',
    BRIDAL_HAIR_TRIAL: 'bridal-hair-trial',
    SKIN_HAIR_CONSULTATION: 'skin-hair-consultation',
    GROOM_MAKEUP_PACKAGE: 'groom-makeup-package',
    BRIDESMAID_MAKEUP: 'bridesmaid-makeup',
    GUEST_MAKEUP_HAIRSTYLING: 'guest-makeup-hairstyling',
  },

  meeting_venue: {
    CAFES_COFFEE_SHOPS: 'cafes-coffee-shops',
    RESTAURANTS: 'restaurants',
    PARKS_GARDENS: 'parks-gardens',
    MALLS_SHOPPING_CENTERS: 'malls-shopping-centers',
    LOUNGES_BARS: 'lounges-bars',
    BEACH_SPOTS: 'beach-spots',
    CULTURAL_CENTERS: 'cultural-centers',
    CO_WORKING_SPACES: 'co-working-spaces',
    EVENT_VENUES: 'event-venues',
    PRIVATE_MEETING_ROOMS: 'private-meeting-rooms',
    HOTEL_LOBBIES: 'hotel-lobbies',
    ROOFTOP_CAFES: 'rooftop-cafes',
    BOOK_CAFES: 'book-cafes',
    ART_GALLERIES: 'art-galleries',
    ENTERTAINMENT_ZONES: 'entertainment-zones',
    CINEMA_MOVIE_THEATRES: 'cinema-movie-theatres',
    COMMUNITY_CENTERS: 'community-centers',
    TOURIST_ATTRACTIONS: 'tourist-attractions',
    PICNIC_SPOTS: 'picnic-spots',
    SPIRITUAL_PREMISES: 'spiritual-premises',
    FIRST_DATE_SPOTS: 'first-date-spots',
    SAFE_PUBLIC_MEETING_SPOTS: 'safe-public-meeting-spots',
    GROUP_MEETUP_PLACES: 'group-meetup-places',
    ROMANTIC_DATE_LOCATIONS: 'romantic-date-locations',
    ACTIVITY_BASED_MEETING_POINTS: 'activity-based-meeting-points',
  },

  makeup_artist: {
    BRIDAL_MAKEUP: 'bridal-makeup',
    PRE_WEDDING_MAKEUP: 'pre-wedding-makeup',
    DESTINATION_WEDDING_MAKEUP: 'destination-wedding-makeup',
    PARTY_MAKEUP: 'party-makeup',
    EVENING_MAKEUP: 'evening-makeup',
    BIRTHDAY_MAKEUP: 'birthday-makeup',
    FESTIVAL_MAKEUP: 'festival-makeup',
    SPECIAL_OCCASION_MAKEUP: 'special-occasion-makeup',
    FASHION_MAKEUP: 'fashion-makeup',
    PHOTOSHOOT_MAKEUP: 'photoshoot-makeup',
    PORTFOLIO_MAKEUP: 'portfolio-makeup',
    MODEL_MAKEUP: 'model-makeup',
    TV_FILM_MAKEUP: 'tv-film-makeup',
    HD_BRIDAL_MAKEUP: 'hd-bridal-makeup',
    AIRBRUSH_MAKEUP: 'airbrush-makeup',
    CELEBRITY_STYLE_MAKEUP: 'celebrity-style-makeup',
    HAIRSTYLING: 'hairstyling',
    HAIR_SETTING_FOR_EVENTS: 'hair-setting-for-events',
    SAREE_DRAPING: 'saree-draping',
    EYELASH_EXTENSIONS: 'eyelash-extensions',
    EYEBROW_SHAPING_THREADING: 'eyebrow-shaping-threading',
    PRE_BRIDAL_SKINCARE: 'pre-bridal-skincare',
    FACIAL_CLEANUP: 'facial-cleanup',
    SKIN_POLISHING: 'skin-polishing',
    BRIDAL_BEAUTY_PACKAGES: 'bridal-beauty-packages',
  },

  fitness_center: {
    PERSONAL_TRAINING: 'personal-training',
    GROUP_FITNESS_CLASSES: 'group-fitness-classes',
    YOGA_CLASSES: 'yoga-classes',
    ZUMBA_CLASSES: 'zumba-classes',
    AEROBICS_CLASSES: 'aerobics-classes',
    CROSSFIT_TRAINING: 'crossfit-training',
    STRENGTH_TRAINING: 'strength-training',
    WEIGHT_LOSS_PROGRAMS: 'weight-loss-programs',
    WEIGHT_GAIN_PROGRAMS: 'weight-gain-programs',
    BODYBUILDING_TRAINING: 'bodybuilding-training',
    CARDIO_TRAINING: 'cardio-training',
    FUNCTIONAL_TRAINING: 'functional-training',
    PILATES_CLASSES: 'pilates-classes',
    MEDITATION_SESSIONS: 'meditation-sessions',
    NUTRITION_DIET_CONSULTATION: 'nutrition-diet-consultation',
    FITNESS_ASSESSMENT: 'fitness-assessment',
    BODY_COMPOSITION_ANALYSIS: 'body-composition-analysis',
    PHYSIOTHERAPY: 'physiotherapy',
    SPORTS_CONDITIONING: 'sports-conditioning',
    SENIOR_FITNESS_PROGRAMS: 'senior-fitness-programs',
    KIDS_FITNESS_PROGRAMS: 'kids-fitness-programs',
    ONLINE_FITNESS_COACHING: 'online-fitness-coaching',
    CORPORATE_FITNESS_PROGRAMS: 'corporate-fitness-programs',
  },

  yoga_center: {
    HATHA_YOGA: 'hatha-yoga',
    ASHTANGA_YOGA: 'ashtanga-yoga',
    VINYASA_FLOW_YOGA: 'vinyasa-flow-yoga',
    POWER_YOGA: 'power-yoga',
    IYENGAR_YOGA: 'iyengar-yoga',
    KUNDALINI_YOGA: 'kundalini-yoga',
    YIN_YOGA: 'yin-yoga',
    RESTORATIVE_YOGA: 'restorative-yoga',
    THERAPEUTIC_YOGA: 'therapeutic-yoga',
    YOGA_FOR_BACK_PAIN: 'yoga-for-back-pain',
    YOGA_FOR_WEIGHT_LOSS: 'yoga-for-weight-loss',
    YOGA_FOR_DIABETES: 'yoga-for-diabetes',
    YOGA_FOR_STRESS_RELIEF: 'yoga-for-stress-relief',
    YOGA_FOR_ANXIETY_DEPRESSION: 'yoga-for-anxiety-depression',
    PRENATAL_YOGA: 'prenatal-yoga',
    POSTNATAL_YOGA: 'postnatal-yoga',
    YOGA_FOR_SENIORS: 'yoga-for-seniors',
    GUIDED_MEDITATION: 'guided-meditation',
    MINDFULNESS_MEDITATION: 'mindfulness-meditation',
    PRANAYAMA: 'pranayama',
    SOUND_HEALING_MEDITATION: 'sound-healing-meditation',
    YOGA_NIDRA: 'yoga-nidra',
    CORPORATE_YOGA_PROGRAMS: 'corporate-yoga-programs',
    KIDS_YOGA_CLASSES: 'kids-yoga-classes',
    COUPLE_YOGA_SESSIONS: 'couple-yoga-sessions',
    PERSONAL_YOGA_TRAINING: 'personal-yoga-training',
    ONLINE_YOGA_CLASSES: 'online-yoga-classes',
    YOGA_WORKSHOPS: 'yoga-workshops',
    YOGA_RETREATS: 'yoga-retreats',
    DETOX_PROGRAMS: 'detox-programs',
    AYURVEDA_CONSULTATION: 'ayurveda-consultation',
    DIET_NUTRITION_GUIDANCE: 'diet-nutrition-guidance',
    HOLISTIC_WELLNESS_PROGRAMS: 'holistic-wellness-programs',
    SPIRITUAL_COUNSELING: 'spiritual-counseling',
  },
};

const VendorBasicDetailScreen = () => {
  const {user} = useSelector(state => state.auth);

  console.log(' === var------- ===> ', user?.user);

  const apiDispatch = useDispatch();
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const refRBSheet = useRef();
  const refRBSheetBusinessType = useRef();
  const refServicesSheet = useRef();

  const [addressLine, setAddressLine] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country] = useState('India');

  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [savedAddress, setSavedAddress] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const availableServices = businessType
    ? Object.values(EnumOfServicesProvided[businessType] || {})
    : [];
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if (user?.user?.name) {
      setBusinessName(user.user.name);
    }
  }, [user]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const ServiceType = {
    PHOTO_STUDIO: 'photo_studio',
    CATERING: 'catering',
    WEDDING_PLANNER: 'wedding_planner',
    EVENT_DECORATION: 'event_decoration',
    JEWELLERY_SHOP: 'jewellery_shop',
    BEAUTY_SALON: 'beauty_salon',
    MEETING_VENUE: 'meeting_venue',
    MAKEUP_ARTIST: 'makeup_artist',
    FITNESS_CENTER: 'fitness_center',
    YOGA_CENTER: 'yoga_center',
  };

  const serviceTypes = Object.values(ServiceType);

  const formatBusinessType = value => {
    if (!value) {
      return '';
    }

    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  };

  const isFormValid =
    businessName.trim() !== '' &&
    savedAddress.trim() !== '' &&
    businessType.trim() !== '' &&
    selectedServices.length > 0;

  const isAddressValid =
    addressLine.trim() !== '' &&
    area.trim() !== '' &&
    city.trim() !== '' &&
    stateName.trim() !== '';

  // const onGoToProfilePress = () => {
  //   const payload = {
  //     vendorData: [
  //       {
  //         businessName: businessName,
  //         businessType: businessType,
  //         servicesProvided: selectedServices,
  //       },
  //     ],
  //   };
  //   apiDispatch(updateDetails(payload));
  //
  //   apiDispatch(
  //     addressDetails(
  //       {
  //         currentResidenceAddress: addressLine,
  //         area,
  //         currentCity: city,
  //         currentState: stateName,
  //         currentCountry: country.toLowerCase(),
  //       },
  //       () => {
  //         console.log('Success');
  //       },
  //     ),
  //   );
  // };

  const onGoToProfilePress = () => {
    setButtonLoading(true);

    const payload = {
      vendorData: [
        {
          businessName,
          businessType,
          servicesProvided: selectedServices,
        },
      ],
      userProfileCompleted: true,
    };

    apiDispatch(
      updateDetails(
        payload,
        () => {
          // First API Success
          apiDispatch(
            addressDetails(
              {
                currentResidenceAddress: addressLine,
                area,
                currentCity: city.toLowerCase(),
                currentState: stateName.toLowerCase(),
                currentCountry: country.toLowerCase(),
              },
              () => {
                // Second API Success
                setButtonLoading(false);

                console.log('Both APIs completed successfully');

                dispatch(changeStack());
              },
              error => {
                // Second API Failed
                setButtonLoading(false);

                console.log('addressDetails failed', error);
              },
            ),
          );
        },
        error => {
          // First API Failed
          setButtonLoading(false);

          console.log('updateDetails failed', error);
        },
      ),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
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
            left: wp(15),
            height: '100%',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{height: hp(16), width: hp(16)}}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins600,
          }}>
          Basic Details
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <Image
          source={images.vendor_Basic_Banner_Img}
          style={{
            width: '100%',
            height: hp(107),
          }}
          resizeMode="stretch" // ⭐ IMPORTANT
        />

        <View style={{marginHorizontal: wp(17), marginTop: hp(19)}}>
          <Text
            style={{
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
              color: '#757575',
            }}>
            Enter Your Business Name
          </Text>

          <TextInput
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Enter Business Name"
            placeholderTextColor="#999"
            style={{
              width: '100%',
              height: hp(50),
              borderWidth: hp(1),
              borderColor: '#D8D8D8',
              borderRadius: hp(10),
              paddingHorizontal: wp(20),
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins400,
              color: colors.pureBlack,
              marginTop: hp(15),
            }}
          />

          <TouchableOpacity
            onPress={() => refRBSheet.current.open()}
            activeOpacity={0.6}
            style={{
              marginTop: hp(22),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: hp(35),
            }}>
            <Text
              style={{
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                color: '#848484',
              }}>
              Business Address
            </Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins700,
                  color: colors.pureBlack,
                  marginRight: wp(20),
                }}>
                {savedAddress ? 'Edit' : 'Add'}
              </Text>
              <Image
                source={icons.right_Arrow_Color_Icon}
                style={{
                  width: hp(6),
                  height: hp(10),
                  resizeMode: 'contain',
                  tintColor: '#5F6368',
                  top: -1,
                }}
              />
            </View>
          </TouchableOpacity>

          {savedAddress ? (
            <Text
              style={{
                // marginTop: hp(8),
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                // lineHeight: hp(22),
              }}>
              {savedAddress}
            </Text>
          ) : null}
        </View>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(20),
          }}
        />

        {/*BUSINESS TYPE */}
        <View style={{marginHorizontal: wp(17)}}>
          <TouchableOpacity
            onPress={() => refRBSheetBusinessType.current.open()}
            activeOpacity={0.6}
            style={{
              marginTop: hp(22),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: hp(35),
            }}>
            <Text
              style={{
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                color: '#848484',
              }}>
              Business Type
            </Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins700,
                  color: colors.pureBlack,
                  marginRight: wp(20),
                }}>
                {businessType
                  ? businessType
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, letter => letter.toUpperCase())
                  : 'Add'}
              </Text>

              <Image
                source={icons.right_Arrow_Color_Icon}
                style={{
                  width: hp(6),
                  height: hp(10),
                  resizeMode: 'contain',
                  tintColor: '#5F6368',
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(20),
          }}
        />

        <View style={{marginHorizontal: wp(17)}}>
          <TouchableOpacity
            disabled={!businessType}
            onPress={() => refServicesSheet.current.open()}
            activeOpacity={0.6}
            style={{
              marginTop: hp(22),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: hp(35),
            }}>
            <Text
              style={{
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                color: '#848484',
              }}>
              What services do you provide?
            </Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins700,
                  color: colors.pureBlack,
                  marginRight: wp(20),
                }}>
                {selectedServices.length > 0
                  ? `${selectedServices.length} Selected`
                  : 'Add'}
              </Text>
              <Image
                source={icons.right_Arrow_Color_Icon}
                style={{
                  width: hp(6),
                  height: hp(10),
                  resizeMode: 'contain',
                  tintColor: '#5F6368',
                  top: -1,
                }}
              />
            </View>
          </TouchableOpacity>

          {selectedServices.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: hp(10),
              }}>
              {selectedServices.map(item => (
                <View
                  key={item}
                  style={{
                    backgroundColor: '#F3F0FF',
                    paddingHorizontal: wp(12),
                    paddingVertical: hp(6),
                    borderRadius: hp(20),
                    marginRight: wp(8),
                    marginBottom: hp(8),
                  }}>
                  <Text
                    style={{
                      color: '#7148E4',
                      fontSize: fontSize(12),
                    }}>
                    {item
                      .replace(/-/g, ' ')
                      .replace(/\b\w/g, c => c.toUpperCase())}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{height: hp(100)}} />
      </ScrollView>

      {/*GO TO PROFILE BUTTON*/}
      {!isKeyboardVisible && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: hp(80),
            backgroundColor: 'rgba(255,255,255,0.95)',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            disabled={!isFormValid}
            onPress={onGoToProfilePress}
            style={{
              height: hp(44),
              borderRadius: hp(50),
              backgroundColor: isFormValid ? '#7148E4' : '#C8B8F7',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: wp(17),
              opacity: isFormValid ? 1 : 0.7,
            }}>
            {buttonLoading ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins400,
                }}>
                Go to My Profile
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/*BUSINESS ADDRESS BOTTOM SHEET*/}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown
        closeOnPressMask
        height={hp(500)}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: '#D9D9D9',
          },
          container: {
            borderTopLeftRadius: hp(25),
            borderTopRightRadius: hp(25),
            paddingHorizontal: wp(20),
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(18),
            fontFamily: fontFamily.poppins600,
            color: colors.pureBlack,
            marginTop: hp(10),
          }}>
          Add Business Location
        </Text>

        <View
          style={{
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(15),
            marginBottom: hp(20),
          }}
        />

        {/* Address Line */}
        <TextInput
          value={addressLine}
          onChangeText={setAddressLine}
          placeholder="Address Line"
          placeholderTextColor="#999"
          style={{
            height: hp(46),
            borderWidth: hp(1),
            borderColor: '#DBDBDB',
            borderRadius: hp(10),
            paddingHorizontal: wp(15),
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
          }}
        />

        {/* Area */}
        <TextInput
          value={area}
          onChangeText={setArea}
          placeholder="Area"
          placeholderTextColor="#999"
          style={[
            {
              height: hp(46),
              borderWidth: hp(1),
              borderColor: '#DBDBDB',
              borderRadius: hp(10),
              paddingHorizontal: wp(15),
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            },
            {marginTop: hp(15)},
          ]}
        />

        {/* City */}
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="City"
          placeholderTextColor="#999"
          style={[
            {
              height: hp(46),
              borderWidth: hp(1),
              borderColor: '#D8D8D8',
              borderRadius: hp(10),
              paddingHorizontal: wp(15),
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            },
            {marginTop: hp(15)},
          ]}
        />

        {/* State */}
        <TextInput
          value={stateName}
          onChangeText={setStateName}
          placeholder="State"
          placeholderTextColor="#999"
          style={[
            {
              height: hp(46),
              borderWidth: hp(1),
              borderColor: '#D8D8D8',
              borderRadius: hp(10),
              paddingHorizontal: wp(15),
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            },
            {marginTop: hp(15)},
          ]}
        />

        {/* Country */}
        <TextInput
          value={country}
          editable={false}
          selectTextOnFocus={false}
          placeholder="Country"
          placeholderTextColor="#BDBDBD"
          style={{
            height: hp(46),
            borderWidth: hp(1),
            borderColor: '#E0E0E0',
            borderRadius: hp(10),
            paddingHorizontal: wp(15),
            backgroundColor: '#F5F5F5',
            color: '#9E9E9E',
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
            marginTop: hp(15),
          }}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!isAddressValid}
          onPress={() => {
            const fullAddress =
              `${addressLine}, ${area}, ${city}, ${stateName}, ${country}`
                .replace(/,\s*,/g, ',')
                .trim();

            setSavedAddress(fullAddress);
            refRBSheet.current.close();
          }}
          style={{
            height: hp(48),
            borderRadius: hp(50),
            marginTop: hp(25),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isAddressValid ? '#7148E4' : '#C8B8F7',
            opacity: isAddressValid ? 1 : 0.7,
          }}>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize(15),
              fontFamily: fontFamily.poppins600,
            }}>
            Add
          </Text>
        </TouchableOpacity>
      </RBSheet>

      {/*BUSINESS TYPE BOTTOM SHEET*/}
      <RBSheet
        ref={refRBSheetBusinessType}
        closeOnDragDown
        closeOnPressMask
        height={hp(480)}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: '#D9D9D9',
          },
          container: {
            borderTopLeftRadius: hp(25),
            borderTopRightRadius: hp(25),
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(18),
            fontFamily: fontFamily.poppins600,
            color: colors.pureBlack,
            marginTop: hp(10),
            marginHorizontal: wp(20),
          }}>
          Select Business Type
        </Text>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(10),
          }}
        />

        <FlatList
          data={serviceTypes}
          keyExtractor={item => item}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            const isSelected = businessType === item;

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setBusinessType(item);
                  setSelectedServices([]); // reset old services
                  refRBSheetBusinessType.current.close();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: wp(20),
                  height: hp(55),
                  borderBottomWidth: hp(0.8),
                  borderBottomColor: '#E9E9E9',
                }}>
                <Text
                  style={{
                    fontSize: fontSize(15),
                    color: colors.pureBlack,
                    fontFamily: fontFamily.poppins400,
                  }}>
                  {formatBusinessType(item)}
                </Text>

                {isSelected && (
                  <Image
                    source={icons.new_Circle_Check_Icon}
                    style={{
                      width: hp(22),
                      height: hp(22),
                      resizeMode: 'contain',
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </RBSheet>

      <RBSheet
        ref={refServicesSheet}
        closeOnDragDown
        closeOnPressMask
        height={hp(500)}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: '#D9D9D9',
          },
          container: {
            borderTopLeftRadius: hp(25),
            borderTopRightRadius: hp(25),
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(18),
            fontFamily: fontFamily.poppins600,
            color: colors.pureBlack,
            marginTop: hp(10),
            marginHorizontal: wp(20),
          }}>
          Select Services
        </Text>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(10),
          }}
        />

        <FlatList
          data={availableServices}
          keyExtractor={item => item}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            const isSelected = selectedServices.includes(item);

            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (isSelected) {
                    setSelectedServices(prev => prev.filter(x => x !== item));
                  } else {
                    setSelectedServices(prev => [...prev, item]);
                  }
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: wp(20),
                  height: hp(55),
                  borderBottomWidth: hp(0.8),
                  borderBottomColor: '#E9E9E9',
                }}>
                <Text
                  style={{
                    fontSize: fontSize(15),
                    color: colors.pureBlack,
                    fontFamily: fontFamily.poppins400,
                    flex: 1,
                    marginRight: wp(10),
                  }}>
                  {item
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase())}
                </Text>

                {isSelected && (
                  <Image
                    source={icons.new_Circle_Check_Icon}
                    style={{
                      width: hp(22),
                      height: hp(22),
                      resizeMode: 'contain',
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </RBSheet>
    </SafeAreaView>
  );
};

export default VendorBasicDetailScreen;
