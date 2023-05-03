import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR, FONTSIZE } from '../theme';

interface HekaFooterProps {
  error?: string;
}

export const HekaFooter = ({ error }: HekaFooterProps) => {
  return (
    <View style={styles.footer}>
      {error ? <Text>{error}</Text> : null}

      <Text style={styles.footerText}>
        Powered by <Text style={styles.footerTitle}>Heka</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
  footerTitle: {
    color: COLOR.blue,
    fontSize: FONTSIZE.mid,
  },
});
