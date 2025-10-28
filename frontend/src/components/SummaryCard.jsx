// src/components/SummaryCard.jsx
import React from "react";
import { motion } from "framer-motion";

const SummaryCard = ({ title, value, color }) => {
  return (
    <motion.div
      className={`p-6 rounded-2xl shadow-lg ${color} text-white flex-1`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-2">₹{value}</p>
    </motion.div>
  );
};

export default SummaryCard;
