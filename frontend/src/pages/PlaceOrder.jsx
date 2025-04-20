import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OrderProcessingAnimation from "../components/OrderProcessingAnimation";
import WhatsAppButton from "../components/whatsappbutton";
import "react-phone-input-2/lib/material.css";
import { Helmet } from "react-helmet";
const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    shipmentFee,
    products,
    getCartCount,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [method, setMethod] = useState("Razorpay");

  const [couponInput, setCouponInput] = useState("");

  const applyCoupon = async () => {
    if (couponApplied) {
      setCouponMessage("Coupon already applied.");
      return;
    }

    try {
      const trimmed = couponInput.trim().toUpperCase();

      const res = await axios.post(
        `${backendUrl}/api/product/validate-coupon`,
        {
          couponCode: trimmed,
        }
      );

      if (res.data.success) {
        setCouponDiscount(res.data.coupon.discountOption);
        setCouponMessage(
          `Coupon applied! You got ${res.data.coupon.discountOption}% off`
        );
        setCouponApplied(true); // lock further applications
      } else {
        setCouponDiscount(0);
        setCouponMessage("Invalid coupon code");
      }
    } catch (err) {
      console.error("Coupon error:", err);
      setCouponMessage("Error checking coupon");
    }
  };
  
  

  useEffect(() => {
    if (getCartCount() === 0 && !orderSuccess && !isProcessing) {
      navigate("/cart");
    }
  }, [getCartCount, orderSuccess, isProcessing, navigate]);

  const [availablePaymentMethods, setAvailablePaymentMethods] = useState({
    razorpayAvailable: false,
    codAvailable: false,
  });
  useEffect(() => {
    if (orderSuccess) {
      setIsProcessing(true); // Show animation
      const timeout = setTimeout(() => {
        navigate("/orders");
      }, 2000); // Delay before navigation (if you want to show animation briefly)

      return () => clearTimeout(timeout); // Cleanup
    }
  }, [orderSuccess, navigate]);

  useEffect(() => {
    const getAvailablePaymentMethods = async () => {
      let razorpayAvailable = false;
      let codAvailable = false;

      let razorpayRequired = false; // This will track if Razorpay is required for any product
      let codOnly = true; // Flag to check if all items can use COD

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] && cartItems[items][item].quantity > 0) {
            const product = products.find((product) => product._id === items);

            if (product && product.paymentMethod) {
              if (product.paymentMethod === "Razorpay") {
                razorpayAvailable = true;
                razorpayRequired = true; // If Razorpay is required for at least one item
              }
              if (product.paymentMethod === "COD") {
                codAvailable = true;
              } else {
                codOnly = false; // If even one product doesn't support COD, it will set this to false
              }
            }
          }
        }
      }

      // Logic to enable/disable payment methods
      if (razorpayRequired) {
        // If Razorpay is required for any product, disable COD and enable only Razorpay
        setAvailablePaymentMethods({
          razorpayAvailable: true,
          codAvailable: false,
        });
        setMethod("razorpay"); // Default to Razorpay
      } else if (codAvailable) {
        // If COD is available for all products, both COD and Razorpay should be enabled
        setAvailablePaymentMethods({
          razorpayAvailable: true,
          codAvailable: true,
        });
        setMethod("razorpay"); // Default to Razorpay (can switch to COD)
      } else {
        // If no valid payment method exists
        setAvailablePaymentMethods({
          razorpayAvailable: false,
          codAvailable: false,
        });
      }
    };

    getAvailablePaymentMethods();
  }, [cartItems, products]); // Correct dependency array

  const handleRazorpayClick = () => {
    if (availablePaymentMethods.razorpayAvailable) {
      setMethod("razorpay");
    }
  };

  const handleCODClick = () => {
    if (availablePaymentMethods.codAvailable) {
      setMethod("cod");
    }
  };

  const isFormComplete = () => {
    const { firstName, lastName, email, street, city, state, zipcode, phone } =
      formData;
    return (
      firstName &&
      lastName &&
      email &&
      street &&
      city &&
      state &&
      zipcode &&
      phone
    );
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    // setIsProcessing(true);
    event.preventDefault();

    // --- Basic validation for all required fields ---
    const { firstName, lastName, email, street, city, state, zipcode, phone } =
      formData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !street ||
      !city ||
      !state ||
      !zipcode ||
      !phone
    ) {
      toast.error("Please fill in all the fields.");
      return;
    }
    if (!isFormComplete()) {
      toast.error("Please fill in all the fields.");
      return;
    }

    const indiaZipcodeRegex = /^\d{6}$/; // Matches exactly 6 digits

    if (!indiaZipcodeRegex.test(zipcode)) {
      toast.error("Please enter a valid Indian zip code.");
      return; // Return false if invalid
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validProviders = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
      "aol.com",
      "protonmail.com",
      "zoho.com",
      "mail.com",
      "yandex.com",
      "gmx.com",
      "fastmail.com",
      "office365.com",
      "tutanota.com",
      "hushmail.com",
      "inbox.com",
      "mail.ru",
      "yahoo.co.uk",
      "live.com",
      "rediffmail.com",
      "msn.com",
      "outlook.co.uk",
      "lavabit.com",
    ];

    const emailDomain = email.split("@")[1]; // Get the domain part of the email

    // Validate email format
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Check if the email belongs to a known provider
    if (!validProviders.includes(emailDomain)) {
      toast.error("Please use a valid email provider.");
      return;
    }

    const cleanedPhone = phone.replace(/[^0-9]/g, "");
    const localNumber = cleanedPhone.slice(-10); // trying to get last 10 digits

    if (localNumber.length !== 10 || !/^[6-9]\d{9}$/.test(localNumber)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      // In your PlaceOrder.jsx, modify the orderItems construction:

      let orderItems = [];

      for (const productId in cartItems) {
        for (const variantKey in cartItems[productId]) {
          const item = cartItems[productId][variantKey];
          if (item.quantity > 0) {
            const productInfo = products.find((p) => p._id === productId);
            if (productInfo) {
              // Extract size and color from variantKey (format: "size-color")
              const [size, color] = variantKey.includes("-")
                ? variantKey.split("-")
                : [variantKey, item.color || "#000000"];

              orderItems.push({
                productId,
                size,
                color, // This will now be properly included
                quantity: item.quantity,
                price: item.price,
                name: item.name,
                image: item.image,
                category: item.category,
                subCategory: item.subCategory
              });
            }
          }
        }
      }

      let finalAmount = getCartAmount() + Number(shipmentFee || 0);
      if (couponDiscount > 0) {
        finalAmount = finalAmount - finalAmount * (couponDiscount / 100);
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: finalAmount,
        couponCode: couponInput.toUpperCase(),
        discount: couponDiscount,
      };
      const initPay = (orderDetails) => {
        // Capture context values to ensure they're available in the handler
        const contextValues = {
          backendUrl,
          token,
        };

        // Capture the current shipping address

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderDetails.amount,
          currency: "INR",
          name: "Order Payment",
          description: "Order Payment",
          order_id: orderDetails.id,
          prefill: {
            name: `${firstName} ${lastName}`,
            email: email,
            contact: phone,
          },
          handler: async (response) => {
            try {
              const res = await axios.post(
                `${contextValues.backendUrl}/api/order/verifyRazorpay`,
                {
                  ...response,
                  ...orderData,
                },
                { headers: { token: contextValues.token } }
              );

              if (res.data.success) {
                toast.success("Payment successful!");
                setCartItems({});
                setIsProcessing(true);
                setOrderSuccess(true);
              } else {
                setIsProcessing(false);
                toast.error("Payment failed. Contact support, If Deducted.");
              }
            } catch (err) {
              setIsProcessing(false);
              toast.error("Error verifying payment");
            }
          },
          modal: {
            ondismiss: () => {
              // console.log("📌 Payment modal dismissed");
              toast.error("Payment cancelled. Order not placed.");
            },
          },
          theme: {
            color: "#FCC981",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };

      switch (method) {
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            localStorage.setItem("justOrdered", "true");
            setCartItems({});
            setOrderSuccess(true); // triggers useEffect
          } else {
            setIsProcessing(false);
            console.error(response.data.message);
          }
          break;

        case "razorpay":
          const responseRazorpay = await axios.post(
            backendUrl + "/api/order/razorpay",
            orderData,
            { headers: { token } }
          );
          if (responseRazorpay.data.success && responseRazorpay.data.order) {
            initPay(responseRazorpay.data.order);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
        <>
    <Helmet>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6XEBXHJCN7"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6XEBXHJCN7');
          `}
        </script>
    </Helmet>
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ------------- Left Side ---------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First name"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email address"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <select
            required
            name="state"
            value={formData.state}
            onChange={onChangeHandler}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          >
            <option value="">Select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Delhi">Delhi</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input
            name="country"
            value="India"
            disabled
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full bg-gray-100 text-gray-500"
            type="text"
          />
        </div>
        <PhoneInput
          country={"in"}
          value={formData.phone}
          onChange={(phone) => setFormData((data) => ({ ...data, phone }))}
          inputStyle={{ width: "100%" }}
        />
      </div>

      {/* ------------- Right Side ------------------ */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <div className="mb-6">
            <label
              htmlFor="coupon"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Have a coupon?
            </label>
            <div className="flex gap-3">
                <input
                  type="text"
                  value={couponInput.toUpperCase()}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter coupon code"
                  className="border px-3 py-2 flex-grow rounded-md focus:outline-none focus:ring focus:border-blue-300 uppercase"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponApplied}
                  className={`px-4 py-2 rounded-md text-white ${
                    couponApplied
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {couponApplied ? "Applied" : "Apply"}
                </button>
            </div>
            {couponMessage && (
              <p className="mt-2 text-sm text-green-600">{couponMessage}</p>
            )}
          </div>

          {/* Use couponDiscount wherever you calculate totals */}
          <CartTotal couponDiscount={couponDiscount} />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* --------------- Payment Method Selection ------------- */}
          <div className="flex gap-3 flex-col lg:flex-row">
            {/* Razorpay Button */}
            <div
              onClick={() => {
                if (!availablePaymentMethods.razorpayAvailable) {
                  toast.error(
                    "Razorpay is not available for your selected product(s)."
                  );
                } else {
                  handleRazorpayClick();
                }
              }}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                !availablePaymentMethods.razorpayAvailable
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>

            {/* COD Button */}
            <div
              onClick={() => {
                if (!availablePaymentMethods.codAvailable) {
                  toast.error(
                    "COD is not available for your selected product(s)."
                  );
                } else {
                  handleCODClick();
                }
              }}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                !availablePaymentMethods.codAvailable
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="inline-flex flex-col gap-4 w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm rounded-md shadow-lg"
            >
              PLACE ORDER
            </button>
            <WhatsAppButton />
          </div>
        </div>
        {isProcessing && (
          <OrderProcessingAnimation
            duration={7000}
            onComplete={
              orderSuccess
                ? () => {
                    setIsProcessing(false);
                    setTimeout(() => {
                      navigate("/orders"); // Navigate after delay
                      window.location.reload(); // Reload the page after navigating
                    }, 100); // short delay
                  }
                : () => setIsProcessing(false)
            }
          />
        )}
      </div>
    </form>
   </>
  );
};

export default PlaceOrder;

// console.log("📌 Razorpay Success Response:", response);
// console.log("📌 Order Details:", orderDetails);

// console.log("📌 Backend verification response:", res.data);
// console.error("📌 Error during verification:", err);
// console.error("📌 Error response data:", err.response?.data);
        // console.log("📌 Initializing Razorpay with options:", {
        //   ...options,
        //   key: options.key.substring(0, 5) + "..." // Don't log full key
        // });
