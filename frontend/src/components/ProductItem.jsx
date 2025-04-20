import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { motion, useInView } from "framer-motion";

const ProductItem = ({ id, image, name, price, className, originalPrice }) => {
  const { currency, products } = useContext(ShopContext);
  const [productColors, setProductColors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentProduct = products.find((product) => product._id === id);
    if (currentProduct?.colors) {
      setProductColors(currentProduct.colors);
    } else {
      setProductColors([]);
    }
  }, [id, products]);

  // Handle navigation with scroll reset
  const handleProductClick = (e) => {
    e.preventDefault();
    navigate(`/product/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <motion.div
      className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-200 ${className}`}
      whileHover={{
        y: -8,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative h-full flex flex-col group w-full">
        {/* Image container with improved blending */}
        <div className="relative pt-[120%] overflow-hidden">
          <motion.img
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={image?.[0]?.url || assets.placeholder}
            alt={name}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            loading="lazy"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              background:
                "linear-gradient(to bottom, transparent, rgba(0,0,0,0.1))",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#A3B5FB]/10 to-orange-100/10 mix-blend-overlay" />
        </div>

        <div className="p-3 sm:p-3 flex flex-col flex-grow">
          {/* Compact product info section */}
          {/* Product info section - name above, price below, colors to the right of price */}
          <div className="mb-1">
            <motion.h3
              className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2"
              whileHover={{ color: "#f97316" }}
              transition={{ duration: 0.2 }}
            >
              {name}
            </motion.h3>

            <div className="flex justify-between items-center mt-1">
              <div className="flex flex-col">
                <motion.p
                  className="text-lg sm:text-xl font-semibold text-gray-900"
                  whileHover={{ color: "#f97316" }}
                  transition={{ duration: 0.2 }}
                >
                  {currency}
                  {price}
                </motion.p>
                <p className="text-sm text-gray-400 line-through decoration-black">
                  {currency}
                  {originalPrice}
                </p>
              </div>

              {productColors.length > 0 && (
                <motion.div
                  className="flex items-center gap-1"
                  whileHover={{
                    y: -2,
                    transition: { duration: 0.2 },
                  }}
                >
                  {productColors.slice(0, 4).map((color, index) => (
                    <motion.div
                      key={index}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white shadow-sm relative
              ${index === 0 ? "ring-1 ring-orange-500" : "border border-black"}`}
                      style={{
                        backgroundColor: color,
                        zIndex: 4 - index,
                      }}
                      title={color}
                      whileHover={{
                        scale: 1.3,
                        zIndex: 10,
                        boxShadow: "0 0 0 1px white, 0 0 0 2px #f97316",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    />
                  ))}
                  {productColors.length > 4 && (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[0.6rem] font-medium text-gray-600 shadow-sm">
                      +{productColors.length - 4}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* View Details button */}
          <motion.div
            className="mt-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              className="flex items-center justify-center w-full bg-orange-600 hover:bg-orange-700 text-white py-1 px-1 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              to={`/product/${id}`}
              onClick={handleProductClick}
            >
              <img
                src={assets.view}
                alt="View Product"
                className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
              />
              View Details
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductItem;
