import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      couponCode,
      discountOption,
      paymentMethod,
      colors,
     originalPrice,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(Boolean);
    let finalPrice = Number(price);

    if (discountOption > 0) {
      finalPrice = finalPrice - finalPrice * (discountOption / 100);
    }

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          folder: "products",
        });
        return {
          url: result.secure_url,
          public_id: result.public_id, // Needed for deletion
        };
      })
    );

    const productData = {
      name,
      description,
      category,
      price: finalPrice,
      originalPrice: Number(originalPrice),
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imagesUrl, // Now stores url + public_id
      couponCode,
      discount: discountOption,
      paymentMethod,
      colors: JSON.parse(colors),
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// In your product route/controller
const validateCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    const product = await productModel.findOne({
      couponCode: { $regex: `^${couponCode}$`, $options: "i" },
    });

    if (product) {
      return res.json({
        success: true,
        coupon: {
          couponCode: product.couponCode,
          discountOption: Number(product.discount),
        },
      });
    }

    res.json({ success: false, message: "Invalid coupon code" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing product
const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // Delete each Cloudinary image by public_id
    const deletePromises = product.image.map(async (img) => {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    });

    await Promise.all(deletePromises);
    await productModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId); // Assume you have a product model

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Send product details, including available payment methods
    res.json({
      success: true,
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        paymentMethods: product.paymentMethods, // Assuming this field is present
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const removeCoupon = async (req, res) => {
  try {
    const { id } = req.body;

    const updated = await productModel.findByIdAndUpdate(
      id,
      { $unset: { couponCode: "", discount: "" } }, // Remove coupon & discount
      { new: true }
    );

    if (!updated) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Coupon removed" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id, name, price, originalPrice } = req.body;

    // Validate required fields
    if (!name || price === undefined) {
      return res.json({ success: false, message: "Name and price are required" });
    }

    const updateData = {
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      updatedAt: Date.now()
    };

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  validateCoupon,
  removeCoupon,
  updateProduct
};
