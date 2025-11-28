const fetchSOSFromAPI = async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000); // 7 sec timeout

    const response = await fetch("http://10.10.3.215:3434/sos?id=10002898", {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // ❌ HTTP status error (เช่น 400, 404, 500)
    if (!response.ok) {
      return {
        value: 0,
        requests: [],
        errorCode: response.status,
        errorMessage: `HTTP Error: ${response.status}`,
        stats: { monthlyAccepted: 0, inProcess: 0 },
      };
    }

    const result = await response.json();

    // คืนค่าปกติ
    return {
      value: result?.value ?? 0,
      requests: Array.isArray(result?.requests) ? result.requests : [],
      errorCode: 0,
      errorMessage: null,
      stats: {
        monthlyAccepted: result?.stats?.monthlyAccepted ?? 0,
        inProcess: result?.stats?.inProcess ?? 0,
      },
    };
  } catch (error) {
    // ❌ server connect ไม่ได้
    if (error.name === "AbortError") {
      return {
        value: 0,
        requests: [],
        errorCode: 408,
        errorMessage: "Request Timeout",
        stats: { monthlyAccepted: 0, inProcess: 0 },
      };
    }

    return {
      value: 0,
      requests: [],
      errorCode: -1,
      errorMessage: "Cannot connect to server",
      stats: { monthlyAccepted: 0, inProcess: 0 },
    };
  }
};

fetchSOSFromAPI().then(console.log);
