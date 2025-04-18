import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleRemoveCoupon = async (productId) => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/product/remove-coupon`,
        { id: productId },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Coupon removed");
        await fetchList();
      } else {
        toast.error(res.data.message || "Failed to remove coupon");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing coupon");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="mt-6 sm:mt-10 px-3 sm:px-4 lg:px-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
        All Products
      </h2>

      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Header for desktop */}
        <div className="hidden md:grid grid-cols-10 gap-4 items-center py-2 sm:py-3 px-3 sm:px-4 border bg-gray-100 text-xs sm:text-sm font-semibold rounded-md">
          <span className="truncate">Image</span>
          <span className="truncate">Name</span>
          <span className="truncate">Category</span>
          <span className="truncate">Subcategory</span>
          <span className="truncate">Colors</span>
          <span className="truncate">Price</span>
          <span className="truncate">Payment</span>
          <span className="truncate">Coupon</span>
          <span className="truncate">Discount</span>
          <span className="text-center truncate">Action</span>
        </div>

        {/* Product Rows */}
        {list.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="border rounded-lg sm:rounded-xl p-3 sm:p-5 bg-white shadow-xs sm:shadow-sm hover:shadow-md transition duration-300"
          >
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-10 items-center gap-3 sm:gap-4">
              <div className="flex items-center">
                <img
                  className="w-14 h-14 sm:w-14 sm:h-14 object-cover rounded"
                  src={item.image[0].url}
                  alt="product"
                />
              </div>
              <p className="font-medium text-sm sm:text-base truncate">
                {item.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {item.category}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {item.subCategory || "-"}
              </p>

              {/* Color Circles */}
              <div className="flex flex-wrap gap-1">
                {item.colors?.length > 0 ? (
                  item.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                )}
              </div>

              <p className="font-semibold text-sm sm:text-base">
                {currency}
                {item.price}
              </p>
              <p className="text-xs sm:text-sm truncate">
                {item.paymentMethod?.toUpperCase() || "All"}
              </p>
              
              {/* Coupon Code */}
              <div>
                {item.couponCode ? (
                  <div className="bg-green-100 text-green-700 text-xs sm:text-sm px-2 py-1 rounded-full inline-flex items-center gap-2 relative group hover:bg-green-200 transition-all duration-200">
                    <span className="truncate">{item.couponCode}</span>
                    <button
                      className="opacity-0 group-hover:opacity-100 text-xs hover:text-red-500 transition"
                      onClick={() => handleRemoveCoupon(item._id)}
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-400 italic text-xs sm:text-sm">
                    None
                  </span>
                )}
              </div>
              
              {/* Discount */}
              <div>
                {item.discount ? (
                  <span className="text-red-500 text-sm font-medium">
                    {item.discount}% off
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => removeProduct(item._id)}
                  className="bg-red-500 text-white text-xs sm:text-sm px-3 sm:px-4 py-1 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Mobile Stack */}
            <div className="md:hidden flex flex-col gap-4">
              {/* Image centered at top */}
              <div className="flex justify-center">
                <img
                  className="w-40 h-40 object-cover rounded-lg"
                  src={item.image[0].url}
                  alt="product"
                />
              </div>

              {/* Product details */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-center">{item.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="font-medium text-gray-500">Category</p>
                    <p>{item.category}</p>
                  </div>

                  {item.subCategory && (
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="font-medium text-gray-500">Subcategory</p>
                      <p>{item.subCategory}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 p-2 rounded">
                    <p className="font-medium text-gray-500">Price</p>
                    <p className="font-semibold">
                      {currency}
                      {item.price}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-2 rounded">
                    <p className="font-medium text-gray-500">Payment</p>
                    <p>{item.paymentMethod?.toUpperCase() || "All"}</p>
                  </div>
                </div>

                {/* Color display for mobile */}
                <div className="bg-gray-50 p-2 rounded">
                  <p className="font-medium text-gray-500 mb-1">Colors</p>
                  <div className="flex flex-wrap gap-2">
                    {item.colors?.length > 0 ? (
                      item.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border border-gray-200 shadow-sm flex items-center justify-center"
                          style={{ backgroundColor: color }}
                          title={color}
                        >
                          <span className="sr-only">{color}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">
                        No colors specified
                      </span>
                    )}
                  </div>
                </div>

                {/* Coupon and Discount information */}
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`p-2 rounded ${
                      item.couponCode ? "bg-green-50" : "bg-gray-50"
                    }`}
                  >
                    <p className="font-medium text-gray-500">Coupon</p>
                    {item.couponCode ? (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-green-600">
                          {item.couponCode}
                        </span>
                        <button
                          onClick={() => handleRemoveCoupon(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">None</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-2 rounded">
                    <p className="font-medium text-gray-500">Discount</p>
                    {item.discount ? (
                      <p className="text-red-500 font-medium">
                        {item.discount}% off
                      </p>
                    ) : (
                      <p className="text-gray-400">-</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeProduct(item._id)}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition mt-2"
              >
                Remove Product
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default List;