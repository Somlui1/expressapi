
const path = require("path");
const agrdb01 = require("../db/agrdb01.js");
const dayjs = require("dayjs");
const PORT = process.env.PORT || 3000;

async function SOS(num) {
  try {
    let empno = num;
    const response = await agrdb01.fetchRequests();
    const sos = response.filter((req) => req.IT_EMPNO === String(empno));
    return {
      value: response.filter((req) => req.REQ_STATUS === "1").length,
      requests: response.filter((req) => req.REQ_STATUS === "1"),
      stats: {
        monthlyAccepted: sos.filter((req) => {
          const reqMonth = dayjs(req.ACEPT_DATE).month();
          const nowMonth = dayjs().month();
          return reqMonth === nowMonth;
        }).length,
        inProcess: sos.filter((req) => Number(req.REQ_STATUS) <= 3).length,
        total: response.filter((req) => Number(req.REQ_STATUS) <= 3).length,
      },
    };
  } catch (error) {
    console.error(error);
  }
}

async function SOSLog(empId, year, isCount) {
  try {
    const result = await agrdb01.fetchSOSLog(empId, year);

    // 1. เตรียม Object ที่มี data ไว้ก่อน
    let response = {
      data: result
    };

    // 2. ถ้าต้องการนับจำนวน ให้ "เพิ่ม" ค่า count เข้าไปใน Object เดิม
    if (isCount) {
      response.count = result.length;
      // หรือเขียนแบบนี้ก็ได้: return { data: result, count: result.length };
    }

    // 3. ส่งกลับทั้ง data และ count (ถ้ามี)
    return response;

  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch data" };
  }
}

async function SOSLogByDate(empId, startDate, endDate, isCount) {
  try {
    const result = await agrdb01.fetchSOSLogByDate(empId, startDate, endDate);

    let response = {
      data: result
    };

    if (isCount) {
      response.count = result.length;
    }

    return response;

  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch data" };
  }
}

module.exports = { SOS, SOSLog, SOSLogByDate };
