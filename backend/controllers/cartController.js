import userModel from "../models/userModel.js";

// Add to cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, color, image, name, price } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ success: false });
        }

        const cartData = user.cartData || {};
        const variantKey = `${size}-${color}`;

        if (!cartData[itemId]) cartData[itemId] = {};

        // Remove same size with different color
        Object.keys(cartData[itemId]).forEach(key => {
            if (key.startsWith(size) && !key.endsWith(color)) {
                delete cartData[itemId][key];
            }
        });

        // Update quantity or add new item
        cartData[itemId][variantKey] = {
            quantity: (cartData[itemId][variantKey]?.quantity || 0) + 1,
            size,
            color,
            image,
            name,
            price
        };

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true });

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ success: false });
    }
};

// Update cart quantity
// In your cart controller
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, color, quantity } = req.body;
        
        if (!userId || !itemId || size === undefined || color === undefined || quantity === undefined) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const variantKey = `${size}-${color}`;
        // ... rest of your code
    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update cart item color
const updateCartItemColor = async (req, res) => {
    try {
        const { userId, itemId, oldVariantKey, newColor } = req.body;
        const [size] = oldVariantKey.split('-');
        const newVariantKey = `${size}-${newColor}`;

        const user = await userModel.findById(userId);
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ success: false });
        }

        const cartData = user.cartData;
        if (!cartData[itemId]?.[oldVariantKey]) {
            console.error("Item not found in cart");
            return res.status(404).json({ success: false });
        }

        cartData[itemId][newVariantKey] = {
            ...cartData[itemId][oldVariantKey],
            color: newColor
        };
        delete cartData[itemId][oldVariantKey];

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true });

    } catch (error) {
        console.error("Update color error:", error);
        res.status(500).json({ success: false });
    }
};

// Get user cart
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ success: false });
        }

        res.json({ success: true, cartData: user.cartData || {} });

    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({ success: false });
    }
};

// Clear deleted items
const clearDeletedCartItems = async (req, res) => {
    try {
        const { userId, updatedCartData } = req.body;
        
        if (!userId || !updatedCartData) {
            console.error("Missing data");
            return res.status(400).json({ success: false });
        }

        await userModel.findByIdAndUpdate(userId, { cartData: updatedCartData });
        res.json({ success: true });

    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({ success: false });
    }
};

export { 
    addToCart, 
    updateCart, 
    updateCartItemColor, 
    getUserCart, 
    clearDeletedCartItems 
};