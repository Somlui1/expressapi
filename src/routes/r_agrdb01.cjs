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
  } catch (err) { }
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
  } catch (err) { }
});


router.get("/sos/log", async (req, res) => {
  try {
    const empId = req.query.id;
    const year = req.query.year;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    // 1. ดึงค่า $count ออกมาตรงๆ
    // หมายเหตุ: ใน URL ถ้าส่ง $count=true ค่าที่ได้คือสตริง "true"
    const countParam = req.query['$count'];

    if (!empId) {
      return res.status(400).json({ status: "error", message: "Missing required query parameter: id" });
    }

    // 2. ปรับเงื่อนไขให้เช็คแค่ว่าเป็นคำว่า 'true' หรือไม่
    let isCount = false;
    if (countParam === 'true') {
      isCount = true;
    }

    console.log(`Checking Count: ${isCount}`); // ลอง log ดูว่าเข้าเงื่อนไขไหม

    let response;
    if (startDate && endDate) {
      // กรณีระบุช่วงเวลา (startDate, endDate)
      response = await service.SOSLogByDate(empId, startDate, endDate, isCount);
    } else if (year) {
      // กรณีระบุปี (year)
      response = await service.SOSLog(empId, year, isCount);
    } else {
      return res.status(400).json({ status: "error", message: "Missing required query parameters: (year) OR (startDate and endDate)" });
    }

    res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});
module.exports = router;
