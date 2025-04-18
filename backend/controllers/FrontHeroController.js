import carouselModel from "../models/HeroModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Get all carousel images
const getCarouselImages = async (req, res) => {
  try {
    let carousel = await carouselModel.findOne();
    
    if (!carousel) {
      // If no carousel document exists, create an empty one
      carousel = await carouselModel.create({ images: [] });
    }
    
    res.json({
      success: true,
      images: carousel.images
    });
  } catch (error) {
    console.error("Error getting carousel images:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving carousel images"
    });
  }
};

// Upload a new carousel image
const uploadCarouselImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "carousel",
      width: 1920,
      crop: "scale"
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    // Find or create carousel document
    let carousel = await carouselModel.findOne();
    if (!carousel) {
      carousel = await carouselModel.create({ images: [] });
    }

    // Add new image to carousel
    carousel.images.push({
      public_id: result.public_id,
      url: result.secure_url,
      createdAt: new Date()
    });

    carousel.updatedAt = new Date();
    await carousel.save();

    res.json({
      success: true,
      message: "Image uploaded successfully",
      image: {
        public_id: result.public_id,
        url: result.secure_url
      }
    });
  } catch (error) {
    console.error("Error uploading carousel image:", error);
    
    // Clean up local file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Error uploading image"
    });
  }
};

// Delete a carousel image
const deleteCarouselImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Image public ID is required"
      });
    }
    
    // Find carousel document
    const carousel = await carouselModel.findOne();
    
    if (!carousel) {
      return res.status(404).json({
        success: false,
        message: "Carousel not found"
      });
    }
    
    // Check if we will have at least 4 images after deletion
    if (carousel.images.length <= 4) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete image. Minimum 4 images required."
      });
    }
    
    // Delete from cloudinary
    await cloudinary.uploader.destroy(publicId);
    
    // Remove from database
    carousel.images = carousel.images.filter(img => img.public_id !== publicId);
    carousel.updatedAt = new Date();
    await carousel.save();
    
    res.json({
      success: true,
      message: "Image deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting carousel image:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting image"
    });
  }
};

export { getCarouselImages, uploadCarouselImage, deleteCarouselImage };