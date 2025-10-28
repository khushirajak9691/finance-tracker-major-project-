import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
import TransactionForm from "../components/TransactionForm";
import { AuthContext } from "../context/AuthContext";
import { API } from "../utils/api";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await API.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    };
    fetchTransactions();
  }, [token]);

  const handleAdd = (newTx) => {
    setTransactions([newTx, ...transactions]);
  };

  const handleDelete = async (id) => {
    await API.delete(`/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTransactions(transactions.filter((tx) => tx._id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 space-y-6">
        <TransactionForm onAdd={handleAdd} />

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Your Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <ul className="space-y-3">
              {transactions.map((tx) => (
                <li
                  key={tx._id}
                  className={`p-4 rounded-lg flex justify-between items-center ${
                    tx.type === "income" ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {tx.category} - ₹{tx.amount}
                    </p>
                    <p className="text-sm text-gray-500">{tx.note}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(tx._id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
