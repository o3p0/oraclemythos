exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const data = Object.fromEntries(new URLSearchParams(event.body));
  console.log("Tarot Form Submission:", data);

  return {
    statusCode: 200,
    body: JSON.stringify({ result: "success", received: data }),
  };
};
