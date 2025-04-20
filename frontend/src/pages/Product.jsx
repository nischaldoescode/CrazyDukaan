import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { useNavigate } from "react-router-dom";
import WhatsAppButton from "../components/whatsappbutton";
import { toast } from "react-toastify";

const Product = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [size, setSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchProductData = () => {
            const item = products.find((item) => item._id === productId);
            if (item) {
                setProductData(item);
                setMainImage(item.image[0]);
                if (item.colors && item.colors.length > 0) {
                    setSelectedColor(item.colors[0]);
                }
            } else {
                toast.error("Product not found");
                navigate("/");
            }
        };

        if (products.length > 0) {
            fetchProductData();
        }
    }, [productId, products, navigate]);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleAddToCart = () => {
        if (!size && !(productData.sizes?.[0] === "one-size")) {
            toast.error("Please select a size");
            return;
        }

        if (!selectedColor) {
            toast.error("Please select a color");
            return;
        }

        addToCart(
            productData._id,
            size || productData.sizes[0],
            selectedColor
        );
        navigate("/cart");
    };

    if (!productData) {
        return <div className="opacity-0"></div>;
    }

    return (
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Product Data */}
            <div className="flex gap-8 xl:gap-12 flex-col lg:flex-row">
                {/* Product Images */}
                <div className="flex-1 flex flex-col-reverse gap-4 sm:flex-row px-0 sm:px-4">
                    {/* Thumbnail images */}
                    <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[650px] py-2 sm:py-0">
                        {productData.image.map((item, index) => (
                            <div 
                                key={index}
                                className={`flex-shrink-0 cursor-pointer border-2 rounded-lg transition-all duration-300 ease-in-out overflow-hidden
                                    ${mainImage === item.url ? 
                                        'border-orange-500 scale-[1.02] shadow-md' : 
                                        'border-gray-200 hover:border-gray-400'
                                    }
                                    w-[85px] h-[85px] sm:w-[105px] sm:h-[105px] lg:w-[125px] lg:h-[125px]
                                `}
                                onClick={() => setMainImage(item)}
                            >
                                <img
                                    src={item?.url}
                                    className="w-full h-full object-cover"
                                    alt={`Thumbnail ${index + 1}`}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Main image container */}
                    <div className="relative w-full sm:w-[calc(100%-120px)] lg:w-[calc(100%-140px)]">
                        <div 
                            className={`relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-lg transition-all duration-500
                                ${isHovered ? 'shadow-xl' : 'shadow-md'}
                                aspect-square sm:aspect-auto sm:h-[500px] lg:h-[600px] xl:h-[700px]
                            `}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <img 
                                className={`w-full h-full object-contain transition-transform duration-700 ease-in-out
                                    ${isHovered ? 'scale-105' : 'scale-100'}
                                `}
                                src={mainImage?.url} 
                                alt={productData.name}
                                loading="eager"
                            />
                            
                            {/* Magnifier effect on hover */}
                            {isHovered && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute w-40 h-40 border-2 border-white rounded-full opacity-70 pointer-events-none" 
                                        style={{
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
                                            mixBlendMode: 'overlay'
                                        }}
                                    ></div>
                                </div>
                            )}
                            
                            {/* Zoom hint */}
                            <div className={`absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs transition-opacity duration-300
                                ${isHovered ? 'opacity-100' : 'opacity-0'}
                            `}>
                                Hover to zoom
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Info - Sticky on desktop */}
                <div className="flex-1 px-4 sm:px-6 lg:sticky lg:top-4 lg:self-start lg:max-w-md xl:max-w-lg">
                    <h1 className="font-bold text-2xl sm:text-3xl mt-2 text-gray-900">{productData.name}</h1>
                    <div className="flex flex-row gap-3 text-center">
                    <p className="mt-4 text-3xl font-semibold text-gray-800 text-center">
                        {currency}
                        {productData.price ? productData.price.toLocaleString() : "0"}
                    </p>
                    <p className="mt-5 text-xl font-semibold text-gray-400 text-center line-through decoration-black">
                        {currency}
                        {productData.originalPrice ? productData.originalPrice.toLocaleString() : ""}
                    </p>
                    </div>
                    
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 whitespace-pre-line">
                            {productData.description
                                .split(/(?<=[.!?])\s+/) // Split on `.`, `!`, `?` followed by space
                                .map((line, idx) => `${line}\n`)
                                .join('')}
                      </p>
                </div>

                    {/* Color Selection */}
                    {productData.colors?.length > 0 && (
                        <div className="mt-8">
                            <p className="text-sm font-medium text-gray-700 mb-3">Select Color</p>
                            <div className="flex gap-3 flex-wrap">
                                {productData.colors.map((color, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleColorSelect(color)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                                            ${selectedColor === color ? 
                                                'border-orange-500 ring-2 ring-offset-2 ring-orange-300' : 
                                                'border-gray-200 hover:border-gray-400'
                                            }
                                            transform hover:scale-110
                                        `}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    >
                                        {selectedColor === color && (
                                            <svg className="w-5 h-5 text-white mix-blend-difference" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size Selection */}
                    <div className="mt-8">
                        <p className="text-sm font-medium text-gray-700 mb-3">Select Size</p>
                        <div className="flex gap-3 flex-wrap">
                            {productData.sizes.map((item, index) => (
                                <button
                                    onClick={() => setSize(item)}
                                    className={`border-2 py-2 px-5 rounded-lg transition-all duration-200
                                        ${item === size ? 
                                            "border-orange-500 bg-orange-50 text-orange-800 font-medium" : 
                                            "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                        }
                                        hover:shadow-md hover:scale-105
                                    `}
                                    key={index}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                            <div className="mt-2">
            <span className="text-sm font-medium text-gray-500">
              Category:{" "}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {productData.category}
            </span>
        </div>
                    <button
                        onClick={handleAddToCart}
                        className="w-full mt-10 bg-black text-white px-8 py-4 text-sm font-medium rounded-lg hover:bg-gray-800 
                            transition-all duration-300 transform hover:scale-[1.02] active:scale-100
                            shadow-lg hover:shadow-xl
                        "
                    >
                        ADD TO CART
                    </button>
                    
                    <WhatsAppButton className="mt-4" />
                    
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex flex-col gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
  <span>Genuine & Affordable</span>
</div>

{productData.paymentMethod === 'COD' ? (
  <div className="flex items-center gap-2">
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>Cash on delivery available</span>
  </div>
) : (
  <div className="flex items-center gap-2">
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
    <span>COD not available. For COD, Buy via WhatsApp</span>
  </div>
)}

<div className="flex items-center gap-2">
  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
  <span>Easy 7-day returns & exchanges</span>
</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description & Review Section */}
            <div className="mt-20 mb-16">
                <div className="border px-6 py-8 text-gray-600">
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Premium quality materials for long-lasting durability</li>
                        <li>Manufacturer warranty included</li>
                        <li>Designed for comfort and style</li>
                        <li>Easy to maintain and clean</li>
                    </ul>
                </div>
            </div>

            {/* Related Products */}
            <RelatedProducts
                category={productData.category}
                subCategory={productData.subCategory}
            />
        </div>
    );
};

export default Product;
