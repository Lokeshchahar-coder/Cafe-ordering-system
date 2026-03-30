const { sendSms } = require("../utils/smsClient");

function normalizePhone(phone) {
  const cleaned = String(phone || "").replace(/\s+/g, "");
  if (/^\+?[0-9]{10,15}$/.test(cleaned)) {
    return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  }
  return null;
}

function buildRotatingThankYouMessage({ formattedName, orderMode, itemText, amountText, phone }) {
  const templates = [
    `Hi ${formattedName}, thank you for choosing GD CAFE ✨ Your ${orderMode} order (${itemText}) is confirmed${amountText ? ` | Total: ${amountText}` : ""}. We’re preparing it with care.`,
    `Hello ${formattedName}! GD CAFE appreciates your order ❤️ ${orderMode} booking for ${itemText}${amountText ? ` | Bill: ${amountText}` : ""} is confirmed. We can’t wait to serve you again ☕`,
    `${formattedName}, your GD CAFE order is in! ✅ ${orderMode} | ${itemText}${amountText ? ` | Amount: ${amountText}` : ""}. Thanks for trusting us—wishing you a delightful meal 🍽️`,
  ];

  const numericPhone = String(phone || "").replace(/\D/g, "");
  const seed = Number(numericPhone.slice(-4) || 0) + new Date().getDate();
  const templateIndex = seed % templates.length;

  return {
    message: templates[templateIndex],
    templateId: templateIndex + 1,
  };
}

async function sendThankYouNote(req, res, next) {
  try {
    const { name, phone, totalAmount, orderType, itemCount } = req.body || {};
    const normalizedPhone = normalizePhone(phone);

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "name is required" });
    }

    if (!normalizedPhone) {
      return res.status(400).json({ message: "valid phone is required" });
    }

    const cleanName = String(name).trim();
    const firstName = cleanName.split(/\s+/)[0];
    const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const amountText = Number.isFinite(Number(totalAmount))
      ? `₹${Number(totalAmount).toFixed(2)}`
      : null;
    const orderMode = String(orderType || "").toLowerCase() === "take" ? "Take Away" : "Dine In";
    const itemText = Number.isFinite(Number(itemCount)) && Number(itemCount) > 0
      ? `${Number(itemCount)} item${Number(itemCount) > 1 ? "s" : ""}`
      : "your order";

    const { message: smsBody, templateId } = buildRotatingThankYouMessage({
      formattedName,
      orderMode,
      itemText,
      amountText,
      phone: normalizedPhone,
    });

    const result = await sendSms({ to: normalizedPhone, body: smsBody });

    if (!result.sent) {
      return res.status(202).json({
        message: "Thank-you note queued/skipped",
        sent: false,
        reason: result.reason,
        templateId,
        smsPreview: smsBody,
      });
    }

    return res.status(200).json({
      message: "Thank-you note sent",
      sent: true,
      sid: result.sid,
      templateId,
      smsPreview: smsBody,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { sendThankYouNote };
