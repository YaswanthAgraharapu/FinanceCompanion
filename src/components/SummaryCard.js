import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from '../theme/colors';

export default function SummaryCard({ title, amount, icon, color }) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.amount, { color }]}>₹{amount.toLocaleString('en-IN')}</Text>
    </View>
  );
}

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: { fontSize: 22, marginBottom: 8 },
  title: { fontSize: 11, color: colors.textMuted, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  amount: { fontSize: 16, fontWeight: '800' },
});