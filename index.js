require("dotenv").config({ path: ".env" }); // โหลด .env ก่อนใช้งาน
const express = require("express");
const requestsRouter = require("./src/routes/r_agrdb01.cjs"); // import router
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Routes ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next(); // ต้องเรียก next() เพื่อให้ request ไปต่อ
});
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/", requestsRouter); // mount router

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API docs at http://localhost:${PORT}/api-docs (ถ้ามี)`);
});
