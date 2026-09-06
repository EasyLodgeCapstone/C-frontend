"use client";

import Link from "next/link";
import { useState } from "react";
import { Dancing_Script, Raleway, Caveat } from "next/font/google";
import Image from "next/image";

const dancing = Dancing_Script({
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

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Add your newsletter subscription logic here
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    company: [
      { name: "About Us", path: "/Public/about" },
      { name: "Careers", path: "/Public/careers" },
      { name: "Blog", path: "/Public/blog" },
      { name: "Contact", path: "/Public/contact" },
    ],
    support: [
      { name: "Help Center", path: "/Public/help" },
      { name: "Returns", path: "/Public/returns" },
      { name: "Shipping", path: "/Public/shipping" },
      { name: "FAQs", path: "/Public/faqs" },
    ],
    legal: [
      { name: "Terms & Conditions", path: "/Public/terms" },
      { name: "Privacy Policy", path: "/Public/privacy" },
      { name: "Cookie Policy", path: "/Public/cookies" },
      { name: "Disclaimer", path: "/Public/disclaimer" },
    ],
  };

  const socialLinks = [
    {
      name: "Instagram",
      path: "https://instagram.com",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      path: "https://facebook.com",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      path: "https://twitter.com",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      path: "https://youtube.com",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "Pinterest",
      path: "https://pinterest.com",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.556-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.398.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.227 7.462-1.214 0-2.354-.629-2.748-1.378l-.744 2.853c-.271 1.042-1.001 2.349-1.489 3.145.49.153 1.014.236 1.558.236 4.622 0 8.367-3.762 8.367-8.395C20.385 5.367 16.638 0 12.017 0z" />
        </svg>
      ),
    },
  ];

  const paymentMethods = [
    { name: "Visa", icon: "💳" },
    { name: "Mastercard", icon: "💳" },
    { name: "PayPal", icon: "💰" },
    { name: "Apple Pay", icon: "📱" },
    { name: "Google Pay", icon: "🤖" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg">
                <Image
                  src="/logo/WhatsApp Image 2026-09-05 at 9.10.32 AM.jpeg"
                  alt="Logo"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h3
                  className={`${dancing.className} text-2xl font-bold text-black leading-tight`}
                >
                  B&B BodyCare
                </h3>
                <p
                  className={`${caveat.className} text-sm text-gray-500 -mt-1`}
                >
                  natural beauty
                </p>
              </div>
            </div>
            <p
              className={`${raleway.className} text-gray-600 text-sm leading-relaxed`}
            >
              Discover premium skincare, facecare, and body oil products made
              with natural ingredients for radiant, healthy skin.
            </p>

            {/* Social Links with Real Icons */}
            <div className="flex gap-2 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-100 hover:bg-black rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4
              className={`${raleway.className} font-semibold text-black text-sm uppercase tracking-wider mb-4`}
            >
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={`${raleway.className} text-gray-600 hover:text-black text-sm transition-colors duration-200`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4
              className={`${raleway.className} font-semibold text-black text-sm uppercase tracking-wider mb-4`}
            >
              Support
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className={`${raleway.className} text-gray-600 hover:text-black text-sm transition-colors duration-200`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h4
              className={`${raleway.className} font-semibold text-black text-sm uppercase tracking-wider mb-4`}
            >
              Newsletter
            </h4>
            <p className={`${raleway.className} text-gray-600 text-sm mb-3`}>
              Subscribe for exclusive offers and updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`${raleway.className} flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:border-black transition-colors`}
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-r-lg hover:bg-gray-800 transition-colors"
                >
                  Subscribe
                </button>
              </div>
              {subscribed && (
                <p
                  className={`${raleway.className} text-green-600 text-xs animate-fade-in`}
                >
                  ✅ NEWSLETTER SUBSCRIPTION COMING SOON.
                </p>
              )}
            </form>

            {/* Payment Methods */}
            {/* <div className="mt-4">
              <p className={`${raleway.className} text-gray-500 text-xs mb-2`}>
                Secure Payment
              </p>
              <div className="flex gap-2">
                {paymentMethods.map((method) => (
                  <span
                    key={method.name}
                    className="text-xl opacity-70 hover:opacity-100 transition-opacity"
                    title={method.name}
                  >
                    {method.icon}
                  </span>
                ))}
              </div>
            </div> */}
          </div>
        </div>

        {/* Legal Links - Mobile Friendly */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`${raleway.className} text-gray-500 hover:text-black text-xs transition-colors duration-200`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="text-center">
            <p className={`${raleway.className} text-gray-400 text-xs`}>
              &copy; {new Date().getFullYear()} B&B BodyCare . All rights
              reserved.
              <br className="block sm:hidden" />
              <span className="hidden sm:inline"> | </span>
              Made with ❤️ for natural beauty
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
