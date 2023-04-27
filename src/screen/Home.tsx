import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { platformsMeta } from '../constants/platforms';
import { COLOR, FONTSIZE, height, width } from '../theme';
import { useHome } from './Home.hooks';

dayjs.extend(relativeTime);

interface HomeProps {
  appKey: string;
  userUUID: string;
}

const Home = ({ appKey, userUUID }: HomeProps) => {
  const {
    isLoadingConnectPlatform,
    isLoadingUserApps,
    isLoadingConnections,
    connections,
    state,
    handleConnect,
    handleDisconnect,
  } = useHome({ appKey, userUUID });

  if (isLoadingConnections || isLoadingUserApps || isLoadingConnectPlatform) {
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
          data={connections ? (Object.keys(connections) as Provider[]) : []}
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
          renderItem={({ item: platformName }) => {
            const isConnectionMissing = !connections?.[platformName];
            const isLoggedIn = Boolean(connections?.[platformName]?.logged_in);

            return (
              <View style={styles.card}>
                <View style={styles.cardLogo}>
                  <Image
                    style={styles.image}
                    source={platformsMeta[platformName].logo}
                  />
                </View>

                <View style={styles.cardText}>
                  <Text style={styles.cardTittle}>
                    {platformsMeta[platformName].name}
                  </Text>

                  <Text style={styles.cardStatus}>
                    {connections?.[platformName]?.logged_in
                      ? dayjs(connections[platformName]?.last_sync).fromNow()
                      : 'Logged Out'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={
                    isLoggedIn
                      ? () => handleDisconnect({ platformName })
                      : () => handleConnect({ platformName })
                  }
                >
                  <Text style={styles.buttonText}>
                    {isConnectionMissing
                      ? 'Connect'
                      : isLoggedIn
                      ? 'Disconnect'
                      : 'Reconnect'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
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
