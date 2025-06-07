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
    removeCartItem, // Add this import from context
    setCartItems,
    backendUrl,
    token,
  } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
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

  const handleProceedToCheckout = () => {
    // Check if the user is logged in
    if (!token) {
      toast.error("Please login to place an order"); // Show error toast if not logged in
      navigate("/login", { state: { from: location.pathname } });
    } else {
      // Flatten cartItems and map over the variants for each product
      const formattedCartItems = Object.keys(cartItems).flatMap((productId) => {
        const productVariants = cartItems[productId];
        return Object.keys(productVariants).map((variantKey) => ({
          productId,
          size: productVariants[variantKey].size,
          color: productVariants[variantKey].color,
          quantity: productVariants[variantKey].quantity,
        }));
      });

      // Navigate to place order with the formatted cart items
      navigate("/place-order", {
        state: { cartItems: formattedCartItems },
      });
    }
  };

  const handleRemoveItem = async (itemId, variantKey) => {
    try {
      // Use the dedicated removeCartItem function instead of updateQuantity
      await removeCartItem(itemId, variantKey);
      // Toast is now handled inside removeCartItem function
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const renderCartItems = () => {
    return cartData.map((item, index) => {
      const productData = products.find((product) => product._id === item._id);

      if (!productData) return null;

      return (
        <div
          key={index}
          className="py-4 border-t border-b text-gray-700 grid grid-cols-1 sm:grid-cols-[4fr_2fr_0.5fr] lg:grid-cols-[4fr_2fr_0.5fr] items-start sm:items-center gap-4"
        >
          {/* Product Info Section */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <img
              className="w-20 h-20 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover flex-shrink-0 mx-auto sm:mx-0"
              src={productData.image[0].url}
              alt=""
            />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm sm:text-base lg:text-lg font-medium mb-2">
                {productData.name}
              </p>
              <div className="space-y-2">
                <p className="font-semibold text-sm sm:text-base text-gray-700">
                  {currency}
                  {productData.price}
                </p>
                
                {/* Size and Color in same row on mobile, separate on desktop */}
                <div className="flex flex-col sm:flex-col gap-2">
                  {item.size && (
                    <p className="inline-block text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-md border border-gray-300 bg-gray-100 text-gray-600 w-fit mx-auto sm:mx-0">
                      Size:{" "}
                      <span className="font-semibold text-gray-800">
                        {item.size}
                      </span>
                    </p>
                  )}
                  
                  {item.color && (
                    <div className="flex items-center justify-center sm:justify-start">
                      <span className="text-xs text-gray-500 mr-2">Color:</span>
                      <div
                        className="w-5 h-5 rounded-full border border-gray-200"
                        style={{ backgroundColor: item.color }}
                        title={item.color}
                      />
                    </div>
                  )}
                </div>
                
                <div className="text-center sm:text-left">
                  <span className="text-sm font-medium text-gray-500">
                    Category:{" "}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {productData.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Controls Section */}
          <div className="flex items-center justify-center sm:justify-start order-3 sm:order-2">
            <div className="flex items-center border rounded-md">
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
                className="px-3 py-2 hover:bg-gray-200 text-lg font-medium"
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
                className="w-12 sm:w-10 md:w-12 px-2 py-2 text-center border-l border-r focus:outline-none"
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
                className="px-3 py-2 hover:bg-gray-200 text-lg font-medium"
              >
                +
              </button>
            </div>
          </div>

          {/* Remove Button Section */}
          <div className="flex justify-center sm:justify-end order-2 sm:order-3">
            <img
              onClick={() => handleRemoveItem(item._id, `${item.size}-${item.color}`)}
              className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:opacity-70 transition-opacity"
              src={assets.bin_icon}
              alt="Remove item"
            />
          </div>
        </div>
      );
    });
  };

  return (
    <div className="border-t pt-8 sm:pt-14 px-4 sm:px-7">
      <div className="text-xl sm:text-2xl mb-4 sm:mb-3 text-center sm:text-left">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {cartData.length === 0 ? (
        <div className="text-center text-lg sm:text-xl text-gray-600 py-12">
          Your cart is empty :(
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-0">
          {renderCartItems()}
        </div>
      )}

      {cartData.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end my-12 sm:my-20">
          <div className="w-full sm:w-[450px] max-w-md mx-auto sm:mx-0 px-4">
            <CartTotal />
            <div className="flex justify-center sm:justify-end mt-6">
              <button
                onClick={handleProceedToCheckout}
                className="w-full sm:w-auto bg-black text-white text-sm px-6 sm:px-4 py-3 rounded-md hover:bg-gray-800 hover:scale-105 transition ease-in-out duration-200"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
