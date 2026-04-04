import React, { useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import useStore from '../store/useStore';
import TransactionCard from '../components/TransactionCard';
import EmptyState from '../components/EmptyState';
import { colors } from '../theme/colors';

const FILTERS = ['All', 'Income', 'Expense'];

export default function TransactionsScreen({ navigation }) {
  const { transactions, isLoading } = useStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = transactions.filter(t => {
    const matchesType = activeFilter === 'All' || t.type === activeFilter.toLowerCase();
    const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.notes || '').toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Transactions</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by category or notes..."
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {/* Filter Pills */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={item}
            onEdit={() => navigation.navigate('AddTransaction', { transaction: item })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="💸"
            title="No transactions found"
            subtitle={search ? 'Try a different search term' : 'Tap + Add to record your first transaction'}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

TransactionsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
  },
  heading: { fontSize: 26, fontWeight: '900', color: colors.text },
  addBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 14, marginHorizontal: 16,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14,
    borderWidth: 1, borderColor: colors.border,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  filterBtn: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border,
    marginRight: 8,
  },
  filterBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  filterTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
});