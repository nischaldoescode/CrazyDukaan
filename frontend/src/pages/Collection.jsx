import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { Helmet } from "react-helmet";
const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
        break;
      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products])

  useEffect(() => {
    sortProduct();
  }, [sortType])

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
  }

  return (
    <>
    <Helmet>
    {/* Basic Meta */}
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crazy Dukaan | Dukaan in your hand</title>
    <meta name="google-site-verification" content="Ge6IsUiKWA-SWtWQqAiihdEp-oczhyGYhtwewuGIYX4" />

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
    <meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="https://www.crazydukaan.store/collection" />

    {/* Open Graph (OG) Meta Tags */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.crazydukaan.store/collection" />
    <meta property="og:site_name" content="Crazy Dukaan" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="Collection - Crazy Dukaan | Dukaan in your hand" />
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
    <meta name="twitter:title" content="Crazy Dukaan | Dukaan in your hand" />
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
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t mb-4'>
      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" /> 
          <span className='w-8 sm:w-12 h-[1.7px] sm:h-[2.5px] bg-gray-700'></span>
        </p>
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory} checked={category.includes('Men')} /> Men
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory} checked={category.includes('Women')} /> Women
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory} checked={category.includes('Kids')} /> Kids
            </p>
          </div>
        </div>
        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Handwear'} onChange={toggleSubCategory} checked={subCategory.includes('Handwear')} /> Handwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Shoewear'} onChange={toggleSubCategory} checked={subCategory.includes('Shoewear')} /> Shoewear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory} checked={subCategory.includes('Winterwear')} /> T-shirts
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Eyewear'} onChange={toggleSubCategory} checked={subCategory.includes('Eyewear')} /> SunGlasses
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          {/* Product Sort */}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products or Empty State */}
        {filterProducts.length > 0 ? (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {filterProducts.map((item, index) => (
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} originalPrice={item.originalPrice} className='mb-28'/>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-12 border border-gray-200 rounded-lg text-center'>
            <img src={assets.empty_search} className='w-[18rem] h-[15rem] mb-4 rounded-sm' alt="No products found" />
            <p className='text-gray-500 text-lg mb-2'>We didn't find what you were looking for</p>
            <p className='text-gray-400 text-sm mb-4'>Try adjusting your filters or search term</p>
            <button 
              onClick={clearFilters}
              className='px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm'
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default Collection;
