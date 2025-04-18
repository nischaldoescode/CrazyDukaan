import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { motion } from 'framer-motion'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {
    const { products } = useContext(ShopContext)
    const [latestProducts, setLatestProducts] = useState([])

    useEffect(() => {
        setLatestProducts(products.slice(0, 10))
    }, [products])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    return (
        <motion.div 
            className='my-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
        >
            <div className='text-center py-8 md:py-12'>
                <Title text1={'LATEST'} text2={'COLLECTIONS'} />
                <motion.p 
                    className='max-w-2xl mx-auto text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Discover our newest arrivals - carefully curated pieces that blend timeless elegance with contemporary style.
                </motion.p>
            </div>

            {/* Responsive Product Grid */}
            <motion.div 
                className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5'
                variants={containerVariants}
            >
                {latestProducts.map((item, index) => (
                    <motion.div 
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="group"
                    >
                        <ProductItem 
                            id={item._id} 
                            image={item.image} 
                            name={item.name} 
                            price={item.price} 
                            className="group-hover:shadow-lg transition-all duration-300"
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* View More Button */}
            {products.length > 10 && (
                <motion.div 
                    className="text-center mt-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <button className="px-6 py-2 bg-black text-white text-sm sm:text-base rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg">
                        View All Collections
                    </button>
                </motion.div>
            )}
        </motion.div>
    )
}

export default LatestCollection