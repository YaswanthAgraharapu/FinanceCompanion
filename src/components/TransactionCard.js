import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import PropTypes from 'prop-types';

const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️', Entertainment: '🎬',
  Health: '💊', Bills: '📄', Salary: '💼', Freelance: '💰',
  Investment: '📈', Other: '📦',
};

export default function TransactionCard({ transaction, onEdit }) {
  const deleteTransaction = useStore(s => s.deleteTransaction);
  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    Alert.alert('Delete Transaction', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(transaction.id) },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: isIncome ? '#E8FFF3' : '#FFF0F0' }]}>
        <Text style={styles.iconText}>{CATEGORY_ICONS[transaction.category] || '📦'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.category}>{transaction.category}</Text>
        <Text style={styles.notes} numberOfLines={1}>{transaction.notes || 'No notes'}</Text>
        <Text style={styles.date}>{format(new Date(transaction.date), 'dd MMM yyyy')}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
          {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
            <Text style={styles.actionText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
            <Text style={styles.actionText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: 16, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  iconBox: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconText: { fontSize: 22 },
  info: { flex: 1 },
  category: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  notes: { fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  date: { fontSize: 11, color: colors.textMuted },
  right: { alignItems: 'flex-end' },
  amount: { fontSize: 15, fontWeight: '800', marginBottom: 6 },
  actions: { flexDirection: 'row' },
  actionBtn: { marginLeft: 8 },
  actionText: { fontSize: 16 },
});

TransactionCard.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    notes: PropTypes.string,
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};