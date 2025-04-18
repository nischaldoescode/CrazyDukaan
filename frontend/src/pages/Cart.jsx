import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";
import "./Cart.css";
import axios from "axios";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    setCartItems,
    backendUrl,
  } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const location = useLocation();
  const hasShownDeletedToast = useRef(0);
  const { token,} = useContext(ShopContext);
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
      toast.error("Please login to place an order");  // Show error toast if not logged in
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
  

  const renderCartItems = () => {
    return cartData.map((item, index) => {
      const productData = products.find((product) => product._id === item._id);

      if (!productData) return null;

      return (
        <div
          key={index}
          className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
        >
          <div className="flex items-start gap-6">
            <img className="w-16 sm:w-20" src={productData.image[0].url} alt="" />
            <div>
              <p className="text-xs sm:text-lg font-medium">
                {productData.name}
              </p>
              <div className="mt-2">
                <p className="font-semibold text-sm sm:text-base text-gray-700">
                  {currency}
                  {productData.price}
                </p>
                {item.size && (
                  <p className="mt-1 inline-block text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-md border border-gray-300 bg-gray-100 text-gray-600">
                    Size:{" "}
                    <span className="font-semibold text-gray-800">
                      {item.size}
                    </span>
                  </p>
                )}
                {/* Display selected color only */}
                {item.color && (
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Color:</span>
                    <div
                      className="w-5 h-5 rounded-full border border-gray-200"
                      style={{ backgroundColor: item.color }}
                      title={item.color}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
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
              className="border px-2 py-1 hover:bg-gray-200"
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
              className="border max-w-10 sm:max-w-9 px-1 sm:px-2 py-1 text-center hover:bg-gray-200"
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
              className="border px-2 py-1 hover:bg-gray-200"
            >
              +
            </button>
          </div>

          <img
            onClick={async () => {
              try {
                await updateQuantity(item._id, `${item.size}-${item.color}`, 0);
                // Success - item will be removed from UI via state update
              } catch (error) {
                toast.error("Failed to remove item");
              }
            }}
            className="w-5 mr-4 sm:w-6 cursor-pointer hover:opacity-70 transition-opacity"
            src={assets.bin_icon}
            alt="Remove item"
          />
        </div>
      );
    });
  };

  return (
    <div className="border-t pt-14 px-7">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {cartData.length === 0 ? (
        <div className="text-center text-xl text-gray-600">
          Your cart is empty :(
        </div>
      ) : (
        <div>{renderCartItems()}</div>
      )}

      {cartData.length > 0 && (
        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px] px-4">
            <CartTotal />
            <div className="flex justify-end">
              <button
                onClick={handleProceedToCheckout}
                className="bg-black text-white text-sm mt-6 px-4 py-3 rounded-md hover:bg-black-400 hover:scale-105 transition ease-in-out duration-200"
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
