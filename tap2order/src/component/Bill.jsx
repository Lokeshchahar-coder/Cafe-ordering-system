import React, { useRef } from "react";
import { useLocation } from "react-router-dom";

const PrintBill = () => {
  const billRef = useRef();
  const { state } = useLocation();
  const order = state?.order;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md" id="bill-container">
        {/* Header */}
        <div className="text-center py-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <h1 className="text-3xl font-bold tracking-wide">GD CAFE</h1>
          <p className="text-sm mt-1">Amarpali Princely Estate Sector-76 , Noida-201301</p>
          <p className="text-sm">Phone: +91 9891091797</p>
        </div>

        {/* Bill Content */}
        <div ref={billRef} id="bill" className="p-6 bg-gray-50">
          {/* Order Information */}
          <div className="mb-6 border-b border-gray-300 pb-4">
            <div className="flex justify-between text-sm">
              <p>
                <span className="font-semibold">Table Number:</span>{" "}
                {order?.tableNumber || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {order?.timestamp
                  ? new Date(order.timestamp).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <p className="mt-2 text-sm">
              <span className="font-semibold">Time:</span>{" "}
              {order?.timestamp
                ? new Date(order.timestamp).toLocaleTimeString()
                : "N/A"}
            </p>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <table className="w-full text-sm border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 text-left">Item</th>
                  <th className="py-2 px-4 text-center">Qty</th>
                  <th className="py-2 px-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {order?.cartItems?.map((item, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4 text-center">{item.qty}</td>
                    <td className="py-2 px-4 text-right">₹{item.price * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Special Instructions */}
          {order?.specialInstructions && (
            <div className="mb-6">
              <p className="font-semibold text-sm">Special Instructions:</p>
              <p className="text-sm text-gray-700">{order.specialInstructions}</p>
            </div>
          )}

          {/* Total */}
          <div className="text-right text-lg font-bold border-t border-gray-300 pt-4">
            Total: ₹{order?.totalPrice || "0.00"}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 bg-gray-100 no-print">
          <p className="text-sm text-gray-600">
            Thank you for dining with us! We hope to see you again soon.
          </p>
        </div>

        {/* Print Button */}
        <div className="text-center py-4 bg-white no-print">
          <button
            onClick={handlePrint}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Print Bill
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
              background: white;
            }

            #bill-container {
              box-shadow: none;
              background: white;
              border: none;
              padding: 0;
            }

            #bill-container .rounded-lg {
              border-radius: 0 !important;
            }

            #bill-container .bg-gray-50 {
              background-color: white !important;
            }

            #bill-container .bg-gray-100 {
              background-color: white !important;
            }

            .no-print {
              display: none !important;
            }

            #bill-container .hover\\:bg-gray-100 {
              background-color: white !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PrintBill;