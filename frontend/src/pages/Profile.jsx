import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Calendar, Edit3, LogOut, Save, X, Upload } from "lucide-react";
import axios from "axios";

const Profile = () => {
  const { user, token, logout, fetchProfile, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🟢 Correct Vite or CRA env variable handling
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  // 🟣 Load user info initially
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
      setPreview(user.profilePic || "/default-avatar.png");
    }
  }, [user]);

  // 🟢 Handle input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🟣 Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // temporary preview
    }
  };

  // ✅ Update profile (with instant UI refresh)
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      if (image) form.append("profilePic", image);

      const res = await axios.put(`${API_BASE_URL}/api/auth/profile`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updated = res.data.updatedUser;
      if (updated) {
        // ✅ Add cache-buster to avoid old image being shown
        const newImageUrl = `${updated.profilePic}?t=${Date.now()}`;
        setPreview(newImageUrl);
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      }

      // ✅ Re-fetch latest profile
      await fetchProfile();
      setIsEditing(false);
      alert(res.data.msg || "Profile updated successfully ✅");
    } catch (err) {
      console.error("❌ Profile update error:", err);
      alert(err.response?.data?.msg || "Error updating profile ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-2xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-700 to-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-lg text-white border border-white/20"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative w-28 h-28 mb-4">
            <img
              src={preview || "/default-avatar.png"}
              alt="profile"
              className="w-full h-full object-cover rounded-full border-4 border-indigo-400 shadow-lg"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition">
                <Upload size={18} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {isEditing ? (
            <div className="w-full mt-2 space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white"
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white"
                placeholder="Email"
              />
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-semibold flex items-center gap-2 transition"
                >
                  <Save size={18} /> {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 px-5 py-2 rounded-xl font-semibold flex items-center gap-2 transition"
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-1">{user?.name}</h2>
              <p className="text-indigo-200">{user?.email}</p>
            </>
          )}
        </div>

        {!isEditing && (
          <>
            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-indigo-300" />
                <p>{user?.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-indigo-300" />
                <p>
                  Joined:{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-500 hover:bg-indigo-600 px-5 py-2 rounded-xl font-semibold flex items-center gap-2 transition"
              >
                <Edit3 size={18} /> Edit Profile
              </button>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-semibold flex items-center gap-2 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
