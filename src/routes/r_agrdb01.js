const express = require("express");
const { fetchRequests } = require("../db/agrdb01"); // import function

const router = express.Router();

/**
 * GET /requests
 * ส่งข้อมูล request จาก SQL Server
 */

router.get("/", async (req, res) => {
  try {
    const data = await fetchRequests();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch requests",
      details: err.message,
    });
  }
});

module.exports = router;
