const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// 🔧 Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload to Cloudinary — returns both URL & public_id
exports.uploadToCloudinary = async (filePath, oldPublicId = null) => {
  try {
    // 🧹 Agar purani image ka public_id diya gaya hai, pehle delete kar do
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
        console.log("🧹 Old image deleted from Cloudinary:", oldPublicId);
      } catch (err) {
        console.warn("⚠️ Old image delete failed:", err.message);
      }
    }

    // 🆙 Upload new image
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "user_profiles",
      resource_type: "image",
    });

    // 🗑️ Delete local temp file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // ✅ Return full details (URL + public_id)
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

// ✅ Optional: delete from Cloudinary manually (for future use)
exports.deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
    console.log("🗑️ Image deleted from Cloudinary:", publicId);
  } catch (err) {
    console.error("❌ Error deleting from Cloudinary:", err.message);
  }
};
