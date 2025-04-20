import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import shipmentRoutes from './routes/shipmentRoutes.js';
import platfromfeeroutes from './routes/platformFeeRoutes.js';
import heroRoutes from "./routes/heroRoutes.js";
import globalCouponRouter from './routes/globalCouponRoutes.js';


// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/shipment', shipmentRoutes);
app.use('/api/platform', platfromfeeroutes);
// app.use('/api/hero', heroRoutes);
// Add this with your other routes
app.use("/api/carousel", heroRoutes);
app.use('/api/global-coupon', globalCouponRouter);

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))
