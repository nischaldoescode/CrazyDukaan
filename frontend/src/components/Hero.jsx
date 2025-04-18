import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import './index.css';
import { useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import axios from "axios";
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
const Hero = () => {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Adjust this based on your environment

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/carousel/images`);
        
        if (response.data.success && response.data.images.length > 0) {
          const sortedImages = response.data.images
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4) // You can keep this if you only ever want up to 4
            .map(img => img.url);
        
          setImages(sortedImages);
        } else {
          setError("Error Loading images");
        
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    // Auto-advance slides if not hovering
    if (images.length === 0) return;
    
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }
    }, 4000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen max-h-[100vh] bg-[#f8f8f8] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin text-blue-500 mb-2" size={40} />
          <p className="text-gray-600">Loading carousel...</p>
        </div>
      </div>
    );
  }

  if (error || images.length < 0) {
    return (
      <div className="relative w-full h-screen max-h-[100vh] bg-[#f8f8f8] flex items-center justify-center">
        <div className="text-center max-w-md p-4">
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            {error || "Not enough carousel images"}
          </h3>
          <p className="text-gray-600">
            Loading Content Wait....
          </p>
        </div>
      </div>
    );
  }


  return (
    <div 
      className="relative w-full h-screen max-h-[100vh] overflow-hidden bg-[#f8f8f8] rounded-lg"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 rounded-2xl transition-all duration-1000 ease-in-out overflow-hidden ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <img 
            src={img} 
            alt={`Slide ${index + 1}`} 
            className="w-full h-full object-contain object-center rounded-2xl shadow-lg" 
          />
        </div>
      ))}

      {/* Desktop text overlay */}
      <div className="hidden md:flex absolute inset-0 items-center justify-start pl-8 md:pl-14 lg:pl-24 xl:pl-36 2xl:pl-52">
        <div
          className="relative z-10 max-w-xl p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl animate-fadeInLeft"
        >
          <div className="text-[#414141] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-0.5 bg-[#414141]" />
              <p className="text-sm font-medium uppercase tracking-widest">
                Our Bestsellers
              </p>
            </div>
            <div className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight animate-slideUp">
              <Typewriter
                options={{
                  strings: ['Latest Arrivals', 'Latest <span style="color: #d97706">Arrivals</span>'],
                  autoStart: true,
                  loop: true,
                  cursor: '_',
                  delay: 70,
                  deleteSpeed: 50
                }}
              />
            </div>
            <div className="text-lg text-gray-600 animate-slideUp delay-100">
              <Typewriter
                options={{
                  strings: [
                    'Discover our <span style="color: #d97706">premium collection</span> crafted with excellence.',
                    'Discover our <span style="color: #d97706">premium collection</span> crafted with excellence.'
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 30,
                  deleteSpeed: 40, // Don't delete the text
                  cursor: '_', // Remove cursor after typing
                }}
              />
            </div>
            <button className="mt-4 px-8 py-3 bg-amber-600 text-white font-medium rounded-full hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/30"
            onClick={() => {
            navigate('/collection');
          }}>
              SHOP NOW
            </button>
          </div>
        </div>
      </div>

      {/* Mobile text block */}
      <div className="md:hidden absolute bottom-0 w-full">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-t-3xl shadow-xl">
          <div className="text-[#414141] space-y-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-0.5 bg-[#414141]" />
              <p className="text-xs font-medium uppercase tracking-widest">
                Our Bestsellers
              </p>
            </div>
            <div className="text-3xl font-semibold leading-tight">
              <Typewriter
                options={{
                  strings: ['Latest Arrivals', 'Latest <span style="color: #d97706">Arrivals</span>'],
                  autoStart: true,
                  loop: false,
                  cursor: '_',
                  delay: 70,
                  deleteSpeed: 60
                }}
              />
            </div>
            <div className="text-lg text-gray-600 animate-slideUp delay-100">
              <Typewriter
                options={{
                  strings: [
                    'Discover our <span style="color: #d97706">premium collection</span> crafted with excellence.',
                    'Discover our <span style="color: #d97706">premium collection</span> crafted with excellence.'
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 30,
                  deleteSpeed: 40, // Don't delete the text
                  cursor: '_', // Remove cursor after typing
                }}
              />
            </div>
            <button className="mt-3 px-6 py-2 bg-amber-600 text-white text-sm font-medium rounded-full shadow-md">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;