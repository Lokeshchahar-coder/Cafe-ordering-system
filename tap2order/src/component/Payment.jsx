import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems: routeCartItems, totalPrice: routeTotalPrice } =
    location.state || {};

  const [cartItems, setCartItems] = useState(routeCartItems || []);
  const [totalPrice, setTotalPrice] = useState(routeTotalPrice || 0);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    tableNumber: "",
    specialInstructions: "",
    vehicleNumber: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [thankYouStatus, setThankYouStatus] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showExtraCharges, setShowExtraCharges] = useState(false);
  const [orderType, setOrderType] = useState("dine");

  useEffect(() => {
    if (
      (!routeCartItems || routeCartItems.length === 0) &&
      (!routeTotalPrice || routeTotalPrice === 0)
    ) {
      const savedCart =
        JSON.parse(localStorage.getItem("cartItems")) || [];
      const savedTotal = savedCart.reduce(
        (total, item) => total + item.price * item.qty,
        0
      );
      if (savedCart.length > 0) {
        setCartItems(savedCart);
        setTotalPrice(savedTotal);
      }
    }
  }, [routeCartItems, routeTotalPrice]);

  useEffect(() => {
    if (cartItems.length === 0 || totalPrice === 0) {
      Swal.fire({
        icon: "info",
        title: "Cart is empty",
        text: "Add items before payment.",
      }).then(() => navigate("/"));
    }
  }, [cartItems, totalPrice, navigate]);

  const gst = totalPrice * 0.05;
  const convenienceFee = totalPrice * 0.05;
  const gstOnConvenienceFee = convenienceFee * 0.18;
  const finalPayableAmount =
    totalPrice + gst + convenienceFee + gstOnConvenienceFee;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  const notifyThankYou = async ({
    customerName,
    customerPhone,
    totalAmount,
    orderType,
    itemCount,
  }) => {
    const apiBase = (import.meta.env.VITE_API_URL || "").trim();
    const notifyUrl = apiBase
      ? `${apiBase}/api/notifications/thank-you`
      : import.meta.env.DEV
      ? "/api/notifications/thank-you"
      : "http://localhost:8001/api/notifications/thank-you";

    try {
      const response = await fetch(notifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName,
          phone: customerPhone,
          totalAmount,
          orderType,
          itemCount,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Failed to send thank-you note");
      }

      return {
        sent: Boolean(data?.sent),
        message: data?.message || "Thank-you note processed",
        reason: data?.reason || "",
        preview: data?.smsPreview || "",
        templateId: data?.templateId || null,
      };
    } catch (error) {
      console.warn("Thank-you note could not be sent:", error?.message || error);
      return {
        sent: false,
        message: "Thank-you note could not be sent",
        reason: error?.message || "Unknown error",
        preview: "",
        templateId: null,
      };
    }
  };

  const handlePayment = () => {
    if (!formData.customerName.trim()) return Swal.fire("Enter customer name");
    if (!formData.customerPhone.trim()) return Swal.fire("Enter phone number");

    const normalizedPhone = formData.customerPhone.replace(/\s+/g, "");
    if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
      return Swal.fire("Enter a valid phone number");
    }

    if (orderType === "dine" && !formData.tableNumber)
      return Swal.fire("Enter table number");
    if (orderType === "take" && !formData.vehicleNumber)
      return Swal.fire("Enter vehicle number");

    if (!razorpayLoaded)
      return Swal.fire("Payment system loading...");

    const options = {
      key: "rzp_test_2wLyy6wPo2UCAY",
      amount: Math.round(finalPayableAmount * 100),
      currency: "INR",
      name: "GD Cafe",
      handler: async () => {
        Swal.fire("Payment Successful 🎉");

        const orderData = {
          ...formData,
          customerName: formData.customerName.trim(),
          customerPhone: normalizedPhone,
          orderType,
          cartItems,
          totalPrice: finalPayableAmount,
          timestamp: new Date(),
        };

        await fetch(
          "https://check-18079-default-rtdb.firebaseio.com/ff.json",
          {
            method: "POST",
            body: JSON.stringify(orderData),
          }
        );

        setOrderPlaced(true);

        const notifyResult = await notifyThankYou({
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          totalAmount: finalPayableAmount,
          orderType,
          itemCount: cartItems.reduce((sum, item) => sum + Number(item.qty || 0), 0),
        });

        setThankYouStatus(notifyResult);

        if (notifyResult.sent) {
          Swal.fire({
            icon: "success",
            title: "Thank-you note sent",
            text: `A confirmation SMS has been sent to ${orderData.customerPhone}`,
          });
        } else {
          Swal.fire({
            icon: "info",
            title: "Order placed",
            text: "Order is placed successfully. Thank-you SMS may be delayed.",
          });
        }

        emailjs.send(
          "service_48qpquj",
          "template_agxpbka",
          {
            totalAmount: finalPayableAmount,
          },
          "Q9yA1C4PTHSCKXkVT"
        );
      },
      theme: { color: "#facc15" },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="bg-[#0b0b0b] min-h-screen text-white">

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20"
        >
          <FaArrowLeft />
        </button>

        <h1 className="text-xl font-semibold text-yellow-400">
          Checkout
        </h1>

        <div className="text-right">
          <p className="text-xs text-gray-400">Pay</p>
          <p className="text-lg font-bold text-yellow-400">
            ₹{finalPayableAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">

        {/* Cart */}
        <div className="md:col-span-2 bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold mb-4">
            Order Summary
          </h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-4 bg-white/5 p-3 rounded-lg"
            >
              <img
                src={item.image}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="flex-1 ml-3">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-400">
                  ₹{item.price} x {item.qty}
                </p>
              </div>
              <p className="text-yellow-400 font-bold">
                ₹{item.price * item.qty}
              </p>
            </div>
          ))}
        </div>

        {/* Payment */}
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
          <h2 className="text-lg font-semibold mb-4">
            Payment Details
          </h2>

          <input
            placeholder="Customer Name"
            className="w-full p-2 mb-3 rounded bg-white/10"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
          />

          <input
            placeholder="Phone Number"
            className="w-full p-2 mb-3 rounded bg-white/10"
            value={formData.customerPhone}
            onChange={(e) =>
              setFormData({ ...formData, customerPhone: e.target.value })
            }
          />

          {/* Order Type */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setOrderType("dine")}
              className={`flex-1 py-2 rounded-lg ${
                orderType === "dine"
                  ? "bg-yellow-400 text-black"
                  : "bg-white/10"
              }`}
            >
              Dine In
            </button>

            <button
              onClick={() => setOrderType("take")}
              className={`flex-1 py-2 rounded-lg ${
                orderType === "take"
                  ? "bg-yellow-400 text-black"
                  : "bg-white/10"
              }`}
            >
              Take Away
            </button>
          </div>

          {orderType === "dine" && (
            <input
              placeholder="Table Number"
              className="w-full p-2 mb-3 rounded bg-white/10"
              onChange={(e) =>
                setFormData({ ...formData, tableNumber: e.target.value })
              }
            />
          )}

          {orderType === "take" && (
            <input
              placeholder="Vehicle Number"
              className="w-full p-2 mb-3 rounded bg-white/10"
              onChange={(e) =>
                setFormData({ ...formData, vehicleNumber: e.target.value })
              }
            />
          )}

          <textarea
            placeholder="Instructions"
            className="w-full p-2 mb-3 rounded bg-white/10"
            onChange={(e) =>
              setFormData({
                ...formData,
                specialInstructions: e.target.value,
              })
            }
          />

          {/* Price */}
          <div className="text-sm text-gray-300">
            <p>Subtotal: ₹{totalPrice}</p>

            <p
              className="cursor-pointer flex items-center gap-2"
              onClick={() => setShowExtraCharges(!showExtraCharges)}
            >
              Extra Charges{" "}
              {showExtraCharges ? <FaEyeSlash /> : <FaEye />}
            </p>

            {showExtraCharges && (
              <div className="ml-2 text-gray-400">
                <p>GST: ₹{gst.toFixed(2)}</p>
                <p>Convenience: ₹{convenienceFee.toFixed(2)}</p>
              </div>
            )}

            <hr className="my-2 border-white/10" />

            <p className="text-lg font-bold text-yellow-400">
              ₹{finalPayableAmount.toFixed(2)}
            </p>
          </div>

          <button
            onClick={handlePayment}
            className="w-full mt-4 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300"
          >
            Pay Now
          </button>
        </div>
      </div>

      {/* Success */}
      {orderPlaced && (
        <div className="text-center mt-10 px-6">
          <h2 className="text-2xl text-green-400">
            Order Placed Successfully 🎉
          </h2>
          {thankYouStatus && (
            <div className="max-w-3xl mx-auto mt-4 p-4 rounded-xl border border-green-400/30 bg-green-900/20 text-left">
              <p className="text-green-300 font-semibold">
                {thankYouStatus.sent ? "Thank-you SMS sent ✅" : "Thank-you SMS pending ⏳"}
              </p>
              <p className="text-sm text-gray-300 mt-1">
                {thankYouStatus.message}
                {thankYouStatus.reason ? ` (${thankYouStatus.reason})` : ""}
              </p>
              {thankYouStatus.preview && (
                <p className="text-sm text-yellow-200 mt-2 leading-relaxed">
                  Message preview: {thankYouStatus.preview}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Payment;