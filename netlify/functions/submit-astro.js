// netlify/functions/submit-astro.js

const { google } = require("googleapis");
const { JWT } = require("google-auth-library");

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
let CREDENTIALS;

try {
  CREDENTIALS = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
} catch (e) {
  console.error("Invalid GOOGLE_SERVICE_ACCOUNT env var:", e);
  exports.handler = async () => ({
    statusCode: 500,
    body: JSON.stringify({ error: "Malformed service account credentials" }),
  });
  return;
}

console.log("ENV VARS:", {
  SHEET_ID,
  client_email: CREDENTIALS.client_email,
  private_key_loaded: !!CREDENTIALS.private_key,
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  console.log("Incoming Request Body:", event.body);

  let data = {};
  if (event.headers["content-type"]?.includes("application/x-www-form-urlencoded")) {
    data = Object.fromEntries(new URLSearchParams(event.body));
  } else {
    try {
      data = JSON.parse(event.body);
    } catch (e) {
      console.error("Body parse error:", e);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid request body" }),
      };
    }
  }

  try {
    const client = new JWT({
      email: CREDENTIALS.client_email,
      key: CREDENTIALS.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth: client });

    const row = [
      new Date().toISOString(),
      data.Email || "",
      data.BirthDate || "",
      data.BirthTime || "",
      data.BirthPlace || "",
      data.Notes || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "FormResponses!A1",
      valueInputOption: "RAW",
      requestBody: { values: [row] },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ result: "success", received: data }),
    };
  } catch (error) {
    console.error("Google Sheets Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
    };
  }
};
