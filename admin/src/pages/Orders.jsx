import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        { searchQuery },
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
        console.log(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (orderId, status) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success(`Order status updated to ${status}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const ColorIndicator = ({ color }) => (
    <div className="flex items-center gap-1.5">
      <div
        className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
        style={{
          backgroundColor: color?.hex || "#000000",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      />
      <span className="text-xs text-gray-600 capitalize">
        {color?.name || "Black"}
      </span>
    </div>
  );

  // Helper function to display category badges
  const CategoryBadge = ({ category, subCategory }) => {
    if (!category && !subCategory) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {category && (
          <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
            {category}
          </span>
        )}
        {subCategory && (
          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
            {subCategory}
          </span>
        )}
      </div>
    );
  };

  // Helper function to display payment details
  const PaymentDetails = ({ order }) => {
    if (order.paymentMethod === "COD") {
      return (
        <div className="space-y-1">
          <p className="text-xs text-gray-600">
            <span className="font-medium">Total Amount:</span> {currency}
            {order.amount}
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-medium">Paid (Booking):</span> {currency}
            {order.paidAmount || order.TotalFees || 0}
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-medium">Due on Delivery:</span> {currency}
            {order.dueAmount || (order.amount - (order.paidAmount || order.TotalFees || 0))}
          </p>
        </div>
      );
    } else {
      return (
        <p className="text-xs text-gray-600">
          <span className="font-medium">Full Payment:</span> {currency}
          {order.amount}
        </p>
      );
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Order Management
      </h3>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={fetchAllOrders}
            className="absolute right-3 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Desktop Table Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
          <div className="col-span-1">Order</div>
          <div className="col-span-4">Items & Details</div>
          <div className="col-span-2">Information</div>
          <div className="col-span-1">Amount</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Actions</div>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}

        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Desktop View */}
            <div className="hidden lg:grid grid-cols-12 gap-4 p-4 items-start">
              <div className="col-span-1 flex flex-col items-center">
                <img
                  className="w-10 h-10 object-contain"
                  src={assets.parcel_icon}
                  alt="order"
                />
                <div className="mt-2 text-xs font-bold">
                  #{order.orderId || order._id.slice(-6).toUpperCase()}
                </div>
              </div>

              <div className="col-span-4">
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-3">
                        {item.image?.url && (
                          <img
                            src={item.image.url}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded border border-gray-200"
                          />
                        )}

                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            {item.color && (
                              <ColorIndicator color={item.color} />
                            )}
                            {item.size && item.size !== "one-size" && (
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                          {/* Add Category and Subcategory */}
                          <CategoryBadge 
                            category={item.category} 
                            subCategory={item.subCategory} 
                          />
                        </div>
                      </div>
                      <span className="whitespace-nowrap font-medium">
                        {currency}
                        {item.price} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="font-semibold">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-gray-600">
                    {order.address.street}, {order.address.city}
                  </p>
                  <p className="text-gray-600">
                    {order.address.state}, {order.address.country},{" "}
                    {order.address.zipcode}
                  </p>
                  <p className="text-gray-600">Phone: {order.address.phone}</p>
                </div>
              </div>

              <div className="col-span-2 space-y-2 text-sm">
                <p>
                  <span className="font-medium">Items:</span>{" "}
                  {order.items.length}
                </p>
                <p>
                  <span className="font-medium">Method:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p
                  className={`font-medium ${
                    order.payment ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  Payment: {order.payment ? "Completed" : "Pending"}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.date).toLocaleDateString()}
                </p>
                {/* Added Coupon and Discount */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {order.couponCode ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Coupon: {order.couponCode}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">No coupon</span>
                  )}
                  {order.discount > 0 ? (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Discount: {order.discount}%
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">No discount</span>
                  )}
                </div>
                {/* Refund Status */}
                {order.refundStatus && order.refundStatus !== 'Not Applicable' && (
                  <p className="text-sm mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.refundStatus === 'Issued' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Refund: {order.refundStatus}
                    </span>
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <p className="font-bold text-lg mb-2">
                  {currency}
                  {order.amount}
                </p>
                {order.paymentMethod === "COD" && (
                  <PaymentDetails order={order} />
                )}
              </div>

              <div className="col-span-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "Order Placed"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Processing"
                      ? "bg-purple-100 text-purple-800"
                      : order.status === "Shipped"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="col-span-2">
                <select
                  onChange={(e) => statusHandler(order.orderId || order._id, e.target.value)}
                  value={order.status}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Deleted">Deleted</option>
                </select>
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <img
                    className="w-8 h-8 object-contain"
                    src={assets.parcel_icon}
                    alt="order"
                  />
                  <span className="font-bold">
                    #{order.orderId || order._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === "Order Placed"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Processing"
                      ? "bg-purple-100 text-purple-800"
                      : order.status === "Shipped"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-800">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-3">
                        {item.image?.url && (
                          <img
                            src={item.image.url}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded border border-gray-200"
                          />
                        )}
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {item.color && (
                              <ColorIndicator color={item.color} />
                            )}
                            {item.size && item.size !== "one-size" && (
                              <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                          {/* Add Category and Subcategory for mobile */}
                          <CategoryBadge 
                            category={item.category} 
                            subCategory={item.subCategory} 
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {currency}
                          {item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-800 text-sm">Customer</h4>
                  <p className="text-sm">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{order.address.phone}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-gray-800 text-sm">Payment</h4>
                  <p className="text-sm">{order.paymentMethod}</p>
                  <p
                    className={`text-sm font-medium ${
                      order.payment ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {order.payment ? "Paid" : "Pending"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-800 text-sm">Shipping</h4>
                  <p className="text-sm text-gray-600">
                    {order.address.city}, {order.address.state}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.address.country}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-gray-800 text-sm">
                    Order Total
                  </h4>
                  <p className="text-lg font-bold">
                    {currency}
                    {order.amount}
                  </p>
                  
                  {order.paymentMethod === "COD" && (
                    <div className="space-y-1 mt-2">
                      <p className="text-xs font-medium">
                        Paid: {currency}{order.paidAmount || order.TotalFees || 0}
                      </p>
                      <p className="text-xs font-medium">
                        Due: {currency}{order.dueAmount || (order.amount - (order.paidAmount || order.TotalFees || 0))}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    {new Date(order.date).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Added Coupon and Discount for Mobile */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-800 text-sm">Coupon</h4>
                  <p className="text-sm">
                    {order.couponCode || (
                      <span className="text-gray-400">None</span>
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-800 text-sm">Discount</h4>
                  <p className="text-sm">
                    {order.discount > 0 ? (
                      <span className="text-green-600">
                        {order.discount}% off
                      </span>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Refund Status Mobile */}
              {order.refundStatus && order.refundStatus !== 'Not Applicable' && (
                <div className="mt-2">
                  <h4 className="font-bold text-gray-800 text-sm">Refund Status</h4>
                  <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                    order.refundStatus === 'Issued' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.refundStatus}
                  </span>
                </div>
              )}

              <select
                onChange={(e) => statusHandler(order.orderId || order._id, e.target.value)}
                value={order.status}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
