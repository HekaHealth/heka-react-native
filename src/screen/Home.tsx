import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useContext } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connectPlatformAPI } from '../api/connect';
import { useFitbit } from '../hooks/fitbit';
import { COLOR, FONTSIZE, height, width } from '../theme';
import { AppContext } from '../utils/AppContext';
import { useGoogleFit } from '../hooks/googleFit';

dayjs.extend(relativeTime);

const modalData: Record<Provider, { name: string; logo: ImageSourcePropType }> =
  {
    fitbit: {
      name: 'Fitbit',
      logo: require('../images/fitbit.jpg'),
    },
    strava: {
      name: 'Strava',
      logo: require('../images/strava.png'),
    },
    google_fit: {
      name: 'Google Fit',
      logo: require('../images/google_fit.png'),
    },
    apple_healthkit: {
      name: 'Apple Health',
      logo: require('../images/apple_healthkit.png'),
    },
  };

const Home: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);

  const { signIn: signInFitbit } = useFitbit();
  const { signIn: signInGoogleFit } = useGoogleFit();

  const platformAuthorizeMap: Record<Provider, ProviderSignIn> = {
    fitbit: signInFitbit,
    strava: signInFitbit,
    google_fit: signInGoogleFit,
    apple_healthkit: signInFitbit,
  };

  const handleConnection = async ({
    platformName,
  }: {
    platformName: Provider;
  }) => {
    try {
      const platform = state.enabled_platforms?.find(
        (platform) => platform.platform_name === platformName
      );

      if (!platform) {
        dispatch({
          type: 'FETCH_ERROR',
          payload: { error: 'Invalid platform' },
        });
        return;
      }

      const authorize = platformAuthorizeMap[platform.platform_name];
      const { result, error } = await authorize(platform);

      if (!result || error) {
        console.log({ result, error });
        dispatch({
          type: 'FETCH_ERROR',
          payload: {
            error: error || 'Failed to sign in, please verify your credentials',
          },
        });
        return;
      }

      await connectPlatformAPI({
        email: 'abdulmateen075@gmail.com',
        userUUID: 'abdulmateen075@gmail.com',
        platformName,
        refresh_token: result.refreshToken,
      });
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        dispatch({
          type: 'FETCH_ERROR',
          payload: { error: error.response?.data?.error },
        });
        return;
      }

      dispatch({ type: 'FETCH_ERROR', payload: null });
    }
  };

  if (state.loading) {
    return (
      <ActivityIndicator
        size="large"
        color={COLOR.blue}
        style={{ marginTop: height / 2 - height / 14 }}
      />
    );
  }

  return (
    <View style={styles.homeContainer}>
      <View>
        <FlatList
          data={
            state?.connections
              ? (Object.keys(state.connections) as Provider[])
              : []
          }
          contentContainerStyle={styles.cardContainer}
          keyExtractor={(item) => item}
          ListFooterComponent={() => {
            return (
              <View style={styles.footer}>
                {state.error ? <Text>{state.error}</Text> : null}

                <Text style={styles.footerText}>
                  Powered by <Text style={styles.footerTittle}>Heka</Text>
                </Text>
              </View>
            );
          }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardLogo}>
                <Image style={styles.image} source={modalData[item].logo} />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTittle}>{modalData[item].name}</Text>
                <Text style={styles.cardStatus}>
                  {state?.connections?.[item]?.logged_in
                    ? dayjs(state.connections[item]?.last_sync).fromNow()
                    : 'Logged Out'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleConnection({ platformName: item })}
                style={styles.cardButton}
              >
                <Text style={styles.buttonText}>
                  {!state?.connections?.[item]
                    ? 'Connect'
                    : state.connections[item].logged_in
                    ? 'Disconnect'
                    : 'Reconnect'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: COLOR.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: width - 20,
    alignSelf: 'center',
    backgroundColor: COLOR.white,
    elevation: 3,
    borderRadius: 10,
    padding: 10,
    marginVertical: height / 15,
  },
  card: {
    width: '100%',
    flexDirection: 'row',
    height: height / 14,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  cardLogo: {
    width: '10%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  cardText: {
    width: '40%',
    height: '70%',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  cardTittle: {
    color: COLOR.black,
    fontSize: FONTSIZE.mid,
    marginBottom: 5,
  },
  cardStatus: {
    color: COLOR.gray,
    fontSize: FONTSIZE.extraSmall,
  },
  cardButton: {
    minWidth: '30%',
    height: '70%',
    backgroundColor: COLOR.tintOrange,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: COLOR.white,
    fontSize: FONTSIZE.mid,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    margin: 5,
  },
  footerText: {
    textAlign: 'right',
    color: COLOR.gray,
    fontSize: FONTSIZE.small,
  },
  footerTittle: {
    color: COLOR.blue,
    fontSize: FONTSIZE.mid,
  },
});

export default Home;
