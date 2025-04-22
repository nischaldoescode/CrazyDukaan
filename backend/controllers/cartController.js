import userModel from "../models/userModel.js";

// Add to cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, color, image, name, price, category, subCategory } = req.body;

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
            price,
            category,
            subCategory
        };

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true });

    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ success: false });
    }
};

// Update cart quantity
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, color, quantity, category, subCategory } = req.body;
        
        if (!userId || !itemId || size === undefined || color === undefined || quantity === undefined) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = user.cartData || {};
        const variantKey = `${size}-${color}`;

        if (quantity <= 0) {
            // Remove item if quantity is zero or negative
            if (cartData[itemId] && cartData[itemId][variantKey]) {
                delete cartData[itemId][variantKey];
                
                // Remove the product entry if no variants remain
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
        } else {
            // Ensure the item and variant exist
            if (!cartData[itemId]) cartData[itemId] = {};
            
            // Update or add the item
            cartData[itemId][variantKey] = {
                ...(cartData[itemId][variantKey] || {}),
                quantity,
                size,
                color,
                category,
                subCategory
            };
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true });

    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update cart item color
const updateCartItemColor = async (req, res) => {
    try {
        const { userId, itemId, oldVariantKey, newColor, size, category, subCategory } = req.body;
        const newVariantKey = `${size}-${newColor}`;

        const user = await userModel.findById(userId);
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ success: false });
        }

        const cartData = user.cartData || {};
        if (!cartData[itemId]?.[oldVariantKey]) {
            console.error("Item not found in cart");
            return res.status(404).json({ success: false });
        }

        cartData[itemId][newVariantKey] = {
            ...cartData[itemId][oldVariantKey],
            color: newColor,
            category,
            subCategory
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
        const { userId, updatedCart } = req.body;
        
        if (!userId || !updatedCart) {
            console.error("Missing data");
            return res.status(400).json({ success: false });
        }

        await userModel.findByIdAndUpdate(userId, { cartData: updatedCart });
        res.json({ success: true });

    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({ success: false });
    }
};

// Remove cart item
const removeCartItem = async (req, res) => {
    try {
        const { userId, itemId, variantKey } = req.body;
        
        if (!userId || !itemId || !variantKey) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = user.cartData || {};
        
        // Remove the specific variant
        if (cartData[itemId] && cartData[itemId][variantKey]) {
            delete cartData[itemId][variantKey];
            
            // Remove the entire product entry if no variants remain
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
            
            await userModel.findByIdAndUpdate(userId, { cartData });
            return res.json({ success: true });
        }
        
        res.status(404).json({ success: false, message: "Item not found in cart" });

    } catch (error) {
        console.error("Remove cart item error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { 
    addToCart, 
    updateCart, 
    updateCartItemColor, 
    getUserCart, 
    clearDeletedCartItems,
    removeCartItem
};
