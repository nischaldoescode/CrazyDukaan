import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import React, { useContext, useState, useEffect } from "react";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [invalidPage, setInvalidPage] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const productsPerPage = 15;

  const location = useLocation();
  const navigate = useNavigate();

  // Set up mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // INITIAL PRODUCT LOADING
  // This effect runs once when component mounts to set up initial products
  useEffect(() => {
    if (products && products.length > 0 && !initialized) {
      setFilterProducts([...products]);
      setInitialized(true);
      setIsLoading(false);
    }
  }, [products, initialized]);

  // Parse page number from URL and set current page
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [location.search]);

  // Validate page number
  useEffect(() => {
    // Only validate after products are loaded
    if (filterProducts.length > 0 || initialized) {
      const totalPages = Math.ceil(filterProducts.length / productsPerPage);

      if (currentPage < 1 || (totalPages > 0 && currentPage > totalPages)) {
        setInvalidPage(true);
      } else {
        setInvalidPage(false);
      }
    }
  }, [currentPage, filterProducts, initialized]);

  // Helper function to update URL with page number
  const updateURL = (page) => {
    navigate(`/collection?page=${page}`);
    setCurrentPage(page);
  };

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
    updateURL(1); // Reset to page 1 when changing filters
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
    updateURL(1); // Reset to page 1 when changing filters
  };

  // Apply filters
  useEffect(() => {
    // Skip this effect until initial products are loaded
    if (!initialized) return;

    setIsLoading(true);
    let productsCopy = [...products];

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
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
        productsCopy = productsCopy.filter((item) => item.bestseller);
        break;
      default:
        // Keep current order
        break;
    }

    setTimeout(() => {
      setFilterProducts(productsCopy);

      // Check if current page is still valid after filtering
      const totalPages = Math.ceil(productsCopy.length / productsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        updateURL(totalPages); // If current page is now invalid, go to last page
      }

      setIsLoading(false);
    }, 300);
  }, [
    products,
    category,
    subCategory,
    search,
    showSearch,
    sortType,
    initialized,
  ]);

  // Update displayed products based on pagination
  useEffect(() => {
    if (filterProducts.length > 0) {
      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

      setDisplayProducts(
        filterProducts.slice(indexOfFirstProduct, indexOfLastProduct)
      );
    }
  }, [filterProducts, currentPage]);

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setFilterProducts([...products]); // Reset to all products immediately
    updateURL(1);
  };

  const changePage = (pageNumber) => {
    setIsLoading(true);
    updateURL(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filterProducts.length / productsPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      pageNumbers.push(1);

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Redirect to NotFound if page is invalid - AFTER all hooks
  if (invalidPage) {
    return <Navigate to="/NotFoundPage" replace />;
  }

  return (
    <>
      <Helmet>
        {/* Basic Meta */}
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Crazy Dukaan | Dukaan in your hand</title>
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
          content="https://res.cloudinary.com/dgia0ww1z/image/upload/v1744911085/zipkainysdn8qhlp0dix.png"
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
          content="https://res.cloudinary.com/dgia0ww1z/image/upload/v1744911085/zipkainysdn8qhlp0dix.png"
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
      </Helmet>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t mb-28">
        {/* Filter Options */}
        <div className="min-w-60">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
          >
            FILTERS
            <img
              className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
              src={assets.dropdown_icon}
              alt=""
            />
            <span className="w-8 sm:w-12 h-[1.7px] sm:h-[2.5px] bg-gray-700"></span>
          </p>
          {/* Category Filter */}
          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"Men"}
                  onChange={toggleCategory}
                  checked={category.includes("Men")}
                />{" "}
                Men
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"Women"}
                  onChange={toggleCategory}
                  checked={category.includes("Women")}
                />{" "}
                Women
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"Unisex"}
                  onChange={toggleCategory}
                  checked={category.includes("Unisex")}
                />{" "}
                Unisex
              </p>
            </div>
          </div>
          {/* SubCategory Filter */}
          <div
            className={`border border-gray-300 pl-5 py-3 my-5 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"Handwear"}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes("Handwear")}
                />{" "}
                Handwear
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"Shoewear"}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes("Shoewear")}
                />{" "}
                Shoewear
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"Winterwear"}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes("Winterwear")}
                />{" "}
                T-shirts
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"Eyewear"}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes("Eyewear")}
                />{" "}
                SunGlasses
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value="WMLadiesBag"
                  onChange={toggleSubCategory}
                  checked={subCategory.includes("WMLadiesBag")}
                />{" "}
                Women Hand Bag
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text1={"ALL"} text2={"COLLECTIONS"} />
            {/* Product Sort - CHANGED: Removed updateURL(1) to maintain current page */}
            <select
              onChange={(e) => {
                setSortType(e.target.value);
                // Removed updateURL(1) here so current page is maintained
              }}
              className="border-2 border-gray-300 text-sm px-2"
              value={sortType}
            >
              <option value="relavent">Sort by: Relavent</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
              <option value="bestseller">Sort by: Bestseller</option>
            </select>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          )}

          {/* Map Products or Empty State */}
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
                    <motion.div
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6"
                      layout
                    >
                      {displayProducts.map((item) => (
                        <motion.div
                          key={item._id}
                          variants={itemVariants}
                          layout
                        >
                          <ProductItem
                            name={item.name}
                            id={item._id}
                            price={item.price}
                            image={item.image}
                            originalPrice={item.originalPrice}
                            className="mb-28"
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <motion.div
                        className="flex justify-center mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <nav className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              changePage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            &lt;
                          </button>

                          {getPageNumbers().map((page, index) => (
                            <React.Fragment key={index}>
                              {page === "..." ? (
                                <span className="px-3 py-1">...</span>
                              ) : (
                                <button
                                  onClick={() => changePage(page)}
                                  className={`px-3 py-1 border rounded ${
                                    currentPage === page
                                      ? "bg-black text-white"
                                      : "hover:bg-gray-100"
                                  }`}
                                >
                                  {page}
                                </button>
                              )}
                            </React.Fragment>
                          ))}

                          <button
                            onClick={() =>
                              changePage(Math.min(totalPages, currentPage + 1))
                            }
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            &gt;
                          </button>
                        </nav>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <motion.div
                    className="flex flex-col items-center justify-center py-12 border border-gray-200 rounded-lg text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={assets.empty_search}
                      className="w-[18rem] h-[15rem] mb-4 rounded-sm"
                      alt="No products found"
                    />
                    <p className="text-gray-500 text-lg mb-2">
                      We didn't find what you were looking for
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      Try adjusting your filters or search term
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Collection;
