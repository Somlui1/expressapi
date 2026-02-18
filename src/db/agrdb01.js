const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const sql = require("mssql");
//const config = {
//  user:  "dev",
//  password: "dev@agrdb01",
//  server: "10.10.10.105",
//  database: "sos",
//  options: {
//    encrypt: false,
//    trustServerCertificate: true,
//  },
//};
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertisficate: true,
  },
};

//close is 4
//puase is 3
// in process is 2

const query = `
;WITH src AS (
    SELECT 
        r.REQ_DES,
        r.REQ_LOCATION,
        r.REQ_COMPANY,
        r.REQ_CONTACT,
        r.REQ_SERVERITY,
        r.REQ_STATUS,
        r.REQ_USER_LOGIN,
        r.REQ_DEPT,
        r.REQ_IP,
        r.IT_EMPNO,
        r.REQ_DATE,
        r.ACEPT_DATE,
        r.CLOSE_DATE,
        r.REQ_STATUS_ACHIEVE,
        r.REQ_IT_SUPPORT
    FROM dbo.TBL_REQUEST r
    WHERE LTRIM(RTRIM(r.REQ_IT_SUPPORT)) IN ('1.ITSupport', '3.ERP-SyteLineSupport')
      AND r.REQ_COMPANY NOT IN ('AP', 'AHR', 'AA', 'AF', 'ASP', 'APR','APB','APC')
      AND r.REQ_STATUS NOT LIKE '%[^0-9]%'
      AND r.REQ_DATE LIKE '[0-3][0-9]-[0-1][0-9]-[1-2][0-9][0-9][0-9] [0-2][0-9]:[0-5][0-9]'
)
SELECT *
FROM src
WHERE CONVERT(
          datetime,
          SUBSTRING(REQ_DATE, 7, 4) + '-' +  
          SUBSTRING(REQ_DATE, 4, 2) + '-' +  
          SUBSTRING(REQ_DATE, 1, 2) + ' ' +  
          SUBSTRING(REQ_DATE, 12, 5),        
          120
      ) >= DATEADD(MONTH, -2, GETDATE());
`;

async function fetchRequests() {
  let pool;
  try {
    pool = await sql.connect(config);
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  } finally {
    if (pool) await pool.close();
  }
}

async function fetchSOSLog(empId, year) {
  let pool;
  try {
    pool = await sql.connect(config);
    const request = pool.request();
    request.input('empId', sql.VarChar, empId);
    request.input('year', sql.VarChar, year);

    const query = `
      WITH src AS (
          SELECT 
              *
          FROM dbo.TBL_REQUEST r
          WHERE LTRIM(RTRIM(r.REQ_IT_SUPPORT)) IN ('1.ITSupport', '3.ERP-SyteLineSupport')
            AND r.REQ_COMPANY NOT IN ('AP', 'AHR', 'AA', 'AF', 'ASP', 'APR','APB','APC')
            AND r.REQ_STATUS NOT LIKE '%[^0-9]%'
            AND r.REQ_DATE LIKE '[0-3][0-9]-[0-1][0-9]-[1-2][0-9][0-9][0-9] [0-2][0-9]:[0-5][0-9]'
            AND r.IT_EMPNO = @empId
            and r.REQ_STATUS > 3
      )
      SELECT *
      FROM src
      WHERE SUBSTRING(REQ_DATE, 7, 4) = @year;
    `;
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  } finally {
    if (pool) await pool.close();
  }
}

async function fetchSOSLogByDate(empId, startDate, endDate) {
  let pool;
  try {
    pool = await sql.connect(config);
    const request = pool.request();
    request.input('empId', sql.VarChar, empId);
    request.input('startDate', sql.VarChar, startDate);
    request.input('endDate', sql.VarChar, endDate);

    const query = `
      WITH src AS (
          SELECT 
              *
          FROM dbo.TBL_REQUEST r
          WHERE LTRIM(RTRIM(r.REQ_IT_SUPPORT)) IN ('1.ITSupport', '3.ERP-SyteLineSupport')
            AND r.REQ_COMPANY NOT IN ('AP', 'AHR', 'AA', 'AF', 'ASP', 'APR','APB','APC')
            AND r.REQ_STATUS NOT LIKE '%[^0-9]%'
            AND r.REQ_DATE LIKE '[0-3][0-9]-[0-1][0-9]-[1-2][0-9][0-9][0-9] [0-2][0-9]:[0-5][0-9]'
            AND r.IT_EMPNO = @empId
            and r.REQ_STATUS > 3
      )
      SELECT *
      FROM src
      WHERE CONVERT(
                datetime,
                SUBSTRING(REQ_DATE, 7, 4) + '-' +  
                SUBSTRING(REQ_DATE, 4, 2) + '-' +  
                SUBSTRING(REQ_DATE, 1, 2) + ' ' +  
                SUBSTRING(REQ_DATE, 12, 5),        
                120
            ) BETWEEN @startDate AND @endDate;
    `;
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  } finally {
    if (pool) await pool.close();
  }
}

module.exports = { fetchRequests, fetchSOSLog, fetchSOSLogByDate };
