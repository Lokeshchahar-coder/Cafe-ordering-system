import React from "react";


const Checkout = () => {
  // Example order history data
  const orders = [
    { id: 1, name: "Onion Pizza", table: 5, price: "₹150", status: "Delivered" },
    { id: 2, name: "Cheese Burger", table: 8, price: "₹120", status: "Preparing" },
    { id: 3, name: "Pasta Alfredo", table: 3, price: "₹200", status: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400 to-blue-400 text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <button className="bg-white text-green-600 px-4 py-1 rounded hover:bg-gray-200 transition">
          Go Back
        </button>
      </div>

      <div className="container mx-auto px-4 mt-8 flex flex-wrap gap-8">
        {/* Order Summary */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/2">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="flex items-center gap-4">
            <img
              src="https://via.placeholder.com/80"
              alt="Onion Pizza"
              className="rounded"
            />
            <div>
              <p className="font-semibold">Onion Pizza</p>
              <p className="text-gray-600">₹150 x 1</p>
            </div>
            <p className="ml-auto font-bold text-gray-700">₹150</p>
          </div>
        </div>

        {/* Order History Section */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/2">
          <h2 className="text-lg font-bold mb-4">Track Your Order / Order History</h2>
          {orders.length > 0 ? (
            <ul>
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-semibold">{order.name}</p>
                    <p className="text-gray-500 text-sm">
                      Table {order.table} - {order.price}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      order.status === "Delivered"
                        ? "text-green-500"
                        : order.status === "Preparing"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">No orders found!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;