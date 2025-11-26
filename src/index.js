require("dotenv").config({ path: "./.env" }); // โหลด .env ก่อนใช้งาน
const express = require("express");
const requestsRouter = require("./routes/r_agrdb01"); // import router

const app = express();
const PORT = process.env.PORT || 3000;

// --- Routes ---
app.use("/", requestsRouter); // mount router

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API docs at http://localhost:${PORT}/api-docs (ถ้ามี)`);
});
