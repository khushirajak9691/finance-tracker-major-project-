// controllers/transactionController.js
const Transaction = require("../models/Transaction");

// ✅ Add a transaction
exports.addTransaction = async (req, res) => {
  try {
    console.log("Controller addTransaction: req.user =", req.user);
    console.log("Controller addTransaction: req.body =", req.body);

    const { type, category, amount, note } = req.body;

    if (!type || !category || !amount) {
      return res.status(400).json({ msg: "All required fields must be filled" });
    }

    const transaction = await Transaction.create({
      userId: req.user,
      type,
      category,
      amount,
      note,
    });

    console.log("Controller addTransaction: created", transaction);
    res.status(201).json(transaction);
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ msg: "Error creating transaction", error: err.message });
  }
};

// ✅ Get all user transactions
exports.getTransactions = async (req, res) => {
  try {
    console.log("Controller getTransactions: req.user =", req.user);
    const transactions = await Transaction.find({ userId: req.user }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ msg: "Error fetching transactions", error: err.message });
  }
};

// ✅ Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ msg: "Transaction not found" });

    // ensure user owns this transaction
    if (transaction.userId.toString() !== req.user) {
      return res.status(403).json({ msg: "Unauthorized action" });
    }

    await transaction.deleteOne();
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ msg: "Error deleting transaction", error: err.message });
  }
};
