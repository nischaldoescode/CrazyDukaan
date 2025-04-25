import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import React, { useContext, useState, useEffect, useCallback } from "react";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [invalidPage, setInvalidPage] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const productsPerPage = 15;

  const location = useLocation();
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initial product loading
  useEffect(() => {
    if (products && products.length > 0 && !initialized) {
      setFilterProducts([...products]);
      setInitialized(true);
      setIsLoading(false);
    }
  }, [products, initialized]);

  // Parse page number from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [location.search]);

  // Validate page number and redirect if invalid
  useEffect(() => {
    if (filterProducts.length > 0 || initialized) {
      const totalPages = Math.max(1, Math.ceil(filterProducts.length / productsPerPage));
      
      if (currentPage < 1) {
        updateURL(1);
        setInvalidPage(false);
      } else if (totalPages > 0 && currentPage > totalPages) {
        if (filterProducts.length === 0) {
          updateURL(1);
        } else {
          updateURL(totalPages);
        }
        setInvalidPage(false);
      } else {
        setInvalidPage(false);
      }
    }
  }, [currentPage, filterProducts, initialized]);

  // URL and page management
  const updateURL = useCallback((page) => {
    navigate(`/collection?page=${page}`);
    setCurrentPage(page);
  }, [navigate]);

  const changePage = (page) => {
    if (page < 1 || page > Math.max(1, Math.ceil(filterProducts.length / productsPerPage))) {
      setInvalidPage(true);
      navigate("/not-found", { replace: true });
      return;
    }
    
    updateURL(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter management
  const toggleCategory = (value) => {
    setCategory(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
    updateURL(1);
  };

  const toggleSubCategory = (value) => {
    setSubCategory(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value) 
        : [...prev, value]
    );
    updateURL(1);
  };

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSortType("relevant");
    setFilterProducts([...products]);
    updateURL(1);
  };

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(filterProducts.length / productsPerPage));

  // Get page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      let startPage, endPage;
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
        pages.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
        pages.push("...");
      } else if (currentPage >= totalPages - 2) {
        pages.push("...");
        startPage = totalPages - 3;
        endPage = totalPages - 1;
        pages.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
      } else {
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Apply filters
  useEffect(() => {
    if (!initialized) return;

    setIsLoading(true);
    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => 
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => 
        subCategory.includes(item.subCategory)
      );
    }

    // Apply sorting
    switch (sortType) {
      case "low-high":
        productsCopy.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        productsCopy.sort((a, b) => b.price - a.price);
        break;
      case "bestseller":
        productsCopy = productsCopy.filter(item => item.bestseller);
        break;
      default:
        break;
    }

    // Use a short timeout to show loading state for better UX
    setTimeout(() => {
      setFilterProducts(productsCopy);
      
      // Validate current page after filtering
      const newTotalPages = Math.ceil(productsCopy.length / productsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        updateURL(newTotalPages);
      }
      
      setIsLoading(false);
    }, 300);
  }, [products, category, subCategory, search, showSearch, sortType, initialized, currentPage, updateURL]);

  // Update displayed products based on pagination
  useEffect(() => {
    if (filterProducts.length > 0) {
      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      setDisplayProducts(filterProducts.slice(indexOfFirstProduct, indexOfLastProduct));
    } else {
      setDisplayProducts([]);
    }
  }, [filterProducts, currentPage]);

  // Redirect to not found on invalid page
  if (invalidPage) {
    return <Navigate to="/not-found" replace />;
  }

  // Coupon-style filter chip component
  const FilterChip = ({ label, active, onClick }) => (
    <div
      onClick={onClick}
      className={`px-4 py-2 rounded-md cursor-pointer transition-all duration-200 flex items-center justify-between text-sm ${
        active 
        ? "bg-orange-50 text-orange-700 border border-orange-200 font-medium" 
        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
      }`}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {active && (
        <div 
          className="absolute top-0 left-0 h-full w-2" 
          style={{ 
            backgroundColor: '#F97316', 
            borderTopLeftRadius: '6px', 
            borderBottomLeftRadius: '6px' 
          }}
        />
      )}
      <span className={active ? "ml-1" : ""}>{label}</span>
      {active && (
        <span className="ml-2 flex items-center justify-center bg-orange-100 rounded-full h-5 w-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        {/* Basic Meta */}
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Crazy Dukaan | Explore Collection</title>
        <meta
          name="google-site-verification"
          content="Ge6IsUiKWA-SWtWQqAiihdEp-oczhyGYhtwewuGIYX4"
        />

        {/* Primary Meta Tags */}
        <meta
          name="description"
          content="Crazy Dukaan is your go-to eCommerce platform for the latest outfits, fashion products, and accessories. Find the best fashion deals online. Explore now."
        />
        <meta
          name="keywords"
          content="Crazy Dukaan, fashion collections, latest outfits, trendy wear, online shopping, eCommerce, streetwear, accessories, fashion store, Crazy Dukaan store, best deals, fashion retailer, online shopping, trendy outfits, fashion essentials, Crazy Dukaan collections,"
        />
        <meta name="author" content="Crazy Dukaan" />
        <meta name="robots" content="index, follow" />
        <meta
          name="robots"
          content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        {/* Open Graph (OG) Meta Tags */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.crazydukaan.store/collection"
        />
        <meta property="og:site_name" content="Crazy Dukaan" />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:title"
          content="Collection - Crazy Dukaan | Dukaan in your hand"
        />
        <meta
          property="og:description"
          content="Crazy Dukaan is your go-to eCommerce platform for the latest outfits, fashion products, and accessories. Find the best fashion deals online. Explore now."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dgia0ww1z/image/upload/v1745403100/cmo495utoruwwaon5g1y.webp"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />

        {/* Instagram (only) */}
        <meta name="instagram:site" content="@crazydukaan.store" />

        {/* Twitter Meta (optional fallback) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Crazy Dukaan | Dukaan in your hand"
        />
        <meta
          name="twitter:description"
          content="Discover exclusive collections at Crazy Dukaan – your go-to fashion hub. Shop trendy outfits, accessories, and fashion essentials delivered to your door."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dgia0ww1z/image/upload/v1745403100/cmo495utoruwwaon5g1y.webp"
        />

        {/* Theme & Appearance */}
        <meta name="theme-color" content="#ffffff" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href="https://crazydukaan.store/collection" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6XEBXHJCN7"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6XEBXHJCN7');
          `}
        </script>
      </Helmet>
<div className="pt-10 border-t mb-28 container mx-auto px-4">
        {/* Title and sort section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black w-full md:w-auto"
            value={sortType}
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
            <option value="bestseller">Sort by: Bestseller</option>
          </select>
        </div>

        {/* Desktop filters - horizontal layout */}
        <div className="hidden md:block mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="font-medium text-gray-800 tracking-wide">FILTERS</span>
              </div>
              
              {(category.length > 0 || subCategory.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-600 hover:text-black hover:underline flex items-center gap-1 transition-colors duration-200"
                >
                  <span>Clear all filters</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="p-5">
              {/* Categories - Horizontal layout */}
              <div className="mb-6">
                <p className="text-xs font-semibold tracking-wider uppercase text-gray-800 mb-3">Categories</p>
                <div className="flex flex-wrap gap-3">
                  <FilterChip label="Men" active={category.includes("Men")} onClick={() => toggleCategory("Men")} />
                  <FilterChip label="Women" active={category.includes("Women")} onClick={() => toggleCategory("Women")} />
                  <FilterChip label="Unisex" active={category.includes("Unisex")} onClick={() => toggleCategory("Unisex")} />
                </div>
              </div>
              
              {/* SubCategories - Horizontal layout */}
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-gray-800 mb-3">Product Type</p>
                <div className="flex flex-wrap gap-3">
                  <FilterChip label="Handwear" active={subCategory.includes("Handwear")} onClick={() => toggleSubCategory("Handwear")} />
                  <FilterChip label="Shoewear" active={subCategory.includes("Shoewear")} onClick={() => toggleSubCategory("Shoewear")} />
                  <FilterChip label="T-shirts" active={subCategory.includes("Winterwear")} onClick={() => toggleSubCategory("Winterwear")} />
                  <FilterChip label="SunGlasses" active={subCategory.includes("Eyewear")} onClick={() => toggleSubCategory("Eyewear")} />
                  <FilterChip label="Women Hand Bag" active={subCategory.includes("WMLadiesBag")} onClick={() => toggleSubCategory("WMLadiesBag")} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile filters - vertical layout with accordion style */}
          <div className="md:hidden w-full">
            <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
              <div 
                onClick={() => setShowFilter(!showFilter)}
                className="p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span className="font-medium text-gray-800 tracking-wide">FILTERS</span>
                </div>
                <div className="flex items-center gap-2">
                  {(category.length > 0 || subCategory.length > 0) && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {category.length + subCategory.length}
                    </span>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${showFilter ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showFilter ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 border-t border-gray-200">
                  {/* Categories */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold tracking-wider uppercase text-gray-800 mb-3 pb-2 border-b">
                      Categories
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <FilterChip label="Men" active={category.includes("Men")} onClick={() => toggleCategory("Men")} />
                      <FilterChip label="Women" active={category.includes("Women")} onClick={() => toggleCategory("Women")} />
                      <FilterChip label="Unisex" active={category.includes("Unisex")} onClick={() => toggleCategory("Unisex")} />
                    </div>
                  </div>

                  {/* SubCategories */}
                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-gray-800 mb-3 pb-2 border-b">
                      Product Type
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <FilterChip label="Handwear" active={subCategory.includes("Handwear")} onClick={() => toggleSubCategory("Handwear")} />
                      <FilterChip label="Shoewear" active={subCategory.includes("Shoewear")} onClick={() => toggleSubCategory("Shoewear")} />
                      <FilterChip label="T-shirts" active={subCategory.includes("Winterwear")} onClick={() => toggleSubCategory("Winterwear")} />
                      <FilterChip label="SunGlasses" active={subCategory.includes("Eyewear")} onClick={() => toggleSubCategory("Eyewear")} />
                      <FilterChip label="Women Hand Bag" active={subCategory.includes("WMLadiesBag")} onClick={() => toggleSubCategory("WMLadiesBag")} />
                    </div>
                  </div>

                  {/* Clear filters button in mobile */}
                  {(category.length > 0 || subCategory.length > 0) && (
                    <div className="mt-5 pt-3 border-t border-gray-200">
                      <button
                        onClick={clearFilters}
                        className="w-full py-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-md hover:bg-orange-100 transition duration-200 text-sm font-medium flex justify-center items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Active filters indicator for mobile (outside accordion) */}
            {showFilter === false && (category.length > 0 || subCategory.length > 0) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {category.map(cat => (
                  <div key={cat} className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-200">
                    <span>{cat}</span>
                    <svg 
                      onClick={() => toggleCategory(cat)}
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-3 w-3 cursor-pointer" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                ))}
                {subCategory.map(subCat => (
                  <div key={subCat} className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-200">
                    <span>{subCat}</span>
                    <svg 
                      onClick={() => toggleSubCategory(subCat)}
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-3 w-3 cursor-pointer" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Products Display */}
          <div className="flex-1">
            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
              </div>
            )}

            {/* Products grid or empty state */}
            <AnimatePresence mode="wait">
              {!isLoading && (
                <motion.div
                  key={`products-${currentPage}-${sortType}-${category.length}-${subCategory.length}`}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={containerVariants}
                >
                  {filterProducts.length > 0 ? (
                    <>
                      <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8" layout>
                        {displayProducts.map(item => (
                          <motion.div key={item._id} variants={itemVariants} layout>
                            <ProductItem
                              name={item.name}
                              id={item._id}
                              price={item.price}
                              image={item.image}
                              originalPrice={item.originalPrice}
                            />
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <motion.div
                          className="flex justify-center mt-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-center space-x-1">
                            {/* Previous Button */}
                            <button
                              onClick={() => currentPage > 1 && changePage(currentPage - 1)}
                              disabled={currentPage === 1}
                              className={`px-3 py-2 rounded-md text-sm font-medium ${
                                currentPage === 1
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-700 hover:bg-gray-100 transition-colors"
                              }`}
                              aria-label="Previous page"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            
                            {/* Page Numbers */}
                            {getPageNumbers().map((number, index) => (
                              <React.Fragment key={index}>
                                {number === "..." ? (
                                  <span className="px-3 py-2 text-gray-600">...</span>
                                ) : (
                                  <button
                                    onClick={() => number !== currentPage && changePage(number)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                      currentPage === number
                                        ? "bg-black text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                    aria-label={`Page ${number}`}
                                    aria-current={currentPage === number ? "page" : undefined}
                                  >
                                    {number}
                                  </button>
                                )}
                              </React.Fragment>
                            ))}
                            
                            {/* Next Button */}
                            <button
                              onClick={() => currentPage < totalPages && changePage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className={`px-3 py-2 rounded-md text-sm font-medium ${
                                currentPage === totalPages
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-700 hover:bg-gray-100 transition-colors"
                              }`}
                              aria-label="Next page"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <motion.div
                      className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-lg"
                      variants={itemVariants}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md">
                        We couldn't find any products matching your current filters. Try adjusting your selection or search criteria.
                      </p>
                      <button
                        onClick={clearFilters}
                        className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      >
                        Clear all filters
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Collection;
