import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { FiRefreshCw, FiPackage, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { Helmet } from "react-helmet";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
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
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id, // Add order ID for reference
              category: item.category
            });
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  if (!token) {
    <Helmet>
    <title>Your Orders | Crazy Dukaan</title>
    <meta name="google-site-verification" content="Ge6IsUiKWA-SWtWQqAiihdEp-oczhyGYhtwewuGIYX4" />
    <meta name="description" content="View your order history and track recent purchases from Crazy Dukaan. Reliable fashion shopping with quick delivery and detailed tracking." />
    <meta name="keywords" content="Crazy Dukaan orders, order history, fashion delivery, online purchases, track orders, Crazy Dukaan tracking, view my orders" />
    <meta name="author" content="Crazy Dukaan" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="theme-color" content="#ffffff" />

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Your Orders | Crazy Dukaan" />
    <meta property="og:description" content="Access your order history and track your fashion purchases with Crazy Dukaan." />
    <meta property="og:url" content="https://www.crazydukaan.store/orders" />
    <meta property="og:image" content="https://res.cloudinary.com/dgia0ww1z/image/upload/v1744911085/zipkainysdn8qhlp0dix.png" />
    <meta property="og:site_name" content="Crazy Dukaan" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Your Orders | Crazy Dukaan" />
    <meta name="twitter:description" content="View and track your past purchases on Crazy Dukaan." />
    <meta name="twitter:image" content="https://res.cloudinary.com/dgia0ww1z/image/upload/v1744911085/zipkainysdn8qhlp0dix.png" />

    {/* Instagram (only basic impact via OG) */}
    <meta property="og:site" content="https://www.instagram.com/crazydukaan/" />
  </Helmet>
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
      <>
      <Helmet>
      <title>Your Orders | Crazy Dukaan - Dukaan In Your Hand</title>
      <meta name="description" content="View your All your order history and track recent purchases from Crazy Dukaan." />
      <meta name="keywords" content="Crazy Dukaan orders, order history, fashion delivery, online purchases, track orders, Crazy Dukaan tracking, view my orders, crazy dukaan history, crazy dukaan purchase" />
      <meta name="author" content="Crazy Dukaan" />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content="#ffffff" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Your Orders | Crazy Dukaan - Dukaan In your hand" />
      <meta property="og:description" content="View your All your order history and track recent purchases from Crazy Dukaan." />
      <meta property="og:url" content="https://www.crazydukaan.store/orders" />
      <meta property="og:image" content="https://res.cloudinary.com/dgia0ww1z/image/upload/v1744911085/zipkainysdn8qhlp0dix.png" />
      <meta property="og:site_name" content="Crazy Dukaan" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Your Orders | Crazy Dukaan - Dukaan in Your Hand" />
      <meta name="twitter:description" content="View your All your order history and track recent purchases from Crazy Dukaan." />
      <meta name="twitter:image" content="https://res.cloudinary.com/dgia0ww1z/image/upload/v1744911085/zipkainysdn8qhlp0dix.png" />

      {/* Instagram (only basic impact via OG) */}
      <meta property="og:site" content="https://www.instagram.com/crazydukaan.store" />
      <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
      <div className="border-t pt-16 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-2xl mb-8">
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="border-t pt-16 pb-12 min-h-[60vh] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-2xl mb-8">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          {orderData.length} {orderData.length === 1 ? 'Order' : 'Orders'}
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

      {orderData.length === 0 ? (
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
          {orderData.map((item, index) => (
            <div 
              key={index} 
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-6 bg-white">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image and Basic Info */}
                  <div className="flex-1 flex gap-4 sm:gap-6">
                    <div className="flex-shrink-0 w-20 h-27 sm:w-32 sm:h-32 rounded-md overflow-hidden border">
                      <img 
                        className="w-full h-full object-cover" 
                        src={item.image.url} 
                        alt={item.name} 
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-2">
                        <p>{currency}{item.price}</p>
                        <p>Qty: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                        <p>Category: {item.category}</p>
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
                      
                      <div className="text-xs text-gray-500">
                        <p>Ordered on: {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                        <p>Payment: {item.paymentMethod} • {item.payment ? 'Paid' : 'Pending'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status and Actions */}
                  <div className="md:w-48 flex flex-col justify-between">
                    <div className="flex items-center justify-between md:justify-end md:flex-col md:items-end gap-2">
                      <div className={`flex items-center text-sm ${getStatusColor(item.status)} text-white px-3 py-1 rounded-full`}>
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status}</span>
                      </div>
                      
                      <button 
                        className="text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors"
                        onClick={() => loadOrderData(true)}
                      >
                        Track Order
                      </button>
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
