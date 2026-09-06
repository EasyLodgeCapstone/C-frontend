"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dancing_Script,
  Raleway,
  Caveat,
  Playfair_Display,
} from "next/font/google";
import Image from "next/image";

const dancing = Dancing_Script({
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

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonMessage, setComingSoonMessage] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: "Home", path: "/Protected/home" },
    { name: "Products", path: "/Protected/products" },
    { name: "About", path: "/Public/about" },
    { name: "Testimonials", path: "/Public/testimonials" },
    { name: "Contact", path: "/Public/contact" },
  ];

  const isActive = (path) => pathname === path;

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.valid) {
          setIsAuthenticated(false);
          return;
        }

        const userData = data.user || data.data;

        if (userData) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch cart count
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.items) {
            const total = data.items.reduce(
              (sum, item) => sum + (item.quantity || 1),
              0,
            );
            setCartCount(total);
          }
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, []);

  const handleComingSoon = (type) => {
    if (type === "login") {
      setComingSoonMessage("Login feature is coming soon! 🚀");
    } else {
      setComingSoonMessage("Sign up feature is coming soon! 🌟");
    }
    setShowComingSoon(true);
    setTimeout(() => {
      setShowComingSoon(false);
    }, 3000);
  };

  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch("/api/auth/logout", {
  //       method: "POST",
  //       credentials: "include",
  //     });

  //     if (response.ok) {
  //       setIsAuthenticated(false);
  //       setCartCount(0);
  //       router.push("/Public/home");
  //     }
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <Link href="/Public/home" className="flex items-center gap-3 group">
              <div className="w-10 h-10  rounded-full flex items-center justify-center  text-xl shadow-lg transition-transform group-hover:scale-110">
                <Image
                  src="/logo/WhatsApp Image 2026-09-05 at 9.10.32 AM.jpeg"
                  alt="Logo"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h2
                  className={`${dancing.className} text-2xl font-bold text-black leading-tight`}
                >
                  B&B BodyCare
                </h2>
                <p
                  className={`${caveat.className} text-xs text-gray-500 -mt-1`}
                >
                  natural beauty
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`${raleway.className} relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                    isActive(item.path)
                      ? "text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
                      isActive(item.path) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}

              {/* Cart Icon - Only show when authenticated */}
              {!isLoading && isAuthenticated && (
                <Link
                  href="/Protected/cart"
                  className="ml-4 p-2 text-gray-600 hover:text-black transition-colors relative"
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Auth Section - Conditional Rendering */}
              {isLoading ? (
                // Loading state
                <div className="ml-4 w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
              ) : isAuthenticated ? (
                // Logged in - Show user profile
                <div className="ml-4 flex items-center gap-3">
                  <Link
                    href="/Protected/profile"
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      U
                    </div>
                    <span
                      className={`${raleway.className} text-sm text-gray-700 group-hover:text-black transition-colors hidden lg:block`}
                    >
                      Account
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`${raleway.className} text-sm text-gray-500 hover:text-black transition-colors`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                // Not logged in - Show Login/Signup with Coming Soon
                <div className="ml-4 flex items-center gap-2">
                  <button
                    onClick={() => handleComingSoon("login")}
                    className={`${raleway.className} px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleComingSoon("signup")}
                    className={`${raleway.className} px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-colors`}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-black transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 bg-black transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-black transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-black transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              isMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-gray-200 pt-4 space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${raleway.className} block px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive(item.path)
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                {/* Cart in mobile - Only show when authenticated */}
                {!isLoading && isAuthenticated && (
                  <Link
                    href="/Protected/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
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
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span className={`${raleway.className} text-sm`}>
                        Cart
                      </span>
                    </div>
                    {cartCount > 0 && (
                      <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Auth in mobile */}
                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                  </div>
                ) : isAuthenticated ? (
                  <>
                    <Link
                      href="/Protected/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        U
                      </div>
                      <span className={`${raleway.className} text-sm`}>
                        My Account
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className={`${raleway.className} text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        handleComingSoon("login");
                        setIsMenuOpen(false);
                      }}
                      className={`${raleway.className} px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        handleComingSoon("signup");
                        setIsMenuOpen(false);
                      }}
                      className={`${raleway.className} px-4 py-2 text-sm text-center text-white bg-black rounded-lg hover:bg-gray-800 transition-colors`}
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Coming Soon Popup/Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowComingSoon(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-scale-up">
            {/* Close button */}
            <button
              onClick={() => setShowComingSoon(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
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

            <div className="text-center">
              {/* Icon */}
              <div className="text-6xl mb-4 animate-bounce">🚀</div>

              {/* Title */}
              <h3
                className={`${playfair.className} text-3xl font-bold text-black mb-2`}
              >
                Coming Soon!
              </h3>

              {/* Message */}
              <p className={`${raleway.className} text-gray-600 text-lg mb-4`}>
                {comingSoonMessage}
              </p>

              {/* Sub message */}
              <p className={`${caveat.className} text-gray-400 text-sm`}>
                We`re working hard to bring you this feature ✨
              </p>

              {/* Decorative line */}
              <div className="w-16 h-1 bg-black mx-auto mt-4" />
            </div>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scale-up {
          animation: scale-up 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
