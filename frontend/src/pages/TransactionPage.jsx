import React, { useEffect, useState, useContext } from "react";
import { API } from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

const TransactionsPage = () => {
  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  // ✅ Fetch transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchData();
  }, [token]);

  // ✅ Add instantly below
  const handleAdd = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  // ✅ Delete from UI
  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <TransactionForm onAdd={handleAdd} />
      <TransactionList transactions={transactions} onDelete={handleDelete} />
    </div>
  );
};

export default TransactionsPage;
