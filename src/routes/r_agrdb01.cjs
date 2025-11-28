const express = require("express");
const { fetchRequests } = require("../db/agrdb01"); // import function
const service = require("../service/s_agrdb01.cjs");
const router = express.Router();
const dayjs = require("dayjs");
/**
 * GET /requests
 * ส่งข้อมูล request จาก SQL Server
 */

router.get("/", async (req, res) => {
  try {
    const queryData = req.query;
    // ส่งกลับเป็น JSON
    const result = res.json({
      status: "success",
      received: queryData,
    });
  } catch (err) {}
});

router.get("/sos", async (req, res) => {
  const empno = req.query.id;
  const sos = await service.SOS(empno);
  res.json(sos);
});

//console.log(JSON.stringify(result, null, 2));

router.get("/sos/all", async (req, res) => {
  try {
    //let empno = req.query.id;
    const response = await service.SOS();
    //const sos = response.filter((req) => req.IT_EMPNO === String(empno));
    res.json(response);
  } catch (err) {}
});

module.exports = router;
