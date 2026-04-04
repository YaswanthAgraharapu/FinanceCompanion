import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Modal, TextInput, Alert
} from 'react-native';
import useStore from '../store/useStore';
import EmptyState from '../components/EmptyState';
import { colors } from '../theme/colors';

const EMOJIS = ['🎯', '💻', '🏠', '✈️', '🛡️', '🎓', '🚗', '💍', '📱', '💰'];

export default function GoalsScreen() {
  const { goals, addGoal, updateGoalSavings, deleteGoal } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [addSavingsModal, setAddSavingsModal] = useState(null);
  const [savingsInput, setSavingsInput] = useState('');
  const [form, setForm] = useState({ title: '', targetAmount: '', deadline: '', emoji: '🎯' });

  const handleAddGoal = () => {
    if (!form.title || !form.targetAmount || Number.isNaN(Number(form.targetAmount))) {
      Alert.alert('Missing Info', 'Please fill in title and a valid target amount.');
      return;
    }
    addGoal({ title: form.title, targetAmount: Number(form.targetAmount), deadline: form.deadline, emoji: form.emoji });
    setForm({ title: '', targetAmount: '', deadline: '', emoji: '🎯' });
    setModalVisible(false);
  };

  const handleAddSavings = () => {
    const amt = Number(savingsInput);
    if (!amt || amt <= 0) { Alert.alert('Invalid', 'Enter a valid amount'); return; }
    updateGoalSavings(addSavingsModal, amt);
    setSavingsInput('');
    setAddSavingsModal(null);
  };

  const renderGoal = ({ item }) => {
    const progress = Math.min((item.savedAmount / item.targetAmount) * 100, 100);
    const remaining = item.targetAmount - item.savedAmount;
    const isComplete = progress >= 100;

    return (
      <View style={[styles.goalCard, isComplete && styles.goalCardComplete]}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalEmoji}>{item.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.goalTitle}>{item.title}</Text>
            {item.deadline ? <Text style={styles.goalDeadline}>🗓 Target: {item.deadline}</Text> : null}
          </View>
          {isComplete && <Text style={styles.badge}>✅ Done!</Text>}
          <TouchableOpacity onPress={() => Alert.alert('Delete Goal', 'Remove this goal?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteGoal(item.id) }
          ])}>
            <Text style={{ fontSize: 18 }}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: isComplete ? colors.success : colors.primary }]} />
        </View>

        <View style={styles.goalStats}>
          <Text style={styles.goalSaved}>₹{item.savedAmount.toLocaleString('en-IN')} saved</Text>
          <Text style={styles.goalPct}>{Math.round(progress)}%</Text>
          <Text style={styles.goalRemaining}>₹{remaining.toLocaleString('en-IN')} left</Text>
        </View>

        {!isComplete && (
          <TouchableOpacity style={styles.addSavingsBtn} onPress={() => setAddSavingsModal(item.id)}>
            <Text style={styles.addSavingsBtnText}>+ Add Savings</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Goals 🎯</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderGoal}
        ListEmptyComponent={
          <EmptyState icon="🎯" title="No goals yet" subtitle="Set a savings goal and start tracking your progress" />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Add Goal Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>New Goal</Text>
            <TextInput style={styles.input} placeholder="Goal title (e.g. New Laptop)" placeholderTextColor={colors.textMuted} value={form.title} onChangeText={v => setForm({ ...form, title: v })} />
            <TextInput style={styles.input} placeholder="Target Amount (₹)" placeholderTextColor={colors.textMuted} keyboardType="numeric" value={form.targetAmount} onChangeText={v => setForm({ ...form, targetAmount: v })} />
            <TextInput style={styles.input} placeholder="Deadline (e.g. 2026-12-31)" placeholderTextColor={colors.textMuted} value={form.deadline} onChangeText={v => setForm({ ...form, deadline: v })} />
            <Text style={styles.emojiLabel}>Pick an Emoji</Text>
            <View style={styles.emojiRow}>
              {EMOJIS.map(e => (
                <TouchableOpacity
                  key={e}
                  onPress={() => setForm({ ...form, emoji: e })}
                  style={[styles.emojiBtn, form.emoji === e && styles.emojiBtnActive]}
                >
                  <Text style={{ fontSize: 22 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddGoal}>
                <Text style={styles.saveBtnText}>Save Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Savings Modal */}
      <Modal visible={!!addSavingsModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { padding: 24 }]}>
            <Text style={styles.modalTitle}>Add Savings</Text>
            <TextInput style={styles.input} placeholder="Amount (₹)" placeholderTextColor={colors.textMuted} keyboardType="numeric" value={savingsInput} onChangeText={setSavingsInput} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddSavingsModal(null)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddSavings}>
                <Text style={styles.saveBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
  },
  heading: { fontSize: 26, fontWeight: '900', color: colors.text },
  addBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  goalCard: {
    backgroundColor: colors.card, borderRadius: 20, padding: 18, marginBottom: 14,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8,
  },
  goalCardComplete: { borderWidth: 2, borderColor: colors.success },
  goalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  goalEmoji: { fontSize: 28, marginRight: 12 },
  goalTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  goalDeadline: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  badge: { fontSize: 12, fontWeight: '700', color: colors.success, marginRight: 10 },
  progressBg: { height: 10, backgroundColor: colors.border, borderRadius: 10, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: 10, borderRadius: 10 },
  goalStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  goalSaved: { fontSize: 12, color: colors.primary, fontWeight: '700' },
  goalPct: { fontSize: 12, fontWeight: '800', color: colors.text },
  goalRemaining: { fontSize: 12, color: colors.textMuted },
  addSavingsBtn: { backgroundColor: colors.primaryLight, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  addSavingsBtnText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: colors.text, marginBottom: 18 },
  input: {
    backgroundColor: colors.bg, borderRadius: 14, padding: 14,
    fontSize: 15, color: colors.text, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  emojiLabel: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 8 },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  emojiBtn: {
    padding: 8, borderRadius: 12, backgroundColor: colors.bg,
    borderWidth: 1.5, borderColor: colors.border,
    marginRight: 8, marginBottom: 8,
  },
  emojiBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  modalActions: { flexDirection: 'row' },
  cancelBtn: { flex: 1, padding: 16, borderRadius: 14, backgroundColor: colors.bg, alignItems: 'center', marginRight: 8 },
  cancelText: { fontWeight: '700', color: colors.textMuted },
  saveBtn: { flex: 1, padding: 16, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center' },
  saveBtnText: { fontWeight: '700', color: '#fff' },
});