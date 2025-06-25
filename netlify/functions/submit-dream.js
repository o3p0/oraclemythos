exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }
  
    const data = JSON.parse(event.body || '{}');
    console.log("Dream Form Submission:", data);
  
    return {
      statusCode: 200,
      body: JSON.stringify({ result: "success", received: data }),
    };
  };
  