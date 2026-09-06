"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Playfair_Display, Raleway, Caveat } from "next/font/google";
import Loading from "./Comp/Loading";
import { useAuthGuard } from "../../../../Commponets/AuthGuard/AuthGuard";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Dummy products for fallback
const getDummyProducts = () => {
  return [
    {
      _id: "1",
      productName: "Gentle Hydrating Cleanser",
      productDescription: "A mild, soap-free cleanser that removes impurities while maintaining skin's natural moisture balance.",
      productPrice: 24.99,
      discountPrice: 19.99,
      productFeatures: "Deeply cleanses without stripping, pH-balanced, non-comedogenic",
      texture: "Gel",
      scent: "Unscented",
      color: "Clear",
      packaging: "Pump Bottle",
      images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop"],
      thumbnailImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop",
      category: "Skin Care",
      subCategory: "Cleansers",
    },
    {
      _id: "2",
      productName: "Vitamin C Brightening Serum",
      productDescription: "Powerful antioxidant serum that brightens skin tone and reduces dark spots.",
      productPrice: 59.99,
      discountPrice: 49.99,
      productFeatures: "Brightens skin, reduces dark spots, antioxidant-rich",
      texture: "Serum",
      scent: "Citrus",
      color: "Light Orange",
      packaging: "Dropper Bottle",
      images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=600&fit=crop"],
      thumbnailImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=600&fit=crop",
      category: "Skin Care",
      subCategory: "Serums",
    },
    {
      _id: "3",
      productName: "Retinol Night Cream",
      productDescription: "Advanced retinol formula that reduces fine lines and wrinkles while you sleep.",
      productPrice: 69.99,
      discountPrice: 59.99,
      productFeatures: "Reduces fine lines, improves elasticity, promotes cell renewal",
      texture: "Cream",
      scent: "Light Floral",
      color: "White",
      packaging: "Jar",
      images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=600&fit=crop"],
      thumbnailImage: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=600&fit=crop",
      category: "Skin Care",
      subCategory: "Moisturizers",
    },
  ];
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("product");

  //  Get auth state from AuthGuard
  const { user, isAuthenticated, loading: authLoading, isGuest } = useAuthGuard();
  
  // Determine if user is actually logged in (not a guest)
  const isLoggedIn = isAuthenticated && !isGuest;

  const [product, setProduct] = useState(null);
  const [bankAccounts, setBankAccounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Derive authenticated customer details without synchronizing state in an effect.
  const displayedUserName = isLoggedIn ? user?.name || "" : userName;
  const displayedUserEmail = isLoggedIn ? user?.email || "" : userEmail;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/products/product/eachProduct?id=${productId}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (response.ok) {
          const data = await response.json();
          setProduct(data.product || data);
        } else {
          const dummyProducts = getDummyProducts();
          const found = dummyProducts.find((p) => p._id === productId);
          if (found) {
            setProduct(found);
          } else {
            throw new Error("Product not found");
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchBankAccounts = async () => {
      try {
        const response = await fetch("/api/checkout/accounts", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.accounts, "bank accounts data");
          setBankAccounts(data.accounts || []);
        }
      } catch (err) {
        console.error("Error fetching bank accounts:", err);
        setError("Failed to fetch bank accounts");
      }
    };

    fetchProduct();
    fetchBankAccounts();
  }, [productId]);

  const handleCopyAccount = (accountNumber, index) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 3000);
  };

  const handleWhatsApp = () => {
    const currentPrice = product.discountPrice || product.productPrice;
    const totalPrice = (currentPrice * quantity).toFixed(2);

    // Build product specifications string
    const specs = [];
    if (product.texture) specs.push(`🧴 Texture: ${product.texture}`);
    if (product.scent) specs.push(`🌸 Scent: ${product.scent}`);
    if (product.color) specs.push(`🎨 Color: ${product.color}`);
    if (product.packaging) specs.push(`📦 Packaging: ${product.packaging}`);
    if (product.productFeatures) specs.push(`✨ Features: ${product.productFeatures}`);
    if (product.category) specs.push(`📂 Category: ${product.category}`);
    if (product.subCategory) specs.push(`📁 Sub-Category: ${product.subCategory}`);

    //  Include user auth info in message
    const authStatus = isLoggedIn ? " Registered User" : "👤 Guest User";

    // Build the message
    const message = `🛍️ *NEW ORDER*

👤 *Customer Details:*
Name: ${displayedUserName || "Not provided"}
Email: ${displayedUserEmail || "Not provided"}
Status: ${authStatus}

📦 *Product Details:*
Product: ${product.productName}
Description: ${product.productDescription}
Price: $${product.productPrice.toFixed(2)}
${product.discountPrice ? `Discount Price: $${product.discountPrice.toFixed(2)}` : ""}
Quantity: ${quantity}
Total: $${totalPrice}

📋 *Product Specifications:*
${specs.join("\n")}

Thank you! 🙏`;

    const phoneNumber = "2349063810310";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  //  Show loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2
            className={`${playfair.className} text-2xl font-light text-black mb-2`}
          >
            Product Not Found
          </h2>
          <p className={`${raleway.className} text-gray-500`}>
            Please go back and try again.
          </p>
          <Link
            href="/Protected/products"
            className="inline-block mt-6 px-8 py-3 bg-black text-white text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = product.discountPrice || product.productPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-2 cursor-pointer"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>

        {/*  Auth Status Badge */}
        <div className="mb-6">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
            isLoggedIn 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isLoggedIn ? "bg-green-500" : "bg-yellow-500"
            }`}></span>
            {isLoggedIn ? " Logged in as " + (user?.name || "User") : "👤 Checking out as Guest"}
          </div>
        </div>

        {/* Customer Details Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <h2
            className={`${playfair.className} text-lg sm:text-xl font-light text-black mb-4`}
          >
            Customer Details
          </h2>
          <div className="space-y-4">
            <div>
              <label
                className={`${raleway.className} text-sm text-gray-600 block mb-1`}
              >
                Full Name {isLoggedIn && <span className="text-xs text-green-600">(auto-filled)</span>}
              </label>
              <input
                type="text"
                value={displayedUserName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black transition-colors ${
                  isLoggedIn ? "border-green-200 bg-green-50/50" : "border-gray-300"
                }`}
                readOnly={isLoggedIn}
              />
            </div>
            <div>
              <label
                className={`${raleway.className} text-sm text-gray-600 block mb-1`}
              >
                Email Address {isLoggedIn && <span className="text-xs text-green-600">(auto-filled)</span>}
              </label>
              <input
                type="email"
                value={displayedUserEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-black transition-colors ${
                  isLoggedIn ? "border-green-200 bg-green-50/50" : "border-gray-300"
                }`}
                readOnly={isLoggedIn}
              />
            </div>
          </div>
        </div>

        {/* Product Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <h1
            className={`${playfair.className} text-xl sm:text-2xl font-light text-black mb-4 sm:mb-6`}
          >
            Order Summary
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                <Image
                  src={product.images?.[0] || "/images/placeholder.jpg"}
                  alt={product.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`${raleway.className} font-medium text-black text-sm sm:text-base truncate`}
                >
                  {product.productName}
                </h3>
                <p
                  className={`${raleway.className} text-xs sm:text-sm text-gray-500 truncate`}
                >
                  {product.category} / {product.subCategory}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                  <span
                    className={`${playfair.className} text-base sm:text-lg font-light text-black`}
                  >
                    ${currentPrice.toFixed(2)}
                  </span>
                  {product.discountPrice && (
                    <span
                      className={`${raleway.className} text-xs sm:text-sm text-gray-400 line-through`}
                    >
                      ${product.productPrice.toFixed(2)}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-black transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-black transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-left sm:text-right sm:ml-4">
              <span
                className={`${playfair.className} text-lg sm:text-xl font-light text-black`}
              >
                ${(currentPrice * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Product Specs */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4
              className={`${raleway.className} text-xs font-medium text-gray-500 uppercase tracking-wider mb-2`}
            >
              Product Specifications
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {product.texture && (
                <div className="text-xs">
                  <span className="text-gray-500">Texture:</span>
                  <span className="text-black ml-1">{product.texture}</span>
                </div>
              )}
              {product.scent && (
                <div className="text-xs">
                  <span className="text-gray-500">Scent:</span>
                  <span className="text-black ml-1">{product.scent}</span>
                </div>
              )}
              {product.color && (
                <div className="text-xs">
                  <span className="text-gray-500">Color:</span>
                  <span className="text-black ml-1">{product.color}</span>
                </div>
              )}
              {product.packaging && (
                <div className="text-xs">
                  <span className="text-gray-500">Packaging:</span>
                  <span className="text-black ml-1">{product.packaging}</span>
                </div>
              )}
            </div>
            {product.productFeatures && (
              <div className="mt-2 text-xs">
                <span className="text-gray-500">Features:</span>
                <span className="text-black ml-1">
                  {product.productFeatures}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <h2
            className={`${playfair.className} text-lg sm:text-xl font-light text-black mb-4`}
          >
            Payment Instructions
          </h2>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                1
              </span>
              <p
                className={`${raleway.className} text-xs sm:text-sm text-gray-600 leading-relaxed`}
              >
                Transfer the exact amount to any of the bank accounts below.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                2
              </span>
              <p
                className={`${raleway.className} text-xs sm:text-sm text-gray-600 leading-relaxed`}
              >
                Click &apos;Contact sellers on WhatsApp&apos; to notify the seller that
                you&apos;re interested.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                3
              </span>
              <p
                className={`${raleway.className} text-xs sm:text-sm text-gray-600 leading-relaxed`}
              >
                Copy seller&apos;s account number and transfer the exact amount.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                4
              </span>
              <p
                className={`${raleway.className} text-xs sm:text-sm text-gray-600 leading-relaxed`}
              >
                Save your payment receipt and upload it to the seller&apos;s WhatsApp
                before the seller can confirm your payment.
              </p>
            </div>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <h2
            className={`${playfair.className} text-lg sm:text-xl font-light text-black mb-4`}
          >
            Bank Accounts
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {bankAccounts?.map((account, index) => (
              <div
                key={account._id}
                className="border border-gray-200 rounded-xl p-4 hover:border-black transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`${raleway.className} font-medium text-black text-sm sm:text-base`}
                      >
                        {account.bankName}
                      </span>
                    </div>
                    <p
                      className={`${raleway.className} text-xs sm:text-sm text-gray-500 truncate`}
                    >
                      {account.name}
                    </p>
                    <p
                      className={`${raleway.className} text-base sm:text-lg font-mono text-black mt-1 break-all`}
                    >
                      {account.accNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyAccount(account.accNumber, index)}
                    className="px-4 py-2.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all duration-300 whitespace-nowrap"
                  >
                    {copiedIndex === index ? "Copied! ✓" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Receipt Upload & WhatsApp */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2
            className={`${playfair.className} text-lg sm:text-xl font-light text-black mb-4`}
          >
            After Payment
          </h2>

          <div className="space-y-4">
            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsApp}
              className="w-full py-3.5 sm:py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className={`${raleway.className} font-medium`}>
                Contact Seller on WhatsApp
              </span>
            </button>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center px-4">
          <p className={`${caveat.className} text-gray-400 text-xs sm:text-sm`}>
            💡 Once you`ve uploaded your receipt, the seller will confirm your
            payment
          </p>
        </div>
      </div>
    </div>
  );
}