"use client";

import Link from "next/link";
import {
  Playfair_Display,
  Raleway,
  Caveat,
} from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function ContactPage() {
  // Replace with your actual contact details
  const contactInfo = {
    phoneNumber: "+2348012345678", // Nigeria country code + 10 digits
    email: "ezehgodwin3942@gmail.com",
    whatsappLink: "https://wa.me/2348012345678",
    gmailLink: "https://mail.google.com/mail/?view=cm&fs=1&to=",
  };

  const handleWhatsApp = () => {
    const message = "Hello! I have a question about your products.";
    const url = `${contactInfo.whatsappLink}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

const handleGmail = () => {
    const to = contactInfo.email;
    const subject = "Inquiry about your products";
    const body = "Hello,\n\nI would like to know more about your products.\n\n";
    
    // Gmail compose URL
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-black text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center">
            <span className={`${raleway.className} text-xs tracking-[0.3em] uppercase text-gray-400 mb-4 block`}>
              Get in Touch
            </span>
            <h1 className={`${playfair.className} text-4xl md:text-6xl font-light tracking-wide mb-4`}>
              Contact Us
            </h1>
            <div className="w-12 h-0.5 bg-white/60 mx-auto mb-4"></div>
            <p className={`${raleway.className} text-sm md:text-base font-light text-gray-400 tracking-wider`}>
              WE`RE HERE TO HELP
            </p>
          </div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* WhatsApp Card */}
          <div className="group bg-white rounded-2xl border border-gray-200 hover:border-black transition-all duration-500 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              
              <h2 className={`${playfair.className} text-2xl font-light text-black mb-2`}>
                WhatsApp
              </h2>
              <p className={`${raleway.className} text-gray-500 text-sm mb-4`}>
                Chat with us directly
              </p>
              <p className={`${raleway.className} text-sm text-gray-400 mb-6`}>
                {contactInfo.phoneNumber}
              </p>
              
              <button
                onClick={handleWhatsApp}
                className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className={`${raleway.className} font-medium`}>
                  Chat on WhatsApp
                </span>
              </button>
            </div>
          </div>

          {/* Gmail Card */}
          <div className="group bg-white rounded-2xl border border-gray-200 hover:border-black transition-all duration-500 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              
              <h2 className={`${playfair.className} text-2xl font-light text-black mb-2`}>
                Email
              </h2>
              <p className={`${raleway.className} text-gray-500 text-sm mb-4`}>
                Send us an email
              </p>
              <p className={`${raleway.className} text-sm text-gray-400 mb-6`}>
                {contactInfo.email}
              </p>
              
              <button
                onClick={handleGmail}
                className="w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span className={`${raleway.className} font-medium`}>
                  Send Email
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-0.5 bg-black/20 mx-auto mb-6"></div>
            <p className={`${caveat.className} text-gray-400 text-lg`}>
              💬 We typically respond within 24 hours
            </p>
            <p className={`${raleway.className} text-xs text-gray-400 mt-2 tracking-wider`}>
              MONDAY - FRIDAY, 9AM - 6PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}