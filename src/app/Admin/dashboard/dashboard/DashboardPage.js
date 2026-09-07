// app/Admin/dashboard/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Raleway, Caveat } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 10,
    hasNext: false,
    hasPrevious: false,
  });

  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    discountPrice: "",
    category: "",
    subCategory: "",
    productFeatures: "",
    texture: "",
    scent: "",
    color: "",
    packaging: "",
    thumbnailImage: null,
    gallery: [],
    videoUrl: null,
    stockQuantity: "",
    isInStock: true,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isBackgroundUploading, setIsBackgroundUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'success', 'error'

  const categories = [
    "Skin Care",
    "Face Care",
    "Weight Management",
    "Body Enhancement",
    "Aphrodisiacs",
  ];

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch products with pagination
  const fetchProducts = async (
    page = 1,
    limit = 10,
    search = "",
    category = "",
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (search) params.append("search", search);
      if (category) params.append("category", category);

      const response = await fetch(
        `/api/auth/admin/product/getProduct?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || data.data || []);

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage || data.pagination.page || page,
            totalPages: data.pagination.totalPages || 1,
            totalProducts: data.pagination.total || 0,
            limit: data.pagination.limit || limit,
            hasNext: data.pagination.hasNext || false,
            hasPrevious: data.pagination.hasPrevious || false,
          });
        } else if (Array.isArray(data)) {
          setPagination((prev) => ({
            ...prev,
            totalProducts: data.length,
            totalPages: Math.ceil(data.length / limit),
          }));
        }
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(1, 10);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage, pagination.limit, searchTerm, categoryFilter);
      document
        .getElementById("products-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle search/filter changes
  const handleSearch = () => {
    fetchProducts(1, pagination.limit, searchTerm, categoryFilter);
  };

  // Handle Enter key on search
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle thumbnail file selection
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Thumbnail image must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setFormError("Please select a valid image file");
        return;
      }
      setFormData((prev) => ({ ...prev, thumbnailImage: file }));
      setFormError("");
    }
  };

  // Handle gallery file selection
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setFormError(`File ${file.name} is larger than 5MB`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        setFormError(`File ${file.name} is not a valid image`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...validFiles].slice(0, 5),
      }));
      setFormError("");
    }
  };

  // Handle video file selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setFormError("Video must be less than 50MB");
        return;
      }
      if (!file.type.startsWith("video/")) {
        setFormError("Please select a valid video file");
        return;
      }
      setFormData((prev) => ({ ...prev, videoUrl: file }));
      setFormError("");
    }
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const removeThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnailImage: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeVideo = () => {
    setFormData((prev) => ({ ...prev, videoUrl: null }));
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  // Submit form with floating progress indicator
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsBackgroundUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      // Validate required fields
      if (!formData.productName || !formData.productPrice || !formData.category) {
        setFormError("Please fill in all required fields");
        setUploadStatus('error');
        setTimeout(() => setUploadStatus(null), 3000);
        setIsBackgroundUploading(false);
        return;
      }

      // Close modal immediately
      setShowCreateModal(false);

      setUploadProgress(10);

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all text fields
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("productDescription", formData.productDescription);
      formDataToSend.append("productPrice", formData.productPrice);
      if (formData.discountPrice)
        formDataToSend.append("discountPrice", formData.discountPrice);
      formDataToSend.append("category", formData.category);
      if (formData.subCategory)
        formDataToSend.append("subCategory", formData.subCategory);
      if (formData.productFeatures)
        formDataToSend.append("productFeatures", formData.productFeatures);
      if (formData.texture) formDataToSend.append("texture", formData.texture);
      if (formData.scent) formDataToSend.append("scent", formData.scent);
      if (formData.color) formDataToSend.append("color", formData.color);
      if (formData.packaging)
        formDataToSend.append("packaging", formData.packaging);
      formDataToSend.append("stockQuantity", formData.stockQuantity);
      formDataToSend.append("isInStock", formData.isInStock);

      // Add thumbnail image file
      if (formData.thumbnailImage) {
        formDataToSend.append("thumbnailImage", formData.thumbnailImage);
        setUploadProgress(30);
      }

      // Add gallery images (multiple)
      if (formData.gallery.length > 0) {
        formData.gallery.forEach((file) => {
          formDataToSend.append("gallery", file);
        });
        setUploadProgress(50);
      }

      // Add video file
      if (formData.videoUrl) {
        formDataToSend.append("video", formData.videoUrl);
        setUploadProgress(70);
      }

      setUploadProgress(80);

      // Reset form
      setFormData({
        productName: "",
        productDescription: "",
        productPrice: "",
        discountPrice: "",
        category: "",
        subCategory: "",
        productFeatures: "",
        texture: "",
        scent: "",
        color: "",
        packaging: "",
        thumbnailImage: null,
        gallery: [],
        videoUrl: null,
        stockQuantity: "",
        isInStock: true,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";

      // Send to backend
      const response = await fetch("/api/products/Admin/createProduct", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      setUploadProgress(95);

      if (response.ok) {
        setUploadStatus('success');
        setUploadProgress(100);
        showToast(" Product created successfully!", "success");
        fetchProducts(pagination.currentPage, pagination.limit);
        setTimeout(() => setUploadStatus(null), 3000);
      } else {
        const data = await response.json();
        setFormError(data.message || "Failed to create product");
        setUploadStatus('error');
        setTimeout(() => setUploadStatus(null), 3000);
        showToast("❌ Failed to create product", "error");
      }
    } catch (err) {
      setFormError(err.message);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(null), 3000);
      showToast("❌ Error: " + err.message, "error");
    } finally {
      setIsBackgroundUploading(false);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const { currentPage, totalPages } = pagination;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      }

      if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }

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

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/Auth/Admin/signin");
        showToast("👋 Logged out successfully", "success");
      } else {
        showToast("❌ Logout failed", "error");
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast("❌ Error logging out", "error");
    }
  };

  // ⭐ FIX: Create filteredProducts for search and category filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalProducts = pagination.totalProducts || products.length;
  const inStock = products.filter((p) => p.isInStock !== false).length;
  const totalCategories = new Set(products.map((p) => p.category)).size;
  const avgRating = (
    products.reduce((acc, p) => acc + (p.averageRating || 0), 0) /
      products.length || 0
  ).toFixed(1);

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className={`${raleway.className} text-gray-500 mt-4`}>
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-sm animate-slide-in ${
            toastMessage.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <p className={`${raleway.className} text-sm font-medium`}>
            {toastMessage.message}
          </p>
        </div>
      )}

      {/* ⭐ Floating Upload Status - Bottom Right */}
      {uploadStatus && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-100 w-full">
            <div
              className={`h-full transition-all duration-500 ${
                uploadStatus === 'success' ? 'bg-green-500' :
                uploadStatus === 'error' ? 'bg-red-500' :
                'bg-black'
              }`}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {uploadStatus === 'uploading' && (
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                )}
                {uploadStatus === 'success' && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {uploadStatus === 'error' && (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`${raleway.className} font-medium text-sm text-gray-800`}>
                  {uploadStatus === 'uploading' && 'Creating Product...'}
                  {uploadStatus === 'success' && 'Product Created! '}
                  {uploadStatus === 'error' && 'Creation Failed ❌'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className={`${raleway.className} text-xs text-gray-500`}>
                    {uploadStatus === 'uploading' && `${Math.round(uploadProgress)}% complete`}
                    {uploadStatus === 'success' && 'Your product has been created successfully'}
                    {uploadStatus === 'error' && 'Something went wrong. Please try again.'}
                  </p>
                </div>
              </div>

              {/* Close button for success/error */}
              {(uploadStatus === 'success' || uploadStatus === 'error') && (
                <button
                  onClick={() => setUploadStatus(null)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1
                className={`${playfair.className} text-2xl font-light text-black`}
              >
                Product Dashboard
              </h1>
              <p className={`${caveat.className} text-gray-500 text-sm`}>
                Manage your product catalog
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 flex-1 sm:flex-none justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Product
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl"
        id="products-section"
      >
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className={`${raleway.className} text-sm text-gray-500`}>
              Total Products
            </p>
            <p className={`${playfair.className} text-2xl font-light mt-1`}>
              {totalProducts}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className={`${raleway.className} text-sm text-gray-500`}>
              In Stock
            </p>
            <p className={`${playfair.className} text-2xl font-light mt-1`}>
              {inStock}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className={`${raleway.className} text-sm text-gray-500`}>
              Categories
            </p>
            <p className={`${playfair.className} text-2xl font-light mt-1`}>
              {totalCategories}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className={`${raleway.className} text-sm text-gray-500`}>
              Avg Rating
            </p>
            <p className={`${playfair.className} text-2xl font-light mt-1`}>
              {avgRating}
            </p>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                Search
              </button>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                fetchProducts(1, pagination.limit, searchTerm, e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 relative">
                          <Image
                            src={
                              product.thumbnailImage ||
                              product.images?.[0] ||
                              "/placeholder.jpg"
                            }
                            alt={product.productName}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <p
                            className={`${raleway.className} font-medium text-sm text-black truncate max-w-[120px] sm:max-w-none`}
                          >
                            {product.productName}
                          </p>
                          <p
                            className={`${raleway.className} text-xs text-gray-500 hidden sm:block`}
                          >
                            {product.subCategory}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">
                          ₦{product.productPrice}
                        </p>
                        {product.discountPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            ₦{product.discountPrice}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm">{product.stockQuantity}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          product.isInStock !== false
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.isInStock !== false
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/Admin/products/edit/${product._id}`}
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                        <button
                          onClick={async () => {
                            if (confirm("Delete this product?")) {
                              try {
                                const response = await fetch(
                                  `/api/products/${product._id}`,
                                  {
                                    method: "DELETE",
                                    credentials: "include",
                                  },
                                );
                                if (response.ok) {
                                  fetchProducts(
                                    pagination.currentPage,
                                    pagination.limit,
                                  );
                                  showToast("🗑️ Product deleted", "success");
                                }
                              } catch (err) {
                                console.error("Delete failed:", err);
                              }
                            }
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className={`${raleway.className} text-sm text-gray-500`}>
                Showing{" "}
                {filteredProducts.length > 0
                  ? (pagination.currentPage - 1) * pagination.limit + 1
                  : 0}{" "}
                -{" "}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalProducts,
                )}{" "}
                of {pagination.totalProducts} products
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevious}
                  className={`px-3 py-2 border border-gray-200 rounded-lg text-sm transition-colors ${
                    pagination.hasPrevious
                      ? "hover:bg-black hover:text-white hover:border-black text-gray-600"
                      : "opacity-50 cursor-not-allowed text-gray-400"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-400 text-sm"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors min-w-[40px] ${
                        pagination.currentPage === page
                          ? "bg-black text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-black hover:text-white hover:border-black"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className={`px-3 py-2 border border-gray-200 rounded-lg text-sm transition-colors ${
                    pagination.hasNext
                      ? "hover:bg-black hover:text-white hover:border-black text-gray-600"
                      : "opacity-50 cursor-not-allowed text-gray-400"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className={`${raleway.className} text-sm text-gray-500`}>
                  Show:
                </span>
                <select
                  value={pagination.limit}
                  onChange={(e) => {
                    const newLimit = parseInt(e.target.value);
                    fetchProducts(1, newLimit, searchTerm, categoryFilter);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          )}

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className={`${raleway.className} text-gray-500`}>
                {pagination.totalProducts === 0
                  ? "No products yet. Create your first product!"
                  : "No products match your filters"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2
                className={`${playfair.className} text-xl font-light text-black`}
              >
                Create New Product
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3
                  className={`${raleway.className} font-medium text-sm text-gray-500 uppercase tracking-wider`}
                >
                  Basic Information
                </h3>

                <div>
                  <label
                    className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                  >
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                    placeholder="e.g., Hydrating Face Cream"
                  />
                </div>

                <div>
                  <label
                    className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                  >
                    Product Description *
                  </label>
                  <textarea
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                    >
                      Price (₦) *
                    </label>
                    <input
                      type="number"
                      name="productPrice"
                      value={formData.productPrice}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="49.99"
                    />
                  </div>
                  <div>
                    <label
                      className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                    >
                      Discount Price (₦)
                    </label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="29.99"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                    >
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                    >
                      Sub Category
                    </label>
                    <input
                      type="text"
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="e.g., Moisturizers"
                    />
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <h3
                  className={`${raleway.className} font-medium text-sm text-gray-500 uppercase tracking-wider`}
                >
                  Product Details
                </h3>

                <div>
                  <label
                    className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                  >
                    Features
                  </label>
                  <input
                    type="text"
                    name="productFeatures"
                    value={formData.productFeatures}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                    placeholder="e.g., Hydrating, Anti-Aging, SPF 30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                    >
                      Texture
                    </label>
                    <input
                      type="text"
                      name="texture"
                      value={formData.texture}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="e.g., Cream"
                    />
                  </div>
                  <div>
                    <label
                      className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                    >
                      Scent
                    </label>
                    <input
                      type="text"
                      name="scent"
                      value={formData.scent}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="e.g., Light Floral"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                    >
                      Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="e.g., White"
                    />
                  </div>
                  <div>
                    <label
                      className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                    >
                      Packaging
                    </label>
                    <input
                      type="text"
                      name="packaging"
                      value={formData.packaging}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="e.g., Jar"
                    />
                  </div>
                </div>
              </div>

              {/* Images - File Upload */}
              <div className="space-y-4">
                <h3
                  className={`${raleway.className} font-medium text-sm text-gray-500 uppercase tracking-wider`}
                >
                  Images
                </h3>

                {/* Thumbnail Image - File Input */}
                <div>
                  <label
                    className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                  >
                    Thumbnail Image *
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm file:mr-4 file:py-1.5 file:px-4 file:border-0 file:bg-black file:text-white file:rounded-lg file:cursor-pointer hover:file:bg-gray-800"
                      required={!formData.thumbnailImage}
                    />
                    {formData.thumbnailImage && (
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {formData.thumbnailImage && (
                    <div className="mt-2">
                      <p
                        className={`${raleway.className} text-xs text-green-600`}
                      >
                         {formData.thumbnailImage.name} (
                        {(formData.thumbnailImage.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  )}
                  <p
                    className={`${raleway.className} text-xs text-gray-400 mt-1`}
                  >
                    Upload a square image (recommended: 800x800px, max 5MB)
                  </p>
                </div>

                {/* Gallery Images - Multiple File Input */}
                <div>
                  <label
                    className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                  >
                    Gallery Images (up to 5)
                  </label>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm file:mr-4 file:py-1.5 file:px-4 file:border-0 file:bg-black file:text-white file:rounded-lg file:cursor-pointer hover:file:bg-gray-800"
                  />

                  {formData.gallery.length > 0 && (
                    <div className="mt-3">
                      <p
                        className={`${raleway.className} text-xs text-gray-500 mb-2`}
                      >
                        {formData.gallery.length} image
                        {formData.gallery.length > 1 ? "s" : ""} selected
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.gallery.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md"
                            >
                              ×
                            </button>
                            <p
                              className={`${raleway.className} text-[8px] text-gray-400 mt-0.5 text-center truncate max-w-[64px]`}
                            >
                              {file.name.substring(0, 8)}...
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p
                    className={`${raleway.className} text-xs text-gray-400 mt-1`}
                  >
                    Select multiple images at once (max 5, each max 5MB)
                  </p>
                </div>

                {/* Video Upload - File Input */}
                <div>
                  <label
                    className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                  >
                    Product Video (optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm file:mr-4 file:py-1.5 file:px-4 file:border-0 file:bg-black file:text-white file:rounded-lg file:cursor-pointer hover:file:bg-gray-800"
                    />
                    {formData.videoUrl && (
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {formData.videoUrl && (
                    <div className="mt-2">
                      <p
                        className={`${raleway.className} text-xs text-green-600`}
                      >
                         {formData.videoUrl.name} (
                        {(formData.videoUrl.size / (1024 * 1024)).toFixed(1)}{" "}
                        MB)
                      </p>
                    </div>
                  )}
                  <p
                    className={`${raleway.className} text-xs text-gray-400 mt-1`}
                  >
                    Upload a product video (max 50MB)
                  </p>
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-4">
                <h3
                  className={`${raleway.className} font-medium text-sm text-gray-500 uppercase tracking-wider`}
                >
                  Stock Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                    >
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="45"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isInStock"
                        checked={formData.isInStock}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <span
                        className={`${raleway.className} text-sm text-gray-600`}
                      >
                        In Stock
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading || isBackgroundUploading}
                  className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isBackgroundUploading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}