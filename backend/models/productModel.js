import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: [
        {
          url: String,
          public_id: String,
        }
      ],
      
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    colors: { type: Array, required: true },
    bestseller: { type: Boolean },
    date: { type: Number, required: true },
    couponCode: { type: String, required: false },
    discount: { type: Number, default: 0 },
    paymentMethod: { type: String, required: true },
})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel;