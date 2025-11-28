const dayjs = require("dayjs");
const { fetchRequests } = require("./src/db/agrdb01");

async function main(num) {
  try {
    let empno = 10002898;
    const response = await fetchRequests();

    const sos = response.filter((req) => req.IT_EMPNO === String(empno));

    const result = {
      value: response.filter((req) => req.REQ_STATUS === "1").length,

      requests: response.filter((req) => req.REQ_STATUS === "1"),

      stats: {
        monthlyAccepted: sos.filter((req) => {
          const reqMonth = dayjs(req.ACEPT_DATE).month(); // เดือนของเคส
          const nowMonth = dayjs().month(); // เดือนปัจจุบัน
          return reqMonth === nowMonth;
        }).length,

        inProcess: sos.filter((req) => Number(req.REQ_STATUS) <= 3).length,

        total: response.filter((req) => Number(req.REQ_STATUS) <= 3).length,
      },
    };

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}

main();
