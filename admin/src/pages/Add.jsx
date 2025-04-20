import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Shoewear");
  const [bestseller, setBestseller] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [hexInput, setHexInput] = useState("");

  // Coupon and Discount
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountOption, setDiscountOption] = useState(0);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  const checkGlobalCouponExists = async (code) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/global-coupon/check`,
        { code },
        { headers: { token } }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error checking global coupon:", error);
      return { success: false, exists: false };
    }
  };

  // Update available sizes based on category and subcategory
  useEffect(() => {
    const isWatch = subCategory === "Handwear";
    const isShoes = subCategory === "Shoewear";
    const isTopwear = subCategory === "Winterwear";
    const isEyewear = subCategory === "Eyewear";
    const isLadiesPurse = subCategory === "WMLadiesBag";
    
    if (isWatch || isEyewear || isLadiesPurse) {
      setAvailableSizes(["one-size"]);
      setSelectedSizes(["one-size"]);
    } else if (isShoes) {
      const adultSizes = Array.from({ length: 13 }, (_, i) => `EU ${36 + i}`);
      setAvailableSizes(adultSizes);
    } else if (isTopwear) {
      setAvailableSizes(["S", "M", "L", "XL", "XXL"]);
    } else {
      setAvailableSizes([]);
    }
    
    if (!(isWatch || isEyewear || isLadiesPurse)) {
      setSelectedSizes([]);
    }
  }, [category, subCategory]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (subCategory !== "Handwear" && subCategory !== "Eyewear" && subCategory !== "WMLadiesBag" && selectedSizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    if (colors.length === 0) {
      toast.error("Please select at least one color");
      return;
    }
    if (discountOption > 0 && couponCode.trim() === "") {
      toast.error("Please enter a coupon code for the selected discount.");
      return;
    }
    
    if (Number(originalPrice) <= Number(price)) {
      toast.error("Original price must be greater than the selling price");
      return;
    }
    
    if (couponCode.trim() !== "" && discountOption === 0) {
      toast.error("Please select a discount option along with the coupon code.");
      return;
    }  

    if (couponCode.trim() !== "") {
    const result = await checkGlobalCouponExists(couponCode);
      
      if (result.success && result.exists) {
        toast.info(`This coupon code exists in global coupons list with ${result.coupon.discount}% discount${!result.coupon.active ? ' (inactive)' : ''}`);
        // Prevent submission when a global coupon is found:
        return;
      }
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("originalPrice", originalPrice);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      
      let formattedSizes = selectedSizes;
      if (subCategory === "Shoewear") {
        formattedSizes = selectedSizes.map(size => {
          if (size.includes("EU")) return size;
          return `EU ${size.replace("EU", "").trim()}`;
        });
      }
      formData.append("sizes", JSON.stringify(formattedSizes));
      
      formData.append("colors", JSON.stringify(colors));
      formData.append("couponCode", couponCode);
      formData.append("discountOption", discountOption);
      formData.append("paymentMethod", paymentMethod);

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setOriginalPrice("")
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setBestseller(false);
    setCategory("Men");
    setSubCategory("Shoewear");
    setSelectedSizes([]);
    setColors([]);
    setCurrentColor("#000000");
    setHexInput("");
    setCouponCode("");
    setDiscount(0);
    setDiscountOption(0);
    setPaymentMethod("Razorpay");
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(item => item !== size)
        : [...prev, size]
    );
  };

  const handleColorChange = (e) => {
    setCurrentColor(e.target.value);
    setHexInput(e.target.value);
  };

  const handleHexInputChange = (e) => {
    const value = e.target.value;
    setHexInput(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setCurrentColor(value);
    }
  };

  const addColor = () => {
    if (!colors.includes(currentColor)) {
      setColors([...colors, currentColor]);
      setCurrentColor("#000000");
      setHexInput("");
    } else {
      toast.error("This color has already been added");
    }
  };

  const removeColor = (colorToRemove) => {
    setColors(colors.filter(color => color !== colorToRemove));
  };

  const removeSize = (sizeToRemove) => {
    setSelectedSizes(selectedSizes.filter(size => size !== sizeToRemove));
  };

  const handleCouponChange = (e) => {
    const value = e.target.value.replace(/\s+/g, '').toUpperCase(); // remove all spaces + uppercase
    setCouponCode(value);
    if (e.target.value === "SAVE10") setDiscount(10);
    else if (e.target.value === "SAVE15") setDiscount(15);
    else if (e.target.value === "SAVE20") setDiscount(20);
    else setDiscount(0);
  };

  const handleDiscountChange = (e) => {
    setDiscountOption(parseInt(e.target.value, 10));
    setDiscount(0);
  };

  return (
    <form onSubmit={onSubmitHandler} className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
      {/* Image Upload Section - Responsive */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Upload Images</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((num) => (
            <label 
              key={num} 
              htmlFor={`image${num}`} 
              className="block cursor-pointer border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors overflow-hidden"
            >
              <div className="aspect-square flex items-center justify-center">
                <img
                  className="w-full h-full object-contain p-2"
                  src={!eval(`image${num}`) ? assets.upload_area : URL.createObjectURL(eval(`image${num}`))}
                  alt=""
                />
              </div>
              <input
                onChange={(e) => eval(`setImage${num}`)(e.target.files[0])}
                type="file"
                id={`image${num}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Details Section - Stacked on mobile */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Product Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              type="text"
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product description</label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[100px]"
              placeholder="Enter product description"
              required
            />
          </div>
        </div>
      </div>

      {/* Category and Pricing - Stacked on mobile */}
      <div className="mb-6 pb-4 border-b border-gray-200 space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sub category</label>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="Shoewear">Shoes</option>
            <option value="Handwear">Watches</option>
            <option value="Winterwear">T-shirts</option>
            <option value="Eyewear">Sunglasses</option>
            <option value="WMLadiesBag">Ladies Purse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Price (₹)</label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            type="Number"
            placeholder="Enter price"
            min="0"
            required
          />
        </div>
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Original Price (₹)
          </label>
          <input
            onChange={(e) => setOriginalPrice(parseFloat(e.target.value))}
            value={originalPrice}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            type="number"
            placeholder="Strike Through Price"
            min="0"
            required
          />
        </div>
      </div>

      {/* Discount and Payment - Stacked on mobile */}
      <div className="mb-6 pb-4 border-b border-gray-200 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <input
            type="text"
            value={couponCode.toUpperCase()}
            onChange={handleCouponChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 uppercase"
            placeholder="Enter coupon code"
          />
          {discount > 0 && (
            <span className="inline-block mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
              {discount}% discount applied
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Or Select Discount</label>
          <select
            onChange={handleDiscountChange}
            value={discountOption}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="0">No Discount</option>
            <option value="5">5% Discount</option>
            <option value="10">10% Discount</option>
            <option value="15">15% Discount</option>
            <option value="20">20% Discount</option>
          </select>
        </div>
      </div>

      {/* Payment Method - Full width */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select
            onChange={(e) => setPaymentMethod(e.target.value)}
            value={paymentMethod}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="Razorpay">Razorpay</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>
      </div>

      {/* Size Selection - Full width */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">
          Available Sizes
        </h3>
        {subCategory !== "Handwear" && subCategory !== "Eyewear" && subCategory !== "WMLadiesBag" ? (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    selectedSizes.includes(size)
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSizes.map((size) => (
                <div
                  key={size}
                  className="flex items-center px-3 py-1 text-sm bg-gray-800 text-white rounded"
                >
                  <span>{size}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="ml-2 text-white hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center px-3 py-1 bg-gray-800 text-white rounded">
              <span>one-size</span>
            </div>
            <p className="text-gray-500 italic text-sm">
              {subCategory === "Handwear"
                ? "(Default for watches)"
                : subCategory === "Eyewear"
                ? "(Default for sunglasses)"
                : "(Default for ladies purse)"}
            </p>
          </div>
        )}
      </div>

      {/* Color Selection - Full width */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">Product Colors</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-col gap-4 items-start sm:items-end">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700">Color Picker</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentColor}
                  onChange={handleColorChange}
                  className="w-10 h-10 cursor-pointer"
                />
                <div className="w-10 h-10 rounded border border-gray-300" 
                     style={{ backgroundColor: currentColor }}></div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hex Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <div 
                key={color} 
                className="flex items-center px-3 py-1 rounded text-sm"
                style={{ backgroundColor: color }}
              >
                <span className="text-white mix-blend-difference mr-2">{color}</span>
                <button 
                  type="button" 
                  onClick={() => removeColor(color)}
                  className="text-white mix-blend-difference hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bestseller Option - Full width */}
      <div className="mb-6">
        <label className="flex items-center cursor-pointer">
          <input
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            className="mr-2"
          />
          <span className="text-gray-700 text-sm md:text-base">Add to bestseller</span>
        </label>
      </div>

      {/* Submit Button - Full width */}
      <button
        type="submit"
        className="w-full py-3 bg-gray-800 text-white font-medium md:font-semibold rounded-md hover:bg-gray-700 transition-colors"
      >
        ADD PRODUCT
      </button>
    </form>
  );
};

export default Add;
