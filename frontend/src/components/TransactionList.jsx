import React from "react";

const TransactionList = ({ transactions, onDelete }) => {
  return (
    <div className="mt-6 bg-white shadow-lg rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4">Your Transactions</h3>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((tx) => (
            <li
              key={tx._id}
              className={`flex justify-between items-center border-b pb-2 ${
                tx.type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              <div>
                <span className="font-semibold">{tx.category}</span> - ₹
                {tx.amount}
                {tx.note && (
                  <span className="text-gray-500 text-sm ml-2">
                    ({tx.note})
                  </span>
                )}
              </div>
              <button
                onClick={() => onDelete(tx._id)}
                className="text-gray-400 hover:text-red-600 transition"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
