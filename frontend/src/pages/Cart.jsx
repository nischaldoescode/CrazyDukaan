import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";
import "./Cart.css";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    removeCartItem,
    setCartItems,
    backendUrl,
    token,
  } = useContext(ShopContext);
  
  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  
  const location = useLocation();
  const hasShownDeletedToast = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const tempData = [];
    for (const productId in cartItems) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;

      for (const variantKey in cartItems[productId]) {
        const variant = cartItems[productId][variantKey];
        if (variant?.quantity > 0) {
          tempData.push({
            _id: productId,
            size: variant.size,
            color: variant.color,
            quantity: variant.quantity,
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems, products]);

  // Calculate total items and total price
  const getTotalItems = () => {
    return cartData.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartData.reduce((total, item) => {
      const product = products.find(p => p._id === item._id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleProceedToCheckout = () => {
    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login", { state: { from: location.pathname } });
    } else {
      const formattedCartItems = Object.keys(cartItems).flatMap((productId) => {
        const productVariants = cartItems[productId];
        return Object.keys(productVariants).map((variantKey) => ({
          productId,
          size: productVariants[variantKey].size,
          color: productVariants[variantKey].color,
          quantity: productVariants[variantKey].quantity,
        }));
      });

      navigate("/place-order", {
        state: { cartItems: formattedCartItems },
      });
    }
  };

  const handleRemoveItem = async (itemId, variantKey) => {
    setIsLoading(true);
    try {
      await removeCartItem(itemId, variantKey);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (itemId, variantKey, productName) => {
    setItemToDelete({ itemId, variantKey, productName });
    setShowDeleteModal(true);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast.warning("Please select items to delete");
      return;
    }

    setIsLoading(true);
    try {
      for (const itemKey of selectedItems) {
        const [itemId, variantKey] = itemKey.split('|');
        await removeCartItem(itemId, variantKey);
      }
      setSelectedItems(new Set());
      setSelectAll(false);
      toast.success("Selected items removed successfully");
    } catch (error) {
      toast.error("Failed to remove selected items");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const allItemKeys = cartData.map(item => `${item._id}|${item.size}-${item.color}`);
      setSelectedItems(new Set(allItemKeys));
    }
    setSelectAll(!selectAll);
  };

  const toggleItemSelection = (itemId, variantKey) => {
    const itemKey = `${itemId}|${variantKey}`;
    const newSelected = new Set(selectedItems);
    
    if (newSelected.has(itemKey)) {
      newSelected.delete(itemKey);
    } else {
      newSelected.add(itemKey);
    }
    
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === cartData.length);
  };

  const renderCartItems = () => {
    return cartData.map((item, index) => {
      const productData = products.find((product) => product._id === item._id);
      const itemKey = `${item._id}|${item.size}-${item.color}`;
      const isSelected = selectedItems.has(itemKey);

      if (!productData) return null;

      return (
        <div
          key={index}
          className={`py-3 sm:py-4 border-b border-gray-200 transition-all duration-200 ${
            isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
          }`}
        >
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="flex items-start gap-3 p-3">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleItemSelection(item._id, `${item.size}-${item.color}`)}
                className="mt-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              
              {/* Product Image */}
              <img
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0"
                src={productData.image[0].url}
                alt={productData.name}
              />
              
              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {productData.name}
                </h3>
                
                <div className="mt-1 space-y-1">
                  <p className="text-lg font-semibold text-gray-900">
                    {currency}{productData.price}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.size && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border">
                        Size: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <div className="inline-flex items-center gap-1">
                        <span className="text-xs text-gray-500">Color:</span>
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.color }}
                          title={item.color}
                        />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Category: <span className="text-gray-700">{productData.category}</span>
                  </p>
                </div>
                
                {/* Quantity Controls */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(
                              item._id,
                              `${item.size}-${item.color}`,
                              item.quantity - 1
                            )
                          : null
                      }
                      className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" || e.target.value === "0"
                            ? 1
                            : Number(e.target.value);
                        updateQuantity(item._id, `${item.size}-${item.color}`, value);
                      }}
                      className="w-12 px-2 py-1 text-center border-0 focus:ring-0"
                      min={1}
                    />
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          `${item.size}-${item.color}`,
                          item.quantity + 1
                        )
                      }
                      className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => confirmDelete(item._id, `${item.size}-${item.color}`, productData.name)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <img
                      className="w-5 h-5"
                      src={assets.bin_icon}
                      alt="Remove item"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:grid sm:grid-cols-[auto_4fr_2fr_1fr_auto] items-center gap-4 px-4">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleItemSelection(item._id, `${item.size}-${item.color}`)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            
            {/* Product Info */}
            <div className="flex items-center gap-4">
              <img
                className="w-20 h-20 rounded-lg object-cover"
                src={productData.image[0].url}
                alt={productData.name}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-medium text-gray-900 truncate">
                  {productData.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  Category: {productData.category}
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {item.size && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Size: {item.size}
                    </span>
                  )}
                  {item.color && (
                    <div className="inline-flex items-center gap-1">
                      <span className="text-xs text-gray-500">Color:</span>
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: item.color }}
                        title={item.color}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Price */}
            <div className="text-lg font-semibold text-gray-900">
              {currency}{productData.price}
            </div>
            
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() =>
                  item.quantity > 1
                    ? updateQuantity(
                        item._id,
                        `${item.size}-${item.color}`,
                        item.quantity - 1
                      )
                    : null
                }
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const value =
                    e.target.value === "" || e.target.value === "0"
                      ? 1
                      : Number(e.target.value);
                  updateQuantity(item._id, `${item.size}-${item.color}`, value);
                }}
                className="w-16 px-2 py-2 text-center border-0 focus:ring-0"
                min={1}
              />
              <button
                onClick={() =>
                  updateQuantity(
                    item._id,
                    `${item.size}-${item.color}`,
                    item.quantity + 1
                  )
                }
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={() => confirmDelete(item._id, `${item.size}-${item.color}`, productData.name)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
            >
              <img
                className="w-6 h-6"
                src={assets.bin_icon}
                alt="Remove item"
              />
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Title text1={"YOUR"} text2={"CART"} />
          {cartData.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-600">
                {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart
              </p>
              
              {/* Bulk Actions */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Select All
                </label>
                
                {selectedItems.size > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    disabled={isLoading}
                    className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Delete Selected ({selectedItems.size})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {cartData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <button
                onClick={() => navigate('/collection')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Desktop Header */}
                <div className="hidden sm:grid sm:grid-cols-[auto_4fr_2fr_1fr_auto] gap-4 px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
                  <div></div>
                  <div>Product</div>
                  <div>Price</div>
                  <div>Quantity</div>
                  <div></div>
                </div>
                
                {renderCartItems()}
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium">{currency}{getTotalPrice()}</span>
                  </div>
                </div>
                
                <CartTotal />
                
                <button
                  onClick={handleProceedToCheckout}
                  disabled={isLoading}
                  className="w-full bg-black text-white text-sm font-medium py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'PROCEED TO CHECKOUT'}
                </button>
                
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate('/collection')}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Remove Item</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to remove "{itemToDelete?.productName}" from your cart?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemoveItem(itemToDelete.itemId, itemToDelete.variantKey)}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
