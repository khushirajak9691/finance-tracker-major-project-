// src/components/Sidebar.jsx
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Transactions", path: "/transactions" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <motion.div
      className="h-screen w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white p-5 flex flex-col justify-between"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h2 className="text-2xl font-bold mb-10 text-center">💸 FinTrack</h2>
        <nav className="space-y-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block py-2 px-4 rounded-lg ${
                location.pathname === link.path
                  ? "bg-white/20 font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={logout}
        className="bg-white/20 hover:bg-white/30 transition p-3 rounded-lg font-semibold mt-10"
      >
        Logout
      </button>
    </motion.div>
  );
};

export default Sidebar;
