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
import { COLOR, FONTSIZE, height, width } from '../theme';
import { AppContext } from '../utils/AppContext';
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
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
  const { state } = useContext(AppContext);

  return (
    <View style={styles.homeContainer}>
      {state.loading ? (
        <ActivityIndicator
          size="large"
          color={COLOR.blue}
          style={{ marginTop: height / 2 - height / 14 }}
        />
      ) : (
        <View>
          {/* {JSON.stringify(state.connections[Object.keys(state.connections)[1]])} */}
          <FlatList
            data={state.connections && Object.keys(state.connections)}
            contentContainerStyle={styles.cardContainer}
            keyExtractor={(item) => item}
            ListFooterComponent={() => {
              return (
                <View style={styles.footer}>
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
                    {state?.connections?.[item].logged_in
                      ? dayjs(state.connections[item].last_sync).fromNow()
                      : 'Logged Out'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.cardButton}>
                  <Text style={styles.buttonText}>
                    {state?.connections?.[item].connected_device_uuids.length
                      ? 'Connect'
                      : state.connections?.[item].logged_in
                      ? 'Disconnect'
                      : 'Connect again'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
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
    alignSelf: 'flex-end',
    margin: 5,
  },
  footerText: {
    color: COLOR.gray,
    fontSize: FONTSIZE.small,
  },
  footerTittle: {
    color: COLOR.blue,
    fontSize: FONTSIZE.mid,
  },
});

export default Home;
