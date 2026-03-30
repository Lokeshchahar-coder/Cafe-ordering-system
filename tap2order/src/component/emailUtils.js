import emailjs from "emailjs-com";

export const sendEmailNotification = (order) => {
  const emailParams = {
    name: order.name,
    tableNumber: order.tableNumber,
    contact: order.contact,
    cartItems: order.cartItems
      .map((item) => `${item.name} x ${item.qty} (₹${item.price * item.qty})`)
      .join(", "),
    totalPrice: order.totalPrice,
    specialInstructions: order.specialInstructions || "N/A",
  };

  try {
    return emailjs.send(
      "service_48qpquj", // Replace with your EmailJS Service ID
      "template_agxpbka", // Replace with your EmailJS Template ID
      emailParams,
      "Q9yA1C4PTHSCKXkVT" // Replace with your EmailJS User ID
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};