// app/Admin/edit/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Playfair_Display,
  Dancing_Script,
  Raleway,
  Caveat,
} from "next/font/google";
import Loading from "../Comp/Loading";

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

const categories = [
  "Skin Care",
  "Face Care",
  "Weight Management",
  "Body Enhancement",
  "Aphrodisiacs",
];

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id || params.slug;
  console.log(productId, "productId from editPage.js");

  const [loading, setLoading] = useState(() => Boolean(productId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(() => productId ? "" : "No product ID provided");
  const [success, setSuccess] = useState("");
  const [product, setProduct] = useState(null);

  // Form data
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
    stockQuantity: "",
    isInStock: true,
  });

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching product with ID:", productId);

      const response = await fetch(`/api/products/Admin/getProduct?id=${productId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch product (${response.status})`);
      }

      const data = await response.json();
      const productData = data.product || data.data || data;

      if (!productData || Object.keys(productData).length === 0) {
        throw new Error("No product data received");
      }

      setProduct(productData);
      console.log("Fetched product data:",productData);

      setFormData({
        productName: productData.productName ,
        productDescription: productData.productDescription || "",
        productPrice: productData.productPrice?.toString() || "",
        discountPrice: productData.discountPrice?.toString() || "",
        category: productData.category || "",
        subCategory: productData.subCategory || "",
        productFeatures: productData.productFeatures || "",
        texture: productData.texture || "",
        scent: productData.scent || "",
        color: productData.color || "",
        packaging: productData.packaging || "",
        stockQuantity: productData.stockQuantity?.toString() || "",
        isInStock: productData.isInStock !== false,
      });

    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productId) {
      return;
    }

    let cancelled = false;
    const loadProduct = async () => {
      await Promise.resolve();
      if (!cancelled) {
        fetchProduct();
      }
    };

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = e.target.checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const productData = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        productPrice: parseFloat(formData.productPrice),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        category: formData.category,
        subCategory: formData.subCategory || null,
        productFeatures: formData.productFeatures || null,
        texture: formData.texture || null,
        scent: formData.scent || null,
        color: formData.color || null,
        packaging: formData.packaging || null,
        stockQuantity: parseInt(formData.stockQuantity),
        isInStock: formData.isInStock,
      };

      const response = await fetch(`/api/products/Admin/updateProduct?id=${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `Failed to update product (${response.status})`);
      }

      setSuccess(" Product updated successfully!");
      await fetchProduct();

      setTimeout(() => {
        router.push("/Admin/dashboard");
      }, 2000);

    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
          <p className={`${raleway.className} text-gray-500 dark:text-gray-400 mt-4`}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.productName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className={`${playfair.className} text-2xl font-light text-black dark:text-white mb-2`}>
            Failed to Load Product
          </h2>
          <p className={`${raleway.className} text-gray-500 dark:text-gray-400`}>{error}</p>
          <button
            onClick={fetchProduct}
            className="mt-4 px-6 py-2 bg-black dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/Admin/dashboard"
            className="inline-block mt-2 px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`${playfair.className} text-3xl font-light text-black dark:text-white`}>
              Edit Product
            </h1>
            <p className={`${raleway.className} text-gray-500 dark:text-gray-400 text-sm mt-1`}>
              Update product details
            </p>
          </div>
          <Link
            href="/Admin/dashboard"
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className={`${playfair.className} text-xl font-light text-black dark:text-white`}>
              Basic Information
            </h2>

            <div>
              <label className={`${raleway.className} text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1`}>
                Product Name *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                placeholder="e.g., Hydrating Face Cream"
              />
            </div>

            <div>
              <label className={`${raleway.className} text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1`}>
                Product Description *
              </label>
              <textarea
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                placeholder="Describe your product..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1`}>
                  Price (₦) *
                </label>
                <input
                  type="number"
                  name="productPrice"
                  value={formData.productPrice}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="49.99"
                />
              </div>
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1`}>
                  Discount Price (₦)
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="29.99"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1`}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1`}>
                  Sub Category
                </label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="e.g., Moisturizers"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 mt-6">
            <h2 className={`${playfair.className} text-xl font-light text-black dark:text-white`}>
              Product Details
            </h2>

            <div>
              <label className={`${raleway.className} text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1`}>
                Features
              </label>
              <input
                type="text"
                name="productFeatures"
                value={formData.productFeatures}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                placeholder="e.g., Hydrating, Anti-Aging, SPF 30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1`}>
                  Texture
                </label>
                <input
                  type="text"
                  name="texture"
                  value={formData.texture}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="e.g., Cream"
                />
              </div>
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1`}>
                  Scent
                </label>
                <input
                  type="text"
                  name="scent"
                  value={formData.scent}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="e.g., Light Floral"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1`}>
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="e.g., White"
                />
              </div>
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1`}>
                  Packaging
                </label>
                <input
                  type="text"
                  name="packaging"
                  value={formData.packaging}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="e.g., Jar"
                />
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="space-y-4 mt-6">
            <h2 className={`${playfair.className} text-xl font-light text-black dark:text-white`}>
              Stock Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1`}>
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  placeholder="45"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isInStock"
                    checked={formData.isInStock}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className={`${raleway.className} text-sm text-gray-700 dark:text-gray-300`}>
                    In Stock
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => router.push("/Admin/dashboard")}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}