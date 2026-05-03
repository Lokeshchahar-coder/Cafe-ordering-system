
import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const ORDER_DB_URL = "https://check-18079-default-rtdb.firebaseio.com/ff";

const normalizeStatus = (value, fallback = "pending") =>
  typeof value === "string" && value.trim()
    ? value.trim().toLowerCase()
    : fallback;

const formatLabel = (value) =>
  String(value || "-")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const isPaid = (order) => normalizeStatus(order.paymentStatus) === "paid";
const isCashOrder = (order) => normalizeStatus(order.paymentMethod) === "cash";

const mergeOrderById = (orders, nextOrder) => {
  if (!nextOrder?.id) {
    return orders;
  }

  const existingIndex = orders.findIndex((order) => order.id === nextOrder.id);
  if (existingIndex === -1) {
    return [nextOrder, ...orders];
  }

  return orders.map((order) =>
    order.id === nextOrder.id ? { ...order, ...nextOrder } : order
  );
};

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [filter, setFilter] = useState("today"); // Set default filter to "today"
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editStatus, setEditStatus] = useState("pending");
  const [savingEdit, setSavingEdit] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${ORDER_DB_URL}.json`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }
      const data = await response.json();

      const formattedData = Object.entries(data || {})
        .map(([id, order]) => ({
          id,
          ...order,
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      if (formattedData.length > 0) {
        const latestOrder = formattedData[0];
        if (lastOrderId !== latestOrder.id) {
          const latestIsCash = isCashOrder(latestOrder);
          const latestIsPaid = isPaid(latestOrder);
          setSnackbar({
            open: true,
            message: latestIsCash && !latestIsPaid
              ? `New cash order from table ${latestOrder.tableNumber || "-"} awaiting payment.`
              : `New order from table ${latestOrder.tableNumber || "-"}.`,
            severity: latestIsCash && !latestIsPaid ? "warning" : "info",
          });
          setLastOrderId(latestOrder.id);
        }
      }

      setOrders(formattedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to load orders. Please try again later.",
        severity: "error",
      });
    }
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const getFilteredOrders = () => {
    const now = new Date();

    switch (filter) {
      case "today":
        return orders.filter((order) => {
          const orderDate = new Date(order.timestamp);
          return (
            orderDate.getDate() === now.getDate() &&
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        });
      case "last7":
        return orders.filter((order) => {
          const orderDate = new Date(order.timestamp);
          const diffTime = now - orderDate;
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        });
      case "completed":
        return orders.filter(
          (order) => ["completed", "ready"].includes(normalizeStatus(order.status))
        );
      case "pending":
        return orders.filter(
          (order) =>
            normalizeStatus(order.paymentStatus) !== "paid" ||
            ["pending", "pending_payment"].includes(normalizeStatus(order.status))
        );
      default:
        return orders;
    }
  };

  const getPaginatedOrders = () => {
    const startIndex = currentPage * rowsPerPage;
    return getFilteredOrders().slice(startIndex, startIndex + rowsPerPage);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Fetch every 5 seconds
    const handleStorageChange = (event) => {
      if (event.key === "latestPlacedOrder" && event.newValue) {
        try {
          const latestPlacedOrder = JSON.parse(event.newValue);
          const fullOrder = latestPlacedOrder?.orderData
            ? {
                id:
                  latestPlacedOrder.id ||
                  latestPlacedOrder.orderData.id ||
                  `local-${Date.now()}`,
                ...latestPlacedOrder.orderData,
                timestamp:
                  latestPlacedOrder.orderData.timestamp || latestPlacedOrder.timestamp,
              }
            : null;

          if (fullOrder) {
            setOrders((prevOrders) => mergeOrderById(prevOrders, fullOrder));
            setLoading(false);
            setLastOrderId(fullOrder.id);
            setSnackbar({
              open: true,
              message:
                fullOrder.paymentMethod === "cash" &&
                normalizeStatus(fullOrder.paymentStatus) !== "paid"
                  ? `New cash order from table ${fullOrder.tableNumber || "-"} awaiting payment.`
                  : `New order from table ${fullOrder.tableNumber || "-"}.`,
              severity:
                fullOrder.paymentMethod === "cash" &&
                normalizeStatus(fullOrder.paymentStatus) !== "paid"
                  ? "warning"
                  : "info",
            });
          }
        } catch (_error) {
          fetchOrders();
        }
      }
    };

    const latestPlacedOrder = localStorage.getItem("latestPlacedOrder");
    if (latestPlacedOrder) {
      handleStorageChange({ key: "latestPlacedOrder", newValue: latestPlacedOrder });
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval); // Clear interval on component unmount
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [lastOrderId]);

  const filteredOrders = getFilteredOrders();
  const paginatedOrders = getPaginatedOrders();
  const pendingCashOrders = orders.filter(
    (order) => isCashOrder(order) && !isPaid(order)
  ).length;

  const handlePrint = (order) => {
    navigate("/bill", { state: { order } });
  };

  const startEditOrder = (order) => {
    setEditingOrderId(order.id);
    setEditStatus(normalizeStatus(order.status));
  };

  const cancelEditOrder = () => {
    setEditingOrderId(null);
    setEditStatus("pending");
  };

  const saveOrderEdit = async (orderId) => {
    try {
      setSavingEdit(true);
      const response = await fetch(`${ORDER_DB_URL}/${orderId}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: editStatus } : order
        )
      );

      setSnackbar({
        open: true,
        message: "Order updated successfully.",
        severity: "success",
      });
      cancelEditOrder();
    } catch (_error) {
      setSnackbar({
        open: true,
        message: "Failed to update order.",
        severity: "error",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const approveCashPayment = async (order) => {
    try {
      setSavingEdit(true);
      const response = await fetch(`${ORDER_DB_URL}/${order.id}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: "paid",
          status: "preparing",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve payment");
      }

      setOrders((prevOrders) =>
        prevOrders.map((existingOrder) =>
          existingOrder.id === order.id
            ? {
                ...existingOrder,
                paymentStatus: "paid",
                status: "preparing",
              }
            : existingOrder
        )
      );

      setSnackbar({
        open: true,
        message: "Payment approved and order sent to kitchen.",
        severity: "success",
      });
    } catch (_error) {
      setSnackbar({
        open: true,
        message: "Failed to approve payment.",
        severity: "error",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Panel</h2>
        <div
          className="p-4 hover:bg-indigo-700 cursor-pointer rounded-md"
          onClick={() => navigateTo("/admin")}
        >
          Orders
        </div>
        <div
          className="p-4 hover:bg-indigo-700 cursor-pointer rounded-md"
          onClick={() => navigateTo("/manage-menu")}
        >
          Menu
        </div>

        <div
          className="p-4 hover:bg-indigo-700 cursor-pointer rounded-md"
          onClick={() => navigateTo("/orders")}
        >
          Kitchen
        </div>

        <button
          className="mt-auto p-4 bg-red-600 hover:bg-red-700 rounded-md text-left"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <h3 className="text-3xl font-semibold mb-4">Today's Orders</h3>

        {pendingCashOrders > 0 && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800">
            {pendingCashOrders} cash order{pendingCashOrders > 1 ? "s" : ""} awaiting payment approval.
          </div>
        )}

        {/* Filter and Rows Per Page */}
        <div className="flex items-center justify-between mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Orders</option>
            <option value="today">Today’s Orders</option>
            <option value="last7">Last 7 Days</option>
            <option value="completed">Completed Orders</option>
            <option value="pending">Pending Orders</option>
          </select>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="p-2 border rounded-md"
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center mt-6">
            <span>Loading...</span>
          </div>
        ) : filteredOrders.length > 0 ? (
          <>
            {/* Orders Table */}
            <div className="max-h-[400px] overflow-y-auto shadow-md bg-white rounded-lg">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-4 py-2">Table Number</th>
                    <th className="px-4 py-2">Vehicle Number</th>
                    <th className="px-4 py-2">Payment Method</th>
                    <th className="px-4 py-2">Payment Status</th>
                    <th className="px-4 py-2">Total Price</th>
                    <th className="px-4 py-2">Items</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={`border-b hover:bg-gray-100 ${
                        !isPaid(order) && isCashOrder(order)
                          ? "bg-amber-50"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-2">{order.tableNumber || "-"}</td>
                      <td className="px-4 py-2">{order.vehicleNumber || "N/A"}</td>
                      <td className="px-4 py-2">{formatLabel(order.paymentMethod)}</td>
                      <td className="px-4 py-2">{formatLabel(order.paymentStatus)}</td>
                      <td className="px-4 py-2">₹{order.totalPrice}</td>
                      <td className="px-4 py-2">
                        {order.cartItems?.map((item, index) => (
                          <div key={item.id || index}>
                            {item.name} x {item.qty} (₹{item.price * item.qty})
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(order.timestamp).toLocaleString()}
                      </td>
                      <td
                        className={`px-4 py-2 ${
                          ["completed", "ready"].includes(normalizeStatus(order.status))
                            ? "text-green-600"
                            : normalizeStatus(order.status) === "preparing"
                            ? "text-amber-600"
                            : "text-gray-600"
                        }`}
                      >
                        {editingOrderId === order.id ? (
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="border rounded-md px-2 py-1 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          formatLabel(order.status)
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-2">
                          {!isPaid(order) && isCashOrder(order) && (
                            <button
                              onClick={() => approveCashPayment(order)}
                              disabled={savingEdit}
                              className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-60"
                            >
                              {savingEdit ? "Working..." : "Payment Done"}
                            </button>
                          )}
                          <button
                            onClick={() => handlePrint(order)}
                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Print
                          </button>
                          {editingOrderId === order.id ? (
                            <>
                              <button
                                onClick={() => saveOrderEdit(order.id)}
                                disabled={savingEdit}
                                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
                              >
                                {savingEdit ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={cancelEditOrder}
                                disabled={savingEdit}
                                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-60"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => startEditOrder(order)}
                              className="px-3 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-gray-500 text-white rounded-md mx-2 hover:bg-gray-600"
              >
                Previous
              </button>
              <span className="px-4 py-2">{currentPage + 1}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage + 1 >= Math.ceil(filteredOrders.length / rowsPerPage)
                }
                className="px-4 py-2 bg-gray-500 text-white rounded-md mx-2 hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div>No orders available for today.</div>
        )}
      </div>
    </div>
  );
};

export default Admin;