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
import { DateUtil } from '../utils/Date';
import { HekaFooter } from './HekaFooter';
import { useHekaHealthButtons } from './HekaHealthButtons.hooks';

interface HekaHealthButtonsProps {
  appKey: string;
  userUUID: string;
}

export const HekaHealthButtons = ({
  appKey,
  userUUID,
}: HekaHealthButtonsProps) => {
  const { platforms, state, handleConnect, handleDisconnect } =
    useHekaHealthButtons({ appKey, userUUID });

  if (state.isLoading) {
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
          data={platforms}
          contentContainerStyle={styles.cardContainer}
          keyExtractor={(item) => item}
          ListFooterComponent={<HekaFooter error={state.error} />}
          renderItem={({ item: platformName }) => {
            const isConnectionMissing = !state.connections?.[platformName];
            const isLoggedIn = Boolean(
              state.connections?.[platformName]?.logged_in
            );

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

                  {state.connections && state.connections[platformName] && (
                    <Text style={styles.cardStatus}>
                      {!state.connections[platformName].logged_in
                        ? 'Logged Out'
                        : state.connections[platformName].last_sync
                        ? `Last Synced: ${DateUtil.formatDate(
                            new Date(
                              state.connections[platformName]?.last_sync || ''
                            )
                          )}`
                        : ''}
                    </Text>
                  )}
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
});
