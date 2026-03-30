let twilioClient = null;

function getTwilioClient() {
  if (twilioClient) {
    return twilioClient;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return null;
  }

  // eslint-disable-next-line global-require
  const twilio = require("twilio");
  twilioClient = twilio(accountSid, authToken);
  return twilioClient;
}

async function sendSms({ to, body }) {
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!to || !body) {
    return { sent: false, reason: "Phone and message are required" };
  }

  if (!from) {
    return { sent: false, reason: "TWILIO_PHONE_NUMBER is missing" };
  }

  const client = getTwilioClient();
  if (!client) {
    return {
      sent: false,
      reason: "Twilio credentials are missing",
    };
  }

  const message = await client.messages.create({
    to,
    from,
    body,
  });

  return { sent: true, sid: message.sid };
}

module.exports = { sendSms };
