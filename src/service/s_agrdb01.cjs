require("dotenv").config({ path: "../../.env" });
const path = require("path");
const agrdb01 = require("../db/agrdb01.js");

const PORT = process.env.PORT || 3000;
// --- Routes ---
//{
//    "status" :{
//        "total request acept in this month" : {}
//        ,"total request in process" : {}
//    },
//    "data" : []
//}

async function SOS() {
  try {
    const data = await agrdb01.fetchRequests();
    return data;
  } catch (error) {}
}

module.exports = { SOS };
