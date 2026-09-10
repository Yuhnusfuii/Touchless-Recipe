import mongoose from "mongoose";
import dns from "node:dns";

// Fix for Node.js on Windows where local router/ISP DNS fails to resolve MongoDB SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if unable to override DNS servers
}

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env["MONGODB_URI"] || "mongodb://localhost:27017/touchless_recipe";

    const conn = await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log(`🌿 MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
  } catch (error: any) {
    if (error?.message?.includes("SSL alert number 80")) {
      console.error("\n=======================================================");
      console.error("❌ LỖI MONGODB ATLAS: IP CHƯA ĐƯỢC CẤP QUYỀN (IP WHITELIST)!");
      console.error("👉 MongoDB Atlas từ chối kết nối (SSL alert number 80) vì IP hiện tại chưa được thêm vào Network Access.");
      console.error("👉 Cách khắc phục:");
      console.error("   1. Vào dashboard MongoDB Atlas: https://cloud.mongodb.com");
      console.error("   2. Vào mục 'Security' -> 'Network Access'");
      console.error("   3. Nhấn 'Add IP Address' -> Chọn 'Add Current IP Address' (hoặc điền 0.0.0.0/0 để cho phép mọi IP)");
      console.error("   4. Chờ 1-2 phút trạng thái chuyển sang Active rồi chạy lại backend.");
      console.error("=======================================================\n");
    } else {
      console.error("❌ MongoDB connection error:", error);
    }
    throw error;
  }
};

export default connectDB;
