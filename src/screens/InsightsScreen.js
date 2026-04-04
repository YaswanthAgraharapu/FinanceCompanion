import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Dimensions
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import useStore from '../store/useStore';
import EmptyState from '../components/EmptyState';
import { colors } from '../theme/colors';
import { startOfWeek, endOfWeek, isWithinInterval, subWeeks } from 'date-fns';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PIE_COLORS = ['#6C63FF', '#FF6584', '#43D787', '#FFB84C', '#4ECDC4', '#FF5C5C'];

export default function InsightsScreen() {
  const { transactions, getTotalIncome, getTotalExpenses } = useStore();

  const expenses = transactions.filter(t => t.type === 'expense');
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  let savingsMessage;
  if (savingsRate >= 20) {
    savingsMessage = '🎉 Great job! You\'re saving well.';
  } else if (savingsRate >= 10) {
    savingsMessage = '👍 Decent savings. Can you do better?';
  } else {
    savingsMessage = '⚠️ Try to cut expenses to save more.';
  }

  // Category breakdown
  const categoryMap = {};
  expenses.forEach(t => { categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount; });
  const categoryBreakdown = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const topCategory = categoryBreakdown[0];

  // This week vs last week
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

  const thisWeekExp = expenses
    .filter(t => isWithinInterval(new Date(t.date), { start: thisWeekStart, end: thisWeekEnd }))
    .reduce((s, t) => s + t.amount, 0);
  const lastWeekExp = expenses
    .filter(t => isWithinInterval(new Date(t.date), { start: lastWeekStart, end: lastWeekEnd }))
    .reduce((s, t) => s + t.amount, 0);

  const weekDiff = lastWeekExp > 0 ? Math.round(((thisWeekExp - lastWeekExp) / lastWeekExp) * 100) : 0;

  // Bar chart — top 5 categories
  const barLabels = categoryBreakdown.slice(0, 5).map(([name]) => name.slice(0, 5));
  const barData = categoryBreakdown.slice(0, 5).map(([, amt]) => amt);

  if (transactions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Insights 📊</Text>
        <EmptyState icon="🔍" title="No data yet" subtitle="Add transactions to unlock spending insights" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Insights 📊</Text>

      {/* Savings Rate Card */}
      <View style={[styles.card, { backgroundColor: colors.primary }]}>
        <Text style={styles.whiteLabel}>Savings Rate</Text>
        <Text style={styles.bigWhiteNum}>{savingsRate}%</Text>
        <Text style={styles.whiteSubtitle}>
          {savingsMessage}
        </Text>
      </View>

      {/* This Week vs Last Week */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Week vs Last Week</Text>
        <View style={styles.weekRow}>
          <View style={styles.weekBox}>
            <Text style={styles.weekLabel}>This Week</Text>
            <Text style={[styles.weekAmt, { color: colors.expense }]}>₹{thisWeekExp.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.weekDivider} />
          <View style={styles.weekBox}>
            <Text style={styles.weekLabel}>Last Week</Text>
            <Text style={[styles.weekAmt, { color: colors.textMuted }]}>₹{lastWeekExp.toLocaleString('en-IN')}</Text>
          </View>
        </View>
        {lastWeekExp > 0 && (
          <View style={[styles.diffBadge, { backgroundColor: weekDiff > 0 ? '#FFF0F0' : '#E8FFF3' }]}>
            <Text style={[styles.diffText, { color: weekDiff > 0 ? colors.expense : colors.income }]}>
              {weekDiff > 0 ? `▲ ${weekDiff}% more` : `▼ ${Math.abs(weekDiff)}% less`} than last week
            </Text>
          </View>
        )}
      </View>

      {/* Top Spending Category */}
      {topCategory && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Spending Category</Text>
          <View style={styles.topCatRow}>
            <Text style={styles.topCatName}>🏆 {topCategory[0]}</Text>
            <Text style={[styles.topCatAmt, { color: colors.expense }]}>₹{topCategory[1].toLocaleString('en-IN')}</Text>
          </View>
          <Text style={styles.topCatSub}>
            {Math.round((topCategory[1] / totalExpenses) * 100)}% of your total spending
          </Text>
        </View>
      )}

      {/* Bar Chart */}
      {barData.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending by Category</Text>
          <BarChart
            data={{
              labels: barLabels,
              datasets: [{ data: barData.length > 0 ? barData : [0] }],
            }}
            width={SCREEN_WIDTH - 64}
            height={200}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
              labelColor: () => colors.textMuted,
              barPercentage: 0.6,
            }}
            style={{ borderRadius: 12 }}
            showValuesOnTopOfBars
            withInnerLines={false}
            fromZero
          />
        </View>
      )}

      {/* Category List */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Full Breakdown</Text>
        {categoryBreakdown.map(([name, amt], i) => {
          const pct = Math.round((amt / totalExpenses) * 100);
          return (
            <View key={name} style={styles.breakdownRow}>
              <View style={[styles.dot, { backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }]} />
              <Text style={styles.breakdownName}>{name}</Text>
              <View style={styles.breakdownBarBg}>
                <View style={[styles.breakdownBarFill, { width: `${pct}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }]} />
              </View>
              <Text style={styles.breakdownPct}>{pct}%</Text>
            </View>
          );
        })}
      </View>

      {/* Income vs Expense Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Income vs Expenses</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={[styles.summaryAmt, { color: colors.income }]}>₹{totalIncome.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={[styles.summaryAmt, { color: colors.expense }]}>₹{totalExpenses.toLocaleString('en-IN')}</Text>
          </View>
        </View>
        <View style={styles.balanceBox}>
          <Text style={styles.summaryLabel}>Net Balance</Text>
          <Text style={[styles.summaryAmt, { color: totalIncome - totalExpenses >= 0 ? colors.income : colors.expense }]}>
            ₹{(totalIncome - totalExpenses).toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16 },
  heading: { fontSize: 26, fontWeight: '900', color: colors.text, paddingTop: 60, paddingBottom: 16 },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 18, marginBottom: 14, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.text, marginBottom: 14 },
  whiteLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  bigWhiteNum: { color: '#fff', fontSize: 48, fontWeight: '900', marginBottom: 4 },
  whiteSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  weekRow: { flexDirection: 'row', alignItems: 'center' },
  weekBox: { flex: 1, alignItems: 'center' },
  weekLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 6 },
  weekAmt: { fontSize: 20, fontWeight: '800' },
  weekDivider: { width: 1, height: 40, backgroundColor: colors.border },
  diffBadge: { marginTop: 12, borderRadius: 10, padding: 10, alignItems: 'center' },
  diffText: { fontSize: 13, fontWeight: '700' },
  topCatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  topCatName: { fontSize: 18, fontWeight: '800', color: colors.text },
  topCatAmt: { fontSize: 18, fontWeight: '800' },
  topCatSub: { fontSize: 13, color: colors.textMuted },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  breakdownName: { width: 90, fontSize: 13, color: colors.text, fontWeight: '600' },
  breakdownBarBg: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginHorizontal: 8 },
  breakdownBarFill: { height: 8, borderRadius: 4 },
  breakdownPct: { fontSize: 12, fontWeight: '700', color: colors.textMuted, width: 36, textAlign: 'right' },
  summaryRow: { flexDirection: 'row', marginBottom: 12 },
  summaryBox: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  summaryAmt: { fontSize: 18, fontWeight: '800' },
  balanceBox: { alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
});