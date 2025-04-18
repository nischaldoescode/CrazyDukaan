import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [shipmentFee, setShipmentFee] = useState(0);
  const [cartItems, setCartItems] = useState(() => {
    // Initialize cart from localStorage if available
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  const [platformFee, setPlatformFee] = useState(0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  const getProductsData = useCallback(async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  }, [backendUrl]);

  const getUserCart = useCallback(
    async (token) => {
      try {
        if (!token) {
          // For guest users, keep the localStorage cart
          return;
        }
        const response = await axios.post(
          backendUrl + "/api/cart/get",
          {},
          { headers: { token } }
        );

        if (response.data.success) {
          const cartData = response.data.cartData || {};
          const normalizedCart = {};

          for (const itemId in cartData) {
            if (cartData[itemId] && typeof cartData[itemId] === "object") {
              normalizedCart[itemId] = {};
              for (const variantKey in cartData[itemId]) {
                if (
                  cartData[itemId][variantKey] &&
                  typeof cartData[itemId][variantKey] === "object"
                ) {
                  normalizedCart[itemId][variantKey] = {
                    quantity:
                      parseInt(cartData[itemId][variantKey].quantity) || 0,
                    size: cartData[itemId][variantKey].size || "",
                    color: cartData[itemId][variantKey].color || "",
                    image: cartData[itemId][variantKey].image || "",
                    name: cartData[itemId][variantKey].name || "",
                    price: parseFloat(cartData[itemId][variantKey].price) || 0,
                    paymentMethods: cartData[itemId][variantKey].paymentMethod
                      ? [cartData[itemId][variantKey].paymentMethod]
                      : [],
                  };
                }
              }
            }
          }

          setCartItems((prevCart) => {
            // Merge server cart with local cart
            const mergedCart = { ...prevCart, ...normalizedCart };
            return mergedCart;
          });
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error(error.response?.data?.message || error.message);
        // Don't reset cart on error - keep existing items
      }
    },
    [backendUrl]
  );

  const addToCart = async (itemId, size, color) => {
    const product = products.find((p) => p._id === itemId);
    if (product?.subCategory !== "Handwear" && !size) {
      toast.error("Select Product Size");
      return;
    }

    if (!color) {
      toast.error("Select Product Color");
      return;
    }

    if (!product) {
      toast.error("Product not found");
      return;
    }

    let cartData = structuredClone(cartItems);
    const variantKey = `${size}-${color}`;

    // Check if this product already exists with a different color
    if (cartData[itemId]) {
      const existingVariant = Object.keys(cartData[itemId]).find(
        (key) => key.startsWith(size) && !key.endsWith(color)
      );

      if (existingVariant) {
        delete cartData[itemId][existingVariant];
      }
    }

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (cartData[itemId][variantKey]) {
      cartData[itemId][variantKey].quantity += 1;
    } else {
      cartData[itemId][variantKey] = {
        quantity: 1,
        size,
        color,
        image: product.image[0],
        name: product.name,
        price: product.price,
      };
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          {
            itemId,
            size,
            color,
            image: product.image[0],
            name: product.name,
            price: product.price,
          },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  const updateCartItemColor = async (itemId, oldVariantKey, newColor) => {
    const [size, _] = oldVariantKey.split("-");
    const product = products.find((p) => p._id === itemId);
    const newVariantKey = `${size}-${newColor}`;

    let cartData = structuredClone(cartItems);

    cartData[itemId][newVariantKey] = {
      ...cartData[itemId][oldVariantKey],
      color: newColor,
    };

    delete cartData[itemId][oldVariantKey];

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update-color",
          {
            itemId,
            oldVariantKey,
            newColor,
            size,
          },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error updating color:", error);
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] && typeof cartItems[itemId] === "object") {
        for (const variantKey in cartItems[itemId]) {
          if (
            cartItems[itemId][variantKey] &&
            typeof cartItems[itemId][variantKey] === "object"
          ) {
            totalCount += parseInt(cartItems[itemId][variantKey].quantity) || 0;
          }
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, variantKey, quantity) => {
    let cartData = structuredClone(cartItems);
    const [size, color] = variantKey.includes("-")
      ? variantKey.split("-")
      : [variantKey, ""];

    if (cartData[itemId]?.[variantKey]) {
      const parsedQuantity = parseInt(quantity);
      if (parsedQuantity <= 0) {
        delete cartData[itemId][variantKey];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      } else {
        cartData[itemId][variantKey].quantity = parsedQuantity;
      }
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          {
            userId: localStorage.getItem("userId"),
            itemId,
            size,
            color: color || cartData[itemId]?.[variantKey]?.color || "#000000",
            quantity: parseInt(quantity),
          },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error updating quantity:", error);
        // Revert if error occurs
        setCartItems(cartItems);
        toast.error(error.response?.data?.message || "Failed to update cart");
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] && typeof cartItems[itemId] === "object") {
        for (const variantKey in cartItems[itemId]) {
          if (
            cartItems[itemId][variantKey] &&
            typeof cartItems[itemId][variantKey] === "object"
          ) {
            const item = cartItems[itemId][variantKey];
            totalAmount +=
              (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
          }
        }
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    const fetchFee = async () => {
      try {
        const res = await axios.get(
          backendUrl + "/api/shipment/get-shipment-fee"
        );
        if (res.data.success) {
          setShipmentFee(res.data.fee);
        }
      } catch (error) {
        console.error("Error fetching shipment fee:", error);
        setShipmentFee(0);
      }
    };
    fetchFee();
  }, [backendUrl]);


  useEffect(() => {
    const fetchPlatformFee = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/platform/get-platform-fee`);
        if (res.data.success) {
          setPlatformFee(res.data.fee);
        }
      } catch (error) {
        console.error("Error fetching platform fee:", error);
        setPlatformFee(0);
      }
    };
    fetchPlatformFee();
  }, [backendUrl]);

useEffect(() => {
  if (products.length === 0 || Object.keys(cartItems).length === 0) return;

  const updatedCart = { ...cartItems };
  let deletedFound = false;

  for (const productId in cartItems) {
    const product = products.find((p) => p._id === productId);
    const hasQty = Object.values(cartItems[productId]).some(
      (variant) => variant?.quantity > 0
    );

    if (!product && hasQty) {
      deletedFound = true;
      delete updatedCart[productId];
    }
  }

  if (deletedFound) {
    setCartItems(updatedCart);

    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .post(`${backendUrl}/api/cart/clear-deleted`, {
          userId,
          updatedCart,
        })
        .catch((err) => console.error("Cart cleanup failed:", err));
    }

    toast.error(
      "Some items were removed from your cart as they're no longer available."
    );
  }
}, [cartItems, products]);


  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      if (!token && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (isMounted) setToken(storedToken);
        await getUserCart(storedToken);
      }
      if (token && isMounted) {
        await getUserCart(token);
      }
    };

    checkToken();

    return () => {
      isMounted = false;
    };
  }, [token, getUserCart]);

  const value = {
    products: products || [],
    currency,
    shipmentFee,
    platformFee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    updateCartItemColor,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
