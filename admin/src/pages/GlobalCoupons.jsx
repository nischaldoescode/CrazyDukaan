import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { backendUrl } from "../App";

const GlobalCoupons = ({ token }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form data state
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  
  // Get today's date in YYYY-MM-DD format for date input min attribute
  const today = new Date().toISOString().split('T')[0];

  // Fetch all global coupons
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/global-coupon/list`, {
        headers: { token },
      });
      
      if (res.data.success) {
        setCoupons(res.data.coupons);
      } else {
        setError(res.data.message || 'Failed to fetch coupons');
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new global coupon
  const createCoupon = async (e) => {
    e.preventDefault();
    
    // Validate coupon code doesn't contain spaces
    if (code.includes(' ')) {
      setError('Coupon code cannot contain spaces');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const res = await axios.post(
        `${backendUrl}/api/global-coupon/create`,
        { code, discount, expiresAt },
        { headers: { token } }
      )
      
      if (res.data.success) {
        setSuccess(res.data.message || 'Coupon created successfully');
        fetchCoupons(); // Refresh coupon list
        
        // Reset form
        setCode('');
        setDiscount('');
        setExpiresAt('');
      } else {
        setError(res.data.message || 'Failed to create coupon');
      }
    } catch (err) {
      console.error('Error creating coupon:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };
  
  // Prepare to delete a coupon (show modal)
  const prepareDeleteCoupon = (id) => {
    setCouponToDelete(id);
    setShowDeleteModal(true);
  };
  
  // Confirm delete coupon
  const confirmDeleteCoupon = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const res = await axios.post(
        `${backendUrl}/api/global-coupon/delete`,
        { id: couponToDelete },
        { headers: { token } }
      );
      
      if (res.data.success) {
        setSuccess(res.data.message || 'Coupon deleted successfully');
        fetchCoupons(); // Refresh coupon list
      } else {
        setError(res.data.message || 'Failed to delete coupon');
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setCouponToDelete(null);
    }
  };
  
  // Cancel delete coupon
  const cancelDeleteCoupon = () => {
    setShowDeleteModal(false);
    setCouponToDelete(null);
  };
  
  // Toggle coupon active status
  const toggleCoupon = async (id) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const res = await axios.post(
        `${backendUrl}/api/global-coupon/toggle`,
        { id },
        { headers: { token } }
      );
      
      if (res.data.success) {
        setSuccess(res.data.message || 'Coupon status updated');
        fetchCoupons(); // Refresh coupon list
      } else {
        setError(res.data.message || 'Failed to update coupon status');
      }
    } catch (err) {
      console.error('Error toggling coupon:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No expiration';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle coupon code input change (no spaces allowed)
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    setCode(value.toUpperCase());
  };
  
  // Load coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, [token]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        <span className="text-blue-600">GLOBAL</span> <span className="text-gray-800">COUPONS</span>
      </h1>
      
      {/* Error and success messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {success}
        </div>
      )}
      
      {/* Create coupon form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Global Coupon</h2>
        
        <form onSubmit={createCoupon} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code*
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              className="w-full border border-gray-300 rounded-md p-2 uppercase"
              placeholder="e.g. SUMMER2025"
              required
              pattern="\S+"
              title="No spaces allowed in coupon code"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Percentage*
            </label>
            <select
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select discount</option>
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="15">15%</option>
              <option value="20">20%</option>
              <option value="25">25%</option>
              <option value="30">30%</option>
              <option value="40">40%</option>
              <option value="50">50%</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Expiry date (optional)"
              min={today}
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Coupons list */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">All Global Coupons</h2>
        
        {loading && <p>Loading coupons...</p>}
        
        {!loading && coupons.length === 0 && (
          <p className="text-gray-500">No global coupons found. Create your first one above.</p>
        )}
        
        {coupons.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Code</th>
                  <th className="py-3 px-4 text-left">Discount</th>
                  <th className="py-3 px-4 text-left">Expiry Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Created At</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{coupon.code}</td>
                    <td className="py-3 px-4">{coupon.discount}%</td>
                    <td className="py-3 px-4">{formatDate(coupon.expiresAt)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{formatDate(coupon.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleCoupon(coupon._id)}
                          className={`p-1 rounded-md ${
                            coupon.active ? 'text-green-600 hover:bg-green-100' : 'text-gray-500 hover:bg-gray-100'
                          }`}
                          title={coupon.active ? 'Deactivate Coupon' : 'Activate Coupon'}
                        >
                          {coupon.active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                        </button>
                        
                        <button
                          onClick={() => prepareDeleteCoupon(coupon._id)}
                          className="text-red-600 p-1 rounded-md hover:bg-red-100"
                          title="Delete Coupon"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this coupon? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDeleteCoupon}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCoupon}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalCoupons;