// netlify/functions/submit-form.js

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }
  
    const data = JSON.parse(event.body || '{}');
  
    // You can log or handle the data here
    console.log("Form submitted:", data);
  
    return {
      statusCode: 200,
      body: JSON.stringify({ result: "success", received: data }),
    };
  };
  