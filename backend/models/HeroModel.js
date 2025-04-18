// models/carouselModel.js
import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema({
  images: [
    {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const carouselModel = mongoose.model("Carousel", carouselSchema);

export default carouselModel;