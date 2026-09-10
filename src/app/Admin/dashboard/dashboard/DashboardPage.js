// app/Admin/dashboard/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Raleway, Caveat } from "next/font/google";
import uploadToCloudinary from "../../../../../Commponets/cloudinary/uploadCoudinary"; // Import the upload function

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

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

  // Fetch products with proper pagination
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
        const result = await response.json();

        let productsData = [];
        let paginationData = {};

        if (result.data && Array.isArray(result.data)) {
          productsData = result.data;
          paginationData = result.pagination || {};
        } else if (result.products && Array.isArray(result.products)) {
          productsData = result.products;
          paginationData = result.pagination || {};
        } else if (Array.isArray(result)) {
          productsData = result;
          paginationData = {};
        } else {
          productsData = [];
          paginationData = {};
        }

        const uniqueProducts = productsData.filter(
          (product, index, self) =>
            index === self.findIndex((p) => p._id === product._id),
        );

        setProducts(uniqueProducts);

        const currentPage =
          paginationData.page || paginationData.currentPage || page;
        const totalPages =
          paginationData.totalPages ||
          Math.ceil((paginationData.total || uniqueProducts.length) / limit);
        const total =
          paginationData.total ||
          paginationData.totalProducts ||
          uniqueProducts.length;

        setPagination({
          currentPage: currentPage,
          totalPages: totalPages,
          totalProducts: total,
          limit: paginationData.limit || limit,
          hasNext: currentPage < totalPages,
          hasPrevious: currentPage > 1,
        });

        console.log(
          `📄 Page ${currentPage} of ${totalPages}, showing ${uniqueProducts.length} products`,
        );
      } else {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        setError(errorData.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    const initialFetch = setTimeout(() => {
      fetchProducts(1, 10);
    }, 0);

    return () => clearTimeout(initialFetch);
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    console.log(`🔄 Changing to page ${newPage}`);
    fetchProducts(newPage, pagination.limit, searchTerm, categoryFilter);
    document
      .getElementById("products-section")
      ?.scrollIntoView({ behavior: "smooth" });
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

  // Delete product function
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(
        `/api/products/Admin/deleteProduct?id=${productToDelete._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        showToast(
          `🗑️ ${productToDelete.productName} deleted successfully`,
          "success",
        );
        fetchProducts(pagination.currentPage, pagination.limit);
        setShowDeleteModal(false);
        setProductToDelete(null);
      } else {
        const data = await response.json();
        showToast(data.message || "Failed to delete product", "error");
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
    setDeleteLoading(false);
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsBackgroundUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);
    setUploadMessage("Preparing...");

    try {
      // Validate required fields
      if (
        !formData.productName ||
        !formData.productPrice ||
        !formData.category
      ) {
        setFormError("Please fill in all required fields");
        setUploadStatus("error");
        setUploadMessage("Missing required fields");
        setTimeout(() => setUploadStatus(null), 3000);
        setIsBackgroundUploading(false);
        return;
      }

      if (!formData.thumbnailImage) {
        setFormError("Thumbnail image is required");
        setUploadStatus("error");
        setUploadMessage("Thumbnail is required");
        setTimeout(() => setUploadStatus(null), 3000);
        setIsBackgroundUploading(false);
        return;
      }

      setShowCreateModal(false);
      setUploadStatus("Uploading files...");
      setUploadProgress(10);

      //  FIX 1: Upload thumbnail
      let thumbnailUrl = null;
      if (formData.thumbnailImage) {
        setUploadStatus("Uploading thumbnail...");
        thumbnailUrl = await uploadToCloudinary(
          formData.thumbnailImage,
          "thumbnail",
        );
        setUploadProgress(30);
      }

      //  FIX 2: Upload gallery images one by one
      const galleryUrls = [];
      if (formData.gallery.length > 0) {
        for (let i = 0; i < formData.gallery.length; i++) {
          setUploadStatus(
            `Uploading image ${i + 1} of ${formData.gallery.length}...`,
          );
          const url = await uploadToCloudinary(formData.gallery[i], "gallery");
          galleryUrls.push(url);
          setUploadProgress(30 + ((i + 1) / formData.gallery.length) * 30);
        }
      }

      //  FIX 3: Upload video (with correct setUploadStatus)
      let videoUrl = null;
      if (formData.videoUrl) {
        setUploadStatus("Uploading video...");
        setUploadProgress(65);
        videoUrl = await uploadToCloudinary(formData.videoUrl, "video");
        setUploadProgress(75);
      }

      setUploadProgress(80);
      setUploadStatus("Creating product...");

      //  FIX 4: Send JSON (not FormData) since files are already uploaded
      const productPayload = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        productPrice: parseFloat(formData.productPrice),
        discountPrice: formData.discountPrice
          ? parseFloat(formData.discountPrice)
          : null,
        category: formData.category,
        subCategory: formData.subCategory,
        productFeatures: formData.productFeatures,
        texture: formData.texture,
        scent: formData.scent,
        color: formData.color,
        packaging: formData.packaging,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        isInStock: formData.isInStock,
        //  These are now URLs, not files
        thumbnailImage: thumbnailUrl,
        images: galleryUrls,
        videoUrl: videoUrl,
      };

      

      //  FIX 5: Send as JSON with proper headers
      const response = await fetch("/api/products/Admin/createProduct", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productPayload), //  Fixed - now using JSON
      });

      setUploadProgress(95);

      if (response.ok) {
        setUploadStatus("success");
        setUploadProgress(100);
        showToast(" Product created successfully!", "success");

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

        fetchProducts(pagination.currentPage, pagination.limit);
        setTimeout(() => setUploadStatus(null), 3000);
      } else {
        const data = await response.json();
        setFormError(data.message || "Failed to create product");
        setUploadStatus("error");
        setTimeout(() => setUploadStatus(null), 3000);
        showToast(
          "❌ " + (data.message || "Failed to create product"),
          "error",
        );
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setFormError(err.message);
      setUploadStatus("error");
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
        method: "GET",
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

  // Filter products for search and category
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
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-[280px] h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <div>
              <h1
                className={`${playfair.className} text-2xl font-light text-gray-800`}
              >
                Admin
              </h1>
              <p className={`${caveat.className} text-sm text-gray-500`}>
                Dashboard
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
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

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <Link
              href="/Admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl transition-colors"
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className={`${raleway.className} font-medium`}>
                Products
              </span>
            </Link>
            <Link
              href="/Admin/account"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
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
                  d="M3 10h18M3 14h18M5 18h14M3 6l9-4 9 4v2H3V6z"
                />
              </svg>
              <span className={`${raleway.className} font-medium`}>
                Bank Accounts
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors mt-8"
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
              <span className={`${raleway.className} font-medium`}>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-[280px] min-h-screen">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed top-4 right-4 z-50 px-5 py-3.5 rounded-xl shadow-lg max-w-[calc(100%-2rem)] sm:max-w-sm animate-slide-in ${
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

        {/* Upload Status */}
        {uploadStatus && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
              {/* Progress bar top */}
              <div className="h-1.5 bg-gray-100 w-full">
                <div
                  className={`h-full transition-all duration-500 ${
                    uploadStatus === "success"
                      ? "bg-green-500"
                      : uploadStatus === "error"
                        ? "bg-red-500"
                        : "bg-gray-900"
                  }`}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <div className="p-6">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  {uploadStatus !== "success" && uploadStatus !== "error" && (
                    <div className="w-14 h-14 border-3 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                  )}
                  {uploadStatus === "success" && (
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                  {uploadStatus === "error" && (
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-red-600"
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
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3
                  className={`${playfair.className} text-xl font-light text-gray-800 text-center mb-1`}
                >
                  {uploadStatus === "success" && "Product Created! 🎉"}
                  {uploadStatus === "error" && "Creation Failed"}
                  {uploadStatus !== "success" &&
                    uploadStatus !== "error" &&
                    "Creating Product"}
                </h3>

                {/* Status message - THIS is what was missing */}
                <p
                  className={`${raleway.className} text-sm text-gray-500 text-center mb-4`}
                >
                  {uploadStatus === "success" &&
                    "Your product has been created successfully"}
                  {uploadStatus === "error" &&
                    "Something went wrong. Please try again."}
                  {/*  Show the actual status string while uploading */}
                  {uploadStatus !== "success" &&
                    uploadStatus !== "error" &&
                    uploadStatus}
                </p>

                {/* Percentage */}
                {uploadStatus !== "success" && uploadStatus !== "error" && (
                  <div className="text-center">
                    <p
                      className={`${raleway.className} text-3xl font-light text-gray-900`}
                    >
                      {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}

                {/* Close button on done/error */}
                {(uploadStatus === "success" || uploadStatus === "error") && (
                  <button
                    onClick={() => setUploadStatus(null)}
                    className="mt-4 w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    {uploadStatus === "success" ? "Done" : "Close"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && productToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
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
                </div>
                <h3
                  className={`${playfair.className} text-xl font-light text-gray-800 mb-2`}
                >
                  Delete Product
                </h3>
                <p
                  className={`${raleway.className} text-sm text-gray-500 mb-6`}
                >
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-gray-800">
                    &quot;{productToDelete.productName}&quot;
                  </span>
                  ? This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={closeDeleteModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium order-2 sm:order-1"
                    disabled={deleteLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteProduct}
                    disabled={deleteLoading}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2 order-1 sm:order-2"
                  >
                    {deleteLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Delete Product"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600 hover:text-gray-800 transition-colors p-1"
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div className="min-w-0">
                  <h1
                    className={`${playfair.className} text-xl sm:text-2xl font-light text-gray-800 truncate`}
                  >
                    Products
                  </h1>
                  <p
                    className={`${caveat.className} text-xs sm:text-sm text-gray-500 truncate`}
                  >
                    Manage your product catalog
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 sm:p-6 max-w-7xl mx-auto" id="products-section">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
              <p
                className={`${raleway.className} text-xs sm:text-sm text-gray-500`}
              >
                Total Products
              </p>
              <p
                className={`${playfair.className} text-xl sm:text-2xl font-light mt-1 text-gray-800`}
              >
                {totalProducts}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
              <p
                className={`${raleway.className} text-xs sm:text-sm text-gray-500`}
              >
                In Stock
              </p>
              <p
                className={`${playfair.className} text-xl sm:text-2xl font-light mt-1 text-green-600`}
              >
                {inStock}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
              <p
                className={`${raleway.className} text-xs sm:text-sm text-gray-500`}
              >
                Categories
              </p>
              <p
                className={`${playfair.className} text-xl sm:text-2xl font-light mt-1 text-blue-600`}
              >
                {totalCategories}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border">
              <p
                className={`${raleway.className} text-xs sm:text-sm text-gray-500`}
              >
                Avg Rating
              </p>
              <p
                className={`${playfair.className} text-xl sm:text-2xl font-light mt-1 text-amber-600`}
              >
                {avgRating}
              </p>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Filters */}
            <div className="p-3 sm:p-4 border-b">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="flex-1 px-3 sm:px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 sm:px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm whitespace-nowrap"
                  >
                    Search
                  </button>
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    fetchProducts(
                      1,
                      pagination.limit,
                      searchTerm,
                      e.target.value,
                    );
                  }}
                  className="px-3 sm:px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm w-full sm:w-auto"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Category
                    </th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Stock
                    </th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
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
                          <div className="min-w-0">
                            <p
                              className={`${raleway.className} font-medium text-sm text-gray-800 truncate max-w-[100px] sm:max-w-[150px]`}
                            >
                              {product.productName}
                            </p>
                            <p
                              className={`${raleway.className} text-xs text-gray-500 hidden sm:block truncate`}
                            >
                              {product.subCategory}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 hidden sm:table-cell">
                        <span className="px-2.5 py-1 bg-gray-100 text-xs rounded-full text-gray-600 whitespace-nowrap">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <p className="text-sm font-medium text-gray-800">
                          ₦{product.productPrice}
                        </p>
                        {product.discountPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            ₦{product.discountPrice}
                          </p>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-600">
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3 hidden lg:table-cell">
                        <span
                          className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
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
                      <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <div className="flex gap-1 sm:gap-2">
                          <Link
                            href={`/Admin/edit/${product._id}`}
                            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
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
                            onClick={() => openDeleteModal(product)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
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
              <div className="px-3 sm:px-4 py-3 sm:py-4 border-t">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p
                    className={`${raleway.className} text-xs sm:text-sm text-gray-500 text-center sm:text-left`}
                  >
                    Showing{" "}
                    {filteredProducts.length > 0
                      ? (pagination.currentPage - 1) * pagination.limit + 1
                      : 0}{" "}
                    -{" "}
                    {Math.min(
                      pagination.currentPage * pagination.limit,
                      pagination.totalProducts,
                    )}{" "}
                    of {pagination.totalProducts}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-1">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={!pagination.hasPrevious}
                      className={`p-2 border rounded-xl text-sm transition-all ${
                        pagination.hasPrevious
                          ? "hover:bg-gray-900 hover:text-white hover:border-gray-900 text-gray-600"
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
                          className={`px-3.5 py-1.5 text-sm rounded-xl transition-all min-w-[36px] ${
                            pagination.currentPage === page
                              ? "bg-gray-900 text-white"
                              : "border text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={!pagination.hasNext}
                      className={`p-2 border rounded-xl text-sm transition-all ${
                        pagination.hasNext
                          ? "hover:bg-gray-900 hover:text-white hover:border-gray-900 text-gray-600"
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
                    <span
                      className={`${raleway.className} text-xs sm:text-sm text-gray-500`}
                    >
                      Show:
                    </span>
                    <select
                      value={pagination.limit}
                      onChange={(e) => {
                        const newLimit = parseInt(e.target.value);
                        fetchProducts(1, newLimit, searchTerm, categoryFilter);
                      }}
                      className="px-3 py-1.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
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

        {/* Create Product Modal - ALL INPUTS PRESERVED */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                <h2
                  className={`${playfair.className} text-xl font-light text-gray-800`}
                >
                  Create New Product
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
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

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
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
                      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
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
                      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                      placeholder="Describe your product..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
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
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                        placeholder="29.99"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
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
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
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
                      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                      placeholder="e.g., Hydrating, Anti-Aging, SPF 30"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
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
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                        placeholder="e.g., Light Floral"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
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
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                        placeholder="e.g., Jar"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h3
                    className={`${raleway.className} font-medium text-sm text-gray-500 uppercase tracking-wider`}
                  >
                    Images
                  </h3>

                  <div>
                    <label
                      className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                    >
                      Thumbnail Image *
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm file:mr-4 file:py-1.5 file:px-4 file:border-0 file:bg-gray-900 file:text-white file:rounded-lg file:cursor-pointer hover:file:bg-gray-800"
                        required={!formData.thumbnailImage}
                      />
                      {formData.thumbnailImage && (
                        <button
                          type="button"
                          onClick={removeThumbnail}
                          className="text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
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
                      <p
                        className={`${raleway.className} text-xs text-green-600 mt-1`}
                      >
                         {formData.thumbnailImage.name} (
                        {(formData.thumbnailImage.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                    <p
                      className={`${raleway.className} text-xs text-gray-400 mt-1`}
                    >
                      Upload a square image (recommended: 800x800px, max 5MB)
                    </p>
                  </div>

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
                      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm file:mr-4 file:py-1.5 file:px-4 file:border-0 file:bg-gray-900 file:text-white file:rounded-lg file:cursor-pointer hover:file:bg-gray-800"
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
                            <div key={index} className="relative">
                              <div className="w-16 h-16 rounded-xl overflow-hidden border bg-gray-50">
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

                  <div>
                    <label
                      className={`${raleway.className} text-sm text-gray-600 block mb-1`}
                    >
                      Product Video (optional)
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm file:mr-4 file:py-1.5 file:px-4 file:border-0 file:bg-gray-900 file:text-white file:rounded-lg file:cursor-pointer hover:file:bg-gray-800"
                      />
                      {formData.videoUrl && (
                        <button
                          type="button"
                          onClick={removeVideo}
                          className="text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
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
                      <p
                        className={`${raleway.className} text-xs text-green-600 mt-1`}
                      >
                         {formData.videoUrl.name} (
                        {(formData.videoUrl.size / (1024 * 1024)).toFixed(1)}{" "}
                        MB)
                      </p>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
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
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                    {formError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2.5 border rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading || isBackgroundUploading}
                    className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium order-1 sm:order-2"
                  >
                    {isBackgroundUploading ? "Creating..." : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

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
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
