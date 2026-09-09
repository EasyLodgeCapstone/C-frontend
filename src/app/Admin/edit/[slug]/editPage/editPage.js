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

      //  Populate form with current data - THIS IS WHAT YOU WANT
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className={`${raleway.className} text-gray-500 mt-4`}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.productName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className={`${playfair.className} text-2xl font-light text-black mb-2`}>
            Failed to Load Product
          </h2>
          <p className={`${raleway.className} text-gray-500`}>{error}</p>
          <button
            onClick={fetchProduct}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/Admin/dashboard"
            className="inline-block mt-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors ml-2"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`${playfair.className} text-3xl font-light text-black`}>
              Edit Product
            </h1>
            <p className={`${raleway.className} text-gray-500 text-sm mt-1`}>
              Update product details
            </p>
          </div>
          <Link
            href="/Admin/dashboard"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className={`${playfair.className} text-xl font-light text-black`}>
              Basic Information
            </h2>

            <div>
              <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1`}>
                Product Name *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}  //  Shows current product name
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                placeholder="e.g., Hydrating Face Cream"
              />
            </div>

            <div>
              <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1`}>
                Product Description *
              </label>
              <textarea
                name="productDescription"
                value={formData.productDescription}  //  Shows current description
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                placeholder="Describe your product..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1`}>
                  Price (₦) *
                </label>
                <input
                  type="number"
                  name="productPrice"
                  value={formData.productPrice}  //  Shows current price
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="49.99"
                />
              </div>
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1`}>
                  Discount Price (₦)
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}  //  Shows current discount price
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="29.99"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1`}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}  //  Shows current category
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1`}>
                  Sub Category
                </label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}  //  Shows current sub category
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="e.g., Moisturizers"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 mt-6">
            <h2 className={`${playfair.className} text-xl font-light text-black`}>
              Product Details
            </h2>

            <div>
              <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1`}>
                Features
              </label>
              <input
                type="text"
                name="productFeatures"
                value={formData.productFeatures}  //  Shows current features
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                placeholder="e.g., Hydrating, Anti-Aging, SPF 30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1`}>
                  Texture
                </label>
                <input
                  type="text"
                  name="texture"
                  value={formData.texture}  //  Shows current texture
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="e.g., Cream"
                />
              </div>
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1`}>
                  Scent
                </label>
                <input
                  type="text"
                  name="scent"
                  value={formData.scent}  //  Shows current scent
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="e.g., Light Floral"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1`}>
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}  //  Shows current color
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="e.g., White"
                />
              </div>
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1`}>
                  Packaging
                </label>
                <input
                  type="text"
                  name="packaging"
                  value={formData.packaging}  //  Shows current packaging
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="e.g., Jar"
                />
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="space-y-4 mt-6">
            <h2 className={`${playfair.className} text-xl font-light text-black`}>
              Stock Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${raleway.className} text-sm font-medium text-gray-700 block mb-1`}>
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}  //  Shows current stock
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                  placeholder="45"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isInStock"
                    checked={formData.isInStock}  //  Shows current stock status
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className={`${raleway.className} text-sm text-gray-700`}>
                    In Stock
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.push("/Admin/dashboard")}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}