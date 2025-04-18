import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaTrash, FaGlobe, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { MdEmail, MdCake, MdPeople, MdDeleteForever } from 'react-icons/md';
import { GiConfirmed } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import './Users.css';
import { FaVenus, FaMars, FaGenderless } from 'react-icons/fa';
import { backendUrl } from '../App';

const AdminPanel = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get gender icon with styling
  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return <FaMars className="gender-icon male" />;
      case 'female':
        return <FaVenus className="gender-icon female" />;
      default:
        return <FaGenderless className="gender-icon other" />;
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(backendUrl + '/api/user/admin/users', {
        headers: { token }
      });
      setUsers(response.data?.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    try {
      await axios.delete(backendUrl +`/api/user/admin/users/${userToDelete}`, {
        headers: { token }
      });
      setShowDeleteModal(false);
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Filter users based on search term
  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (!user) return false;
    return (
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.ipAddress || '').includes(searchTerm)
    );
  }) : [];

  // Fetch users on mount and when token changes
  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      setError('Authentication token is required');
      setLoading(false);
    }
  }, [token]);

  return (
    <motion.div 
      className="admin-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="admin-header">
        <div className="header-content">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold"
          >
            User Management
          </motion.h1>
          
          <button 
            className="mobile-menu-toggle md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
        
        <motion.div 
          className={`header-actions ${isMobileMenuOpen ? 'mobile-open' : ''} ${windowWidth > 768 ? 'flex' : 'hidden md:flex'}`}
          initial={false}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 'fit-content',
            opacity: isMobileMenuOpen || windowWidth > 768 ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="search-box"
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
          >
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search users"
              className="w-full md:w-64 lg:w-80"
            />
          </motion.div>
        </motion.div>
      </header>

      <main className="admin-content px-4 lg:px-8">
        {loading ? (
          <motion.div 
            className="loading-spinner"
            animate={{ 
              rotate: 360,
              transition: { 
                repeat: Infinity, 
                duration: 1,
                ease: "linear"
              }
            }}
          >
            <div className="spinner-circle"></div>
            <div>Loading users...</div>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="error-message"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {error}
          </motion.div>
        ) : (
          <div className="users-table-container w-full max-w-screen-2xl mx-auto">
            <div className="table-header">
              <h2 className="text-xl md:text-2xl font-semibold">
                <MdPeople className="inline mr-2" /> Registered Users ({filteredUsers.length})
              </h2>
            </div>
            
            <div className="users-table-wrapper w-full overflow-x-auto">
              <table className="users-table w-full">
                <thead>
                  <tr className="table-header-row">
                    <th className="name-cell">Name</th>
                    <th className="email-cell">Email</th>
                    <th className="gender-cell">Gender</th>
                    <th className="age-cell">Age/DOB</th>
                    {windowWidth > 600 && <th className="ip-cell">IP Address</th>}
                    <th className="action-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={windowWidth > 600 ? 6 : 5} className="no-users">
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          No users found
                        </motion.div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        className="user-row"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{ 
                          scale: 1.01,
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                        }}
                      >
                        <td className="name-cell" data-label="Name">
                          <FaUser className="inline mr-2" /> {user.name || 'N/A'}
                        </td>
                        <td className="email-cell" data-label="Email">
                          <MdEmail className="inline mr-2" /> {user.email || 'N/A'}
                        </td>
                        <td className="gender-cell" data-label="Gender">
                          {getGenderIcon(user.gender)}
                        </td>
                        <td className="age-cell" data-label="Age/DOB">
                          <MdCake className="inline mr-2" /> {calculateAge(user.dob)} yrs
                          {windowWidth > 480 && (
                            <div className="dob text-sm text-gray-600">{formatDate(user.dob)}</div>
                          )}
                        </td>
                        {windowWidth > 600 && (
                          <td className="ip-cell" data-label="IP Address">
                            <FaGlobe className="inline mr-2" /> {user.ipAddress || 'N/A'}
                          </td>
                        )}
                        <td className="action-cell" data-label="Actions">
                          <motion.button
                            onClick={() => {
                              setUserToDelete(user._id);
                              setShowDeleteModal(true);
                            }}
                            className="delete-button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Delete user ${user.name}`}
                          >
                            <FaTrash />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              className="delete-modal max-w-md w-full md:w-1/2 lg:w-1/3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <MdDeleteForever size={24} className="text-red-500" />
                <h3 className="text-xl font-semibold">Confirm Deletion</h3>
              </div>
              <div className="modal-body">
                <p className="mb-2">Are you sure you want to delete this user? This action cannot be undone.</p>
                <p className="text-sm text-gray-600">All user data including email, name, DOB, and IP will be permanently removed.</p>
              </div>
              <div className="modal-actions">
                <motion.button
                  onClick={() => setShowDeleteModal(false)}
                  className="cancel-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDeleteUser}
                  className="confirm-delete-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GiConfirmed className="inline mr-1" /> Delete Permanently
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminPanel;