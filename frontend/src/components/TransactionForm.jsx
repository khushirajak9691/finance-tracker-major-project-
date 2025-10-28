import React, { useState, useContext } from "react";
import { API } from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const TransactionForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    type: "income",
    category: "",
    amount: "",
    note: "",
  });
  const { token } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/transactions", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAdd(res.data); // ✅ Immediately show in list below
      setForm({ type: "income", category: "", amount: "", note: "" });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed to add transaction");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-6 space-y-4"
    >
      <h3 className="text-xl font-semibold">Add Transaction</h3>

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />

      <input
        type="text"
        name="note"
        placeholder="Note (optional)"
        value={form.note}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <button
        type="submit"
        className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition"
      >
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
