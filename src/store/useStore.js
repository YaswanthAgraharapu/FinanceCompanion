import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'finance_data';

const generateId = () => Math.random().toString(36).slice(2, 11) + Date.now().toString(36);

const useStore = create((set, get) => ({
  transactions: [],
  goals: [],
  isLoading: true,

  // Load from AsyncStorage
  loadData: async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { transactions, goals } = JSON.parse(raw);
        set({ transactions: transactions || [], goals: goals || [], isLoading: false });
      } else {
        // Seed with sample data on first launch
        const sampleTransactions = [
          { id: generateId(), amount: 50000, type: 'income', category: 'Salary', date: new Date().toISOString(), notes: 'Monthly salary' },
          { id: generateId(), amount: 1200, type: 'expense', category: 'Food', date: new Date().toISOString(), notes: 'Groceries' },
          { id: generateId(), amount: 800, type: 'expense', category: 'Transport', date: new Date().toISOString(), notes: 'Uber rides' },
          { id: generateId(), amount: 2000, type: 'expense', category: 'Shopping', date: new Date().toISOString(), notes: 'Clothes' },
          { id: generateId(), amount: 500, type: 'expense', category: 'Entertainment', date: new Date().toISOString(), notes: 'Netflix + Swiggy' },
          { id: generateId(), amount: 5000, type: 'income', category: 'Freelance', date: new Date().toISOString(), notes: 'Project payment' },
        ];
        const sampleGoals = [
          { id: generateId(), title: 'Emergency Fund', targetAmount: 100000, savedAmount: 35000, deadline: '2026-12-31', emoji: '🛡️' },
          { id: generateId(), title: 'New Laptop', targetAmount: 80000, savedAmount: 20000, deadline: '2026-08-01', emoji: '💻' },
        ];
        set({ transactions: sampleTransactions, goals: sampleGoals, isLoading: false });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions: sampleTransactions, goals: sampleGoals }));
      }
  },

  saveData: async (transactions, goals) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, goals }));
  },

  // Transactions
  addTransaction: (transaction) => {
    const newTransaction = { ...transaction, id: generateId(), date: new Date().toISOString() };
    const updated = [newTransaction, ...get().transactions];
    set({ transactions: updated });
    get().saveData(updated, get().goals);
  },

  updateTransaction: (id, data) => {
    const updated = get().transactions.map(t => t.id === id ? { ...t, ...data } : t);
    set({ transactions: updated });
    get().saveData(updated, get().goals);
  },

  deleteTransaction: (id) => {
    const updated = get().transactions.filter(t => t.id !== id);
    set({ transactions: updated });
    get().saveData(updated, get().goals);
  },

  // Goals
  addGoal: (goal) => {
    const newGoal = { ...goal, id: generateId(), savedAmount: 0 };
    const updated = [...get().goals, newGoal];
    set({ goals: updated });
    get().saveData(get().transactions, updated);
  },

  updateGoalSavings: (id, amount) => {
    const updated = get().goals.map(g =>
      g.id === id ? { ...g, savedAmount: Math.min(g.savedAmount + amount, g.targetAmount) } : g
    );
    set({ goals: updated });
    get().saveData(get().transactions, updated);
  },

  deleteGoal: (id) => {
    const updated = get().goals.filter(g => g.id !== id);
    set({ goals: updated });
    get().saveData(get().transactions, updated);
  },

  // Computed
  getTotalIncome: () => get().transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
  getTotalExpenses: () => get().transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
  getBalance: () => get().getTotalIncome() - get().getTotalExpenses(),

  getCategoryBreakdown: () => {
    const expenses = get().transactions.filter(t => t.type === 'expense');
    const map = {};
    expenses.forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
  },
}));

export default useStore;