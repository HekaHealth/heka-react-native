import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useContext } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { authorize } from 'react-native-app-auth';
import { connectPlatformAPI } from '../api/connect';
import { OAuthConfig } from '../constants';
import { COLOR, FONTSIZE, height, width } from '../theme';
import { AppContext } from '../utils/AppContext';
import { getRedirectUrl } from '../utils/Authorize';

dayjs.extend(relativeTime);

const modalData: any = {
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

  const handleConnection = async ({
    platformName,
  }: {
    platformName: string;
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

      const clientId =
        platform.platform_app_id ||
        '414785237708-abirasrhk7fb10fpoijkh33g5ek50pbi.apps.googleusercontent.com';
      if (!clientId) {
        dispatch({
          type: 'FETCH_ERROR',
          payload: { error: 'ClientID is not present' },
        });
        return;
      }

      const redirectUrl = getRedirectUrl(clientId);
      const result = await authorize({
        issuer: OAuthConfig.issuer,
        clientId,
        redirectUrl,
        scopes: platform.enabled_scopes || OAuthConfig.scopes,
      });
      console.log({ result });

      const connectResult = await connectPlatformAPI({
        email: 'abdulmateen075@gmail.com',
        userUUID: 'abdulmateen075@gmail.com',
        platformName,
        refresh_token: result.refreshToken,
      });

      console.log({ connectResult });
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
          data={state?.connections && Object.keys(state.connections)}
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
