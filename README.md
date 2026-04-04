# 💰 Finance Companion

A personal finance companion mobile app built with React Native (Expo) that helps users track transactions, monitor savings goals, and understand their spending patterns through insightful visualizations.

---

## 📱 Screenshots

> Add screenshots here after recording your demo

---

## ✨ Features

### 🏠 Home Dashboard
- Total balance, income, and expense summary cards
- Interactive pie chart showing spending by category
- Recent transactions preview
- Gradient header with personalized greeting

### 💸 Transaction Tracking
- Add, edit, and delete transactions
- Income and expense types with 10 category options
- Search transactions by category or notes
- Filter by All / Income / Expense
- Persistent data across app sessions

### 🎯 Savings Goals
- Create goals with custom emoji, target amount, and deadline
- Visual progress bar showing savings completion
- Add savings incrementally toward each goal
- Completion celebration when goal is reached
- Delete goals when no longer needed

### 📊 Insights Screen
- Savings rate percentage with smart feedback
- This week vs last week spending comparison
- Top spending category highlight
- Bar chart of top 5 spending categories
- Full category breakdown with progress bars
- Income vs expenses summary

### 🎨 UX & Polish
- Empty states for all screens
- Loading states on app startup
- Touch-friendly interactions throughout
- Smooth bottom tab navigation
- Stack navigation for Add/Edit transaction flow
- Keyboard-aware forms (no content hidden behind keyboard)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo | Cross-platform mobile framework |
| Zustand | Lightweight global state management |
| AsyncStorage | Local data persistence |
| React Navigation | Bottom tabs + Stack navigation |
| react-native-chart-kit | Pie chart and bar chart visualizations |
| react-native-svg | SVG rendering for charts |
| expo-linear-gradient | Gradient header on Home screen |
| date-fns | Date formatting and week calculations |

---

## 📁 Project Structure

FinanceCompanion/
├── App.js                          # Root navigation setup
├── src/
│   ├── store/
│   │   └── useStore.js             # Zustand store (state + AsyncStorage)
│   ├── screens/
│   │   ├── HomeScreen.js           # Dashboard with charts
│   │   ├── TransactionsScreen.js   # Transaction list with search/filter
│   │   ├── AddTransactionScreen.js # Add/Edit transaction form
│   │   ├── GoalsScreen.js          # Savings goals tracker
│   │   └── InsightsScreen.js       # Spending analytics
│   ├── components/
│   │   ├── TransactionCard.js      # Reusable transaction list item
│   │   ├── SummaryCard.js          # Reusable summary stat card
│   │   └── EmptyState.js           # Reusable empty state component
│   └── theme/
│       └── colors.js               # Centralized color palette

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your Android/iOS device

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/FinanceCompanion.git
cd FinanceCompanion

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App
- Scan the QR code with **Expo Go** (Android) or Camera app (iOS)
- Both devices must be on the same network, or use `--tunnel` flag

---

## 🧠 Technical Decisions & Trade-offs

### Framework: React Native with Expo
Chose Expo for rapid development without native build tooling. The managed workflow allowed focus on product quality rather than configuration. Trade-off: slightly larger app bundle size.

### State Management: Zustand
Zustand was chosen over Redux for its minimal boilerplate and simple API. A single store holds all transactions and goals with computed selectors. This keeps state logic centralized and easy to reason about.

### Data Persistence: AsyncStorage
All data is persisted locally using AsyncStorage via the Zustand store. On first launch, the app seeds sample data so users immediately see a meaningful dashboard. Every state mutation automatically triggers a save.

### Architecture
Screens handle UI only. All business logic (CRUD operations, computed values like balance and category breakdown) lives in the Zustand store. Components like `TransactionCard`, `SummaryCard`, and `EmptyState` are reusable and receive only what they need via props.

---

## 📋 Assumptions Made

- Currency is fixed to Indian Rupee (₹) as the target market is India
- Dates are automatically assigned as the current date when a transaction is added
- The app seeds sample data on first launch to demonstrate functionality immediately
- Goals track manually added savings rather than automatically deducting from transactions
- The insights screen compares the current calendar week (Monday–Sunday) against the previous week

---

## ⚠️ Known Limitations

- No cloud sync — data is local to the device only
- Date picker uses manual text input instead of a calendar widget
- No recurring transaction support
- Charts require at least one transaction to render

---

## 🔮 Future Improvements

- Cloud backup with Supabase or Firebase
- Date picker component for better UX
- Budget limits with overspending alerts
- Dark mode support
- Data export to CSV
- Push notification reminders
- Multi-currency support

---

## 👤 Author

**Agraharapu Yaswanth**  
Final Year B.Tech Computer Science — VIT-AP University  
[GitHub](https://github.com/YaswanthAgraharapu) • [LinkedIn](https://www.linkedin.com/in/agraharapu-yaswanth-3b3107256/)

---

## 📄 License

This project was built as part of an internship assignment for Zorvyn FinTech Pvt. Ltd.
