import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import useStore from '../store/useStore';
import { colors } from '../theme/colors';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Salary', 'Freelance', 'Investment', 'Other'];
const CATEGORY_ICONS = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️', Entertainment: '🎬',
  Health: '💊', Bills: '📄', Salary: '💼', Freelance: '💰',
  Investment: '📈', Other: '📦',
};

export default function AddTransactionScreen({ navigation, route }) {
  const { addTransaction, updateTransaction } = useStore();
  const editData = route?.params?.transaction;

  const [type, setType] = useState(editData?.type || 'expense');
  const [amount, setAmount] = useState(editData?.amount?.toString() || '');
  const [category, setCategory] = useState(editData?.category || 'Food');
  const [notes, setNotes] = useState(editData?.notes || '');

  const handleSave = () => {
    if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    const data = { type, amount: Number(amount), category, notes };
    if (editData) {
      updateTransaction(editData.id, data);
    } else {
      addTransaction(data);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>{editData ? 'Edit Transaction' : 'New Transaction'}</Text>

        {/* Type Toggle */}
        <View style={styles.typeRow}>
          {['expense', 'income'].map((t, i) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeBtn,
                i === 0 && { marginRight: 12 },
                type === t && { backgroundColor: t === 'income' ? colors.income : colors.expense }
              ]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeBtnText, type === t && { color: '#fff' }]}>
                {t === 'income' ? '📈 Income' : '📉 Expense'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount */}
        <View style={styles.fieldBox}>
          <Text style={styles.label}>Amount (₹)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Category */}
        <View style={styles.fieldBox}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.catGrid}>
            {CATEGORIES.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.catBtn, category === c && styles.catBtnActive]}
                onPress={() => setCategory(c)}
              >
                <Text style={styles.catIcon}>{CATEGORY_ICONS[c]}</Text>
                <Text style={[styles.catText, category === c && { color: colors.primary, fontWeight: '700' }]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.fieldBox}>
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="What was this for?"
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{editData ? 'Update Transaction' : 'Add Transaction'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

AddTransactionScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 20, paddingTop: 60 },
  heading: { fontSize: 26, fontWeight: '900', color: colors.text, marginBottom: 24 },
  typeRow: { flexDirection: 'row', marginBottom: 24 },
  typeBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: colors.card, alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border,
  },
  typeBtnText: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
  fieldBox: { marginBottom: 22 },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.card, borderRadius: 14, padding: 16,
    fontSize: 16, color: colors.text, borderWidth: 1, borderColor: colors.border,
  },
  notesInput: { height: 90, textAlignVertical: 'top' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  catBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: colors.card, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.border,
    marginBottom: 8, marginRight: 8,
  },
  catBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  catIcon: { fontSize: 16, marginRight: 6 },
  catText: { fontSize: 13, color: colors.text },
  saveBtn: {
    backgroundColor: colors.primary, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center', marginTop: 8,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});