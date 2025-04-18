import React, { useContext, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';

const ProductScrollingBox = () => {
  const { products } = useContext(ShopContext);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="py-12 px-4 md:px-8 lg:px-12 my-12">
      <div className="flex justify-between items-center mb-8">
        
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-[#A3B5FB] bg-clip-text text-transparent">
        <p className='w-8 sm:w-12 h-[1.7px] sm:h-[2.5px] bg-gray-700'></p>
          Featured Collection
        </h2> 
        <button 
          onClick={() => navigate('/collection')}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-[#A3B5FB] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:brightness-110"
        >
          View Collection →
        </button>
      </div>
      
      <div className="relative group">
        {/* Desktop scroll buttons */}
        <button 
          onClick={scrollLeft}
          className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-200 ml-2"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Product carousel */}
        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 md:space-x-6 overflow-x-auto py-4 px-2 scrollbar-hide"
        >
          {products.slice(0, 10).map((product) => (
            <div 
              key={product._id}
              className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100">
                {/* Product Image with blended overlay */}
                <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden group">
                  <img 
                    src={product.image[0].url} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#A3B5FB]/10 to-orange-100/10 mix-blend-overlay"></div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 flex-grow flex flex-col">
                  <h3 className="font-medium text-gray-800 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                  <div className="mt-auto pt-3 flex justify-between items-center">
                    <span className="text-base sm:text-lg font-bold text-orange-600">₹{product.price}</span>
                    {product.sizes?.[0] && product.sizes[0] !== "one-size" && (
                      <span className="text-xs px-2 py-1 bg-[#A3B5FB]/10 text-[#A3B5FB] rounded-full border border-[#A3B5FB]/20">
                        {product.sizes[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={scrollRight}
          className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-200 mr-2"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A3B5FB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Mobile controls */}
      <div className="md:hidden flex justify-center gap-4 mt-6">
        <button 
          onClick={scrollLeft}
          className="p-2 rounded-full bg-white shadow-md border border-gray-200 text-orange-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={() => navigate('/collection')}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-[#A3B5FB] text-white rounded-full shadow-md text-sm"
        >
          View All
        </button>
        <button 
          onClick={scrollRight}
          className="p-2 rounded-full bg-white shadow-md border border-gray-200 text-[#A3B5FB]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductScrollingBox;