import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { API } from "../utils/api";
import TransactionForm from "../components/TransactionForm";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Wallet,
  LogOut,
  BarChart3,
  User,
  Layers,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  Search,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ added for navigation

const COLORS = ["#4CAF50", "#F44336"];

const Dashboard = () => {
  const { token, logout, user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [search, setSearch] = useState("");
  const [monthData, setMonthData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await API.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setTransactions(data);
      setFiltered(data);
      calculateSummary(data);
      generateMonthlyChart(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      if (err.response?.status === 401) logout();
    }
  }, [token, logout]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAdd = (newTransaction) => {
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    setFiltered(updated);
    calculateSummary(updated);
    generateMonthlyChart(updated);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = transactions.filter((t) => t._id !== id);
      setTransactions(updated);
      setFiltered(updated);
      calculateSummary(updated);
      generateMonthlyChart(updated);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const calculateSummary = (data) => {
    let income = 0,
      expense = 0;
    data.forEach((t) =>
      t.type === "income" ? (income += t.amount) : (expense += t.amount)
    );
    setSummary({ income, expense });
  };

  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      transactions.filter(
        (t) =>
          t.category.toLowerCase().includes(lower) ||
          t.note?.toLowerCase().includes(lower)
      )
    );
  }, [search, transactions]);

  const generateMonthlyChart = (data) => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(0, i).toLocaleString("default", { month: "short" }),
      income: 0,
      expense: 0,
    }));

    data.forEach((t) => {
      const month = new Date(t.date).getMonth();
      if (t.type === "income") months[month].income += t.amount;
      else months[month].expense += t.amount;
    });

    setMonthData(months);
  };

  const balance = summary.income - summary.expense;
  const chartData = [
    { name: "Income", value: summary.income },
    { name: "Expense", value: summary.expense },
  ];

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  })();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-b from-indigo-600 to-blue-500 text-white flex flex-col justify-between shadow-2xl relative"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Wallet size={28} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.h1
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-2xl font-bold"
                  >
                    FinTrack Pro
                  </motion.h1>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-indigo-700 p-2 rounded-full transition"
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={22} />}
            </button>
          </div>

          {/* ✅ Sidebar Links (Fixed) */}
          <ul className="space-y-5">
            {[
              { name: "Dashboard", icon: <BarChart3 size={20} />, path: "/dashboard" },
              { name: "Transactions", icon: <Layers size={20} />, path: "/transactions" },
              { name: "Profile", icon: <User size={20} />, path: "/profile" },
            ].map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ scale: 1.03 }}
                className={`hover:bg-indigo-700 p-3 rounded-xl cursor-pointer transition relative group ${
                  window.location.pathname === item.path ? "bg-indigo-800" : ""
                }`}
              >
                <Link to={item.path} className="flex items-center gap-3 w-full text-white no-underline">
                  {item.icon}
                  {sidebarOpen ? (
                    <span className="text-sm font-medium">{item.name}</span>
                  ) : (
                    <span className="absolute left-14 bg-indigo-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition">
                      {item.name}
                    </span>
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 m-6 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition text-white justify-center"
        >
          <LogOut size={18} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-3">
            👋 {greeting},{" "}
            <span className="text-indigo-500">
              {user?.email?.split("@")[0] || "Buddy"}!
            </span>
          </h2>
          <p className="text-gray-600 text-lg mt-1">Dashboard Overview</p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <motion.div
            className="bg-green-500 text-white p-6 rounded-2xl shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <ArrowUpCircle size={30} className="mx-auto mb-2" />
            <h4 className="font-semibold">Total Income</h4>
            <p className="text-2xl font-bold">₹{summary.income}</p>
          </motion.div>
          <motion.div
            className="bg-rose-500 text-white p-6 rounded-2xl shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <ArrowDownCircle size={30} className="mx-auto mb-2" />
            <h4 className="font-semibold">Total Expense</h4>
            <p className="text-2xl font-bold">₹{summary.expense}</p>
          </motion.div>
          <motion.div
            className="bg-indigo-500 text-white p-6 rounded-2xl shadow-lg text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Wallet size={30} className="mx-auto mb-2" />
            <h4 className="font-semibold">Balance</h4>
            <p className="text-2xl font-bold">₹{balance}</p>
          </motion.div>
        </div>

        {/* Add Transaction */}
        <TransactionForm onAdd={handleAdd} />

        {/* Search Bar */}
        <div className="my-6 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by category or note..."
              className="border rounded-xl w-full p-3 pl-10 shadow-sm focus:ring-2 focus:ring-indigo-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Income vs Expense</h3>
            <PieChart width={350} height={250}>
              <Pie
                data={chartData}
                cx={170}
                cy={120}
                outerRadius={80}
                dataKey="value"
                label
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
            <LineChart width={400} height={250} data={monthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#4CAF50" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#F44336" strokeWidth={2} />
            </LineChart>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <ul className="space-y-3">
            {filtered.map((t) => (
              <motion.li
                key={t._id}
                className="flex justify-between items-center border-b pb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div>
                  <p className="font-medium">{t.category}</p>
                  <p className="text-sm text-gray-500">{t.note || "-"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p
                    className={`font-semibold ${
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}₹{t.amount}
                  </p>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-gray-500 hover:text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="text-gray-500 text-center mt-4">
              No matching transactions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
