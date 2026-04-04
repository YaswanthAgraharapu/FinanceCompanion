import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart } from 'react-native-chart-kit';
import useStore from '../store/useStore';
import SummaryCard from '../components/SummaryCard';
import EmptyState from '../components/EmptyState';
import { colors } from '../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

const PIE_COLORS = ['#6C63FF', '#FF6584', '#43D787', '#FFB84C', '#4ECDC4', '#FF5C5C'];

export default function HomeScreen() {
  const { loadData, isLoading, getTotalIncome, getTotalExpenses, getBalance, getCategoryBreakdown, transactions } = useStore();

  useEffect(() => { loadData(); }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your finances...</Text>
      </View>
    );
  }

  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const balance = getBalance();
  const breakdown = getCategoryBreakdown();

  const pieData = breakdown.slice(0, 6).map((item, i) => ({
    name: item.name,
    amount: item.amount,
    color: PIE_COLORS[i % PIE_COLORS.length],
    legendFontColor: colors.text,
    legendFontSize: 12,
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#6C63FF', '#9B59B6']} style={styles.header}>
        <Text style={styles.greeting}>👋 Welcome back, Yashu</Text>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>₹{balance.toLocaleString('en-IN')}</Text>
        <Text style={styles.balanceSub}>Updated just now</Text>
      </LinearGradient>

      {/* Summary Cards */}
      <View style={styles.section}>
        <View style={styles.row}>
          <SummaryCard title="Income" amount={income} icon="📈" color={colors.income} />
          <SummaryCard title="Expenses" amount={expenses} icon="📉" color={colors.expense} />
        </View>
      </View>

      {/* Spending Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Spending by Category</Text>
        {breakdown.length === 0 ? (
          <EmptyState icon="📊" title="No expenses yet" subtitle="Add transactions to see your spending breakdown" />
        ) : (
          <>
            <PieChart
              data={pieData}
              width={SCREEN_WIDTH - 48}
              height={180}
              chartConfig={{
                color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute={false}
            />
            {breakdown.slice(0, 5).map((item, i) => (
              <View key={item.name} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }]} />
                <Text style={styles.legendName}>{item.name}</Text>
                <Text style={styles.legendAmount}>₹{item.amount.toLocaleString('en-IN')}</Text>
              </View>
            ))}
          </>
        )}
      </View>

      {/* Recent Transactions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Transactions</Text>
        {transactions.length === 0 ? (
          <EmptyState icon="💸" title="No transactions yet" subtitle="Tap + to add your first transaction" />
        ) : (
          transactions.slice(0, 4).map(t => (
            <View key={t.id} style={styles.recentRow}>
              <Text style={styles.recentCategory}>{t.category}</Text>
              <Text style={[styles.recentAmount, { color: t.type === 'income' ? colors.income : colors.expense }]}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  loadingText: { marginTop: 12, color: colors.textMuted, fontSize: 14 },
  header: {
    paddingTop: 60, paddingBottom: 36, paddingHorizontal: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
  },
  greeting: { color: 'rgba(255,255,255,0.85)', fontSize: 15, marginBottom: 16 },
  balanceLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 13, letterSpacing: 1 },
  balanceAmount: { color: '#fff', fontSize: 38, fontWeight: '900', marginVertical: 4 },
  balanceSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  row: { flexDirection: 'row' },
  card: {
    backgroundColor: colors.card, borderRadius: 20, padding: 18,
    marginHorizontal: 16, marginTop: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 14 },
  legendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  legendName: { flex: 1, fontSize: 13, color: colors.text },
  legendAmount: { fontSize: 13, fontWeight: '700', color: colors.text },
  recentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  recentCategory: { fontSize: 14, color: colors.text, fontWeight: '600' },
  recentAmount: { fontSize: 14, fontWeight: '800' },
});