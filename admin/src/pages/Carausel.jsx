import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import toast from "react-hot-toast";
import { 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  Loader2, 
  AlertCircle,
  CheckCircle
} from "lucide-react";

const CarouselAdmin = ({ token }) => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  const fetchCarouselImages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${backendUrl}/api/carousel/images`);
      
      if (response.data.success) {
        setImages(response.data.images);
      } else {
        setError("Failed to load images: " + (response.data.message || "Unknown error"));
        toast.error("Failed to load carousel images.");
      }
    } catch (err) {
      console.error("Error fetching carousel images:", err);
      setError("Network error while loading images.");
      toast.error("Error fetching carousel images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    
    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image file");
      return;
    }
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      
      const response = await axios.post(
        `${backendUrl}/api/carousel/upload-image`,
        formData,
        {
          headers: { token },
        }
      );
      
      if (response.data.success) {
        toast.success("Image uploaded successfully");
        // Reset file input
        setSelectedFile(null);
        setPreviewUrl(null);
        // Refresh images
        fetchCarouselImages();
      } else {
        toast.error(response.data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error(err.response?.data?.message || "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId) => {
    // Check if deleting would leave less than 4 images
    if (images.length <= 4) {
      toast.error("Cannot delete image. Minimum 4 images required.");
      return;
    }
    
    try {
      const response = await axios.delete(
        `${backendUrl}/api/carousel/delete-image/${publicId}`, {
        headers: { token },
    });
      
      if (response.data.success) {
        toast.success("Image deleted successfully");
        // Remove from local state
        setImages(images.filter(img => img.public_id !== publicId));
      } else {
        toast.error(response.data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      toast.error(err.response?.data?.message || "Error deleting image");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Carousel Image Management
          </h1>
          <p className="text-gray-600 mt-1">
            Upload and manage front page carousel images (minimum 4 required)
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload New Image</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* File Input & Preview */}
            <div className="w-full sm:w-1/2">
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center ${
                  previewUrl ? "border-blue-400" : "border-gray-300 hover:border-gray-400"
                } transition-colors cursor-pointer`}
                onClick={() => document.getElementById("carousel-image-input").click()}
              >
                {previewUrl ? (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="h-48 mx-auto object-contain rounded"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      {selectedFile?.name} ({Math.round(selectedFile?.size / 1024)} KB)
                    </div>
                  </div>
                ) : (
                  <div className="py-12">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2 text-sm font-medium">
                      Click to select an image (max 2MB)
                    </div>
                  </div>
                )}
                <input
                  id="carousel-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="w-full sm:w-1/2 flex flex-col">
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-1">Requirements:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-1" /> 
                    Image format: JPG, PNG, WebP
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-1" /> 
                    Maximum size: 2MB
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-1" /> 
                    Recommended: 1920px width
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-1" /> 
                    Minimum 4 images required
                  </li>
                </ul>
              </div>
              
              <div className="mt-auto">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition duration-300 disabled:bg-blue-400"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2" size={18} />
                      Upload Image
                    </>
                  )}
                </button>
                
                {selectedFile && (
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Existing Images Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Current Carousel Images</h2>
            <div className="text-sm font-medium text-gray-500">
              {images.length} images total (minimum 4 required)
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
              <p className="text-gray-600">Loading images...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <div className="flex items-start">
                <AlertCircle className="mt-0.5 mr-2" size={18} />
                <div>
                  <p className="font-medium">Error loading images</p>
                  <p className="text-sm">{error}</p>
                  <button 
                    onClick={fetchCarouselImages} 
                    className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p>No carousel images found</p>
              <p className="text-sm">Upload at least 4 images to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div 
                  key={image.public_id} 
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video bg-gray-100">
                    <img 
                      src={image.url} 
                      alt={`Carousel ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-start justify-end p-2">
                      <div className="bg-white rounded-full shadow p-1">
                        <button 
                          onClick={() => handleDelete(image.public_id)}
                          disabled={images.length <= 4}
                          className="p-1 text-red-500 hover:text-red-700 disabled:text-gray-400 transition-colors"
                          title={images.length <= 4 ? "Cannot delete - minimum 4 images required" : "Delete image"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 text-xs text-gray-500">
                    <div className="truncate">{image.public_id.split('/').pop()}</div>
                    <div>{formatDate(image.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {images.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Note: The latest 4 images will be shown in the carousel
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarouselAdmin;