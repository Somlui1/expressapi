const express = require("express");
const { fetchRequests } = require("../db/agrdb01"); // import function
const service = require("../service/s_agrdb01.cjs");
const router = express.Router();

/**
 * GET /requests
 * ส่งข้อมูล request จาก SQL Server
 */

router.get("/", async (req, res) => {
  try {
    const queryData = req.query;
    // ส่งกลับเป็น JSON
    res.json({
      status: "success",
      received: queryData,
    });
  } catch (err) {}
});

router.get("/sos", async (req, res) => {
  try {

    console.log
    const queryData = req.query;
    // ส่งกลับเป็น JSON
    const sos = await service.SOS();
    res.json({
      status: "success",
      sos: sos,
    });
  } catch (err) {}
});

module.exports = router;
