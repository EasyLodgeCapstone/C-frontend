// app/Admin/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
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
    images: [],
    thumbnailImage: "",
    videoUrl: "",
    stockQuantity: "",
    isInStock: true,
  });
  const [imageInput, setImageInput] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const categories = [
    "Facecare",
    "Skincare",
    "Bodycare",
    "Haircare",
    "Makeup",
    "Fragrance",
  ];

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || data);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddImage = () => {
    if (imageInput && formData.images.length < 5) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput],
      }));
      setImageInput("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const productData = {
        ...formData,
        productPrice: parseFloat(formData.productPrice),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stockQuantity: parseInt(formData.stockQuantity),
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
        credentials: "include",
      });

      if (response.ok) {
        setShowCreateModal(false);
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
          images: [],
          thumbnailImage: "",
          videoUrl: "",
          stockQuantity: "",
          isInStock: true,
        });
        fetchProducts(); // Refresh the list
      } else {
        const data = await response.json();
        setFormError(data.message || "Failed to create product");
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  // Stats
  const totalProducts = products.length;
  const inStock = products.filter(p => p.isInStock !== false).length;
  const totalCategories = new Set(products.map(p => p.category)).size;
  const avgRating = (products.reduce((acc, p) => acc + (p.averageRating || 0), 0) / products.length || 0).toFixed(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className={`${raleway.className} text-gray-500 mt-4`}>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className={`${playfair.className} text-2xl font-light text-black`}>
                Product Dashboard
              </h1>
              <p className={`${caveat.className} text-gray-500 text-sm`}>
                Manage your product catalog
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Product
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className={`${raleway.className} text-sm text-gray-500`}>Total Products</p>
            <p className={`${playfair.className} text-2xl font-light mt-1`}>{totalProducts}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className={`${raleway.className} text-sm text-gray-500`}>In Stock</p>
            <p className={`${playfair.className} text-2xl font-light mt-1`}>{inStock}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className={`${raleway.className} text-sm text-gray-500`}>Categories</p>
            <p className={`${playfair.className} text-2xl font-light mt-1`}>{totalCategories}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className={`${raleway.className} text-sm text-gray-500`}>Avg Rating</p>
            <p className={`${playfair.className} text-2xl font-light mt-1`}>{avgRating}</p>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 relative">
                          <Image
                            src={product.thumbnailImage || product.images?.[0] || "/placeholder.jpg"}
                            alt={product.productName}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <p className={`${raleway.className} font-medium text-sm text-black truncate max-w-[120px] sm:max-w-none`}>
                            {product.productName}
                          </p>
                          <p className={`${raleway.className} text-xs text-gray-500 hidden sm:block`}>
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
                        <p className="text-sm font-medium">${product.productPrice}</p>
                        {product.discountPrice && (
                          <p className="text-xs text-gray-400 line-through">${product.discountPrice}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm">{product.stockQuantity}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.isInStock !== false
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {product.isInStock !== false ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/Admin/products/edit/${product._id}`}
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={async () => {
                            if (confirm("Delete this product?")) {
                              try {
                                const response = await fetch(`/api/products/${product._id}`, {
                                  method: "DELETE",
                                  credentials: "include",
                                });
                                if (response.ok) {
                                  fetchProducts();
                                }
                              } catch (err) {
                                console.error("Delete failed:", err);
                              }
                            }
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className={`${raleway.className} text-gray-500`}>
                {products.length === 0 ? "No products yet. Create your first product!" : "No products match your filters"}
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
              <h2 className={`${playfair.className} text-xl font-light text-black`}>
                Create New Product
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className={`${raleway.className} font-medium text-sm text-gray-500 uppercase tracking-wider`}>
                  Basic Information
                </h3>
                
                <div>
                  <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
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
                  <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
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
                    <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
                      Price ($) *
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
                    <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
                      Discount Price ($)
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
                    <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
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
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
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
                <h3 className={`${raleway.className} font-medium text-sm text-gray-500 uppercase tracking-wider`}>
                  Product Details
                </h3>

                <div>
                  <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
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
                    <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
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
                    <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
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
                    <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
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
                    <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
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

              {/* Images */}
              <div className="space-y-4">
                <h3 className={`${raleway.className} font-medium text-sm text-gray-500 uppercase tracking-wider`}>
                  Images
                </h3>

                <div>
                  <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    name="thumbnailImage"
                    value={formData.thumbnailImage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div>
                  <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
                    Additional Images (max 5)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageInput}
                      onChange={(e) => setImageInput(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
                    Video URL
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-4">
                <h3 className={`${raleway.className} font-medium text-sm text-gray-500 uppercase tracking-wider`}>
                  Stock Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`${raleway.className} text-sm text-gray-600 block mb-1`}>
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
                      <span className={`${raleway.className} text-sm text-gray-600`}>
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
                  disabled={formLoading}
                  className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {formLoading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}