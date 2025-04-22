import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { FiRefreshCw, FiPackage, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (token) {
      loadOrderData();
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'order placed':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'order placed':
        return <FiClock className="mr-1" />;
      case 'processing':
        return <FiPackage className="mr-1" />;
      case 'shipped':
        return <FiTruck className="mr-1" />;
      case 'delivered':
        return <FiCheckCircle className="mr-1" />;
      default:
        return <FiPackage className="mr-1" />;
    }
  };

  const loadOrderData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.post(
        backendUrl + '/api/order/userorders', 
        {}, 
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (!token) {
    return (
      <div className="border-t pt-16 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Title text1="MY" text2="ORDERS" />
        <p className="text-gray-600 mt-4 mb-6 text-lg">Please log in to view and place orders.</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="text-white px-6 py-3 rounded-md text-sm font-medium bg-orange-400 hover:bg-orange-200 transition-colors"
        >
          Log In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border-t pt-16 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-16 pb-12 min-h-[60vh] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-2xl mb-8">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </h2>
        <button 
          onClick={() => loadOrderData(true)}
          className="flex items-center text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
          disabled={refreshing}
        >
          <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FiPackage className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            You haven't placed any orders. Start shopping to see your orders here!
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-6 bg-black text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, orderIndex) => (
            <div 
              key={orderIndex} 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-6 bg-white">
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b">
                  <div>
                    <span className="text-sm text-gray-500 mr-2">Order ID:</span>
                    <span className="font-semibold">{order.orderId || order._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`flex items-center text-sm ${getStatusColor(order.status)} text-white px-3 py-1 rounded-full`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                    
                    {order.refundStatus === 'Issued' && (
                      <span className="ml-2 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        Refund Issued
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="mb-4">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-4 sm:gap-6 mb-4 pb-4 border-b last:border-b-0 last:mb-0 last:pb-0">
                      <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border">
                        <img 
                          className="w-full h-full object-cover" 
                          src={item.image?.url} 
                          alt={item.name} 
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-2">
                          <p>{currency}{item.price}</p>
                          <p>Qty: {item.quantity}</p>
                          {item.size && <p>Size: {item.size}</p>}
                          {item.category && <p>Category: {item.category}</p>}
                          {item.color && (
                            <div className="flex items-center">
                              <span className="mr-1">Color:</span>
                              <span 
                                className="w-4 h-4 rounded-full border border-gray-200 inline-block"
                                style={{ backgroundColor: item.color }}
                                title={item.color}
                              ></span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">{currency}{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Details */}
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <div className="text-sm text-gray-600">
                      <p>{order.address.firstName} {order.address.lastName}</p>
                      <p>{order.address.street}</p>
                      <p>{order.address.city}, {order.address.state}, {order.address.zipcode}</p>
                      <p>{order.address.country}</p>
                      <p>Phone: {order.address.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Order Information</h4>
                    <div className="text-sm text-gray-600">
                      <p>Date: {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                      <p>Payment Method: {order.paymentMethod}</p>
                      
                      {order.couponCode && (
                        <p>Coupon: {order.couponCode} {order.discount > 0 ? `(${order.discount}% off)` : ''}</p>
                      )}
                      
                      {/* Payment Details */}
                      <div className="mt-4 pt-3 border-t">
                        <div className="flex justify-between mb-1">
                          <span>Total Amount:</span>
                          <span className="font-medium">{currency}{order.amount}</span>
                        </div>
                        
                        {order.paymentMethod === "COD" ? (
                          <>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Platform Fee:</span>
                              <span>{currency}{order.platformFee || 0}</span>
                            </div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Shipping Fee:</span>
                              <span>{currency}{order.shippingFee || 0}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>Paid Amount (Booking):</span>
                              <span>{currency}{order.paidAmount || order.TotalFees || 0}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Due on Delivery:</span>
                              <span>{currency}{order.dueAmount || (order.amount - (order.paidAmount || order.TotalFees || 0))}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between font-semibold">
                            <span>Payment Status:</span>
                            <span className="text-green-600">{order.payment ? "Paid" : "Pending"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
