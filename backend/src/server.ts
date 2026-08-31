import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env["PORT"] || 5000;

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("❌ API startup aborted because MongoDB is unavailable:", error);
    process.exitCode = 1;
    return;
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📌 API Base: http://localhost:${PORT}/api/v1`);
  });
};

startServer();
