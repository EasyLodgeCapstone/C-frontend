"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Raleway, Caveat } from "next/font/google";
import Loading from "../Comp/Loading";

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

export default function AdminSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const setCookie = await fetch("/api/auth/admin/set-cookie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: data.data.token }),
        });

        if (!setCookie.ok) {
          const cookieErrorData = await setCookie.json();
          console.error("Set-cookie error:", cookieErrorData);
          setError(cookieErrorData.error || "Failed to set session cookie");
          return;
        }
        setSuccess("Admin account created successfully!");
        setTimeout(() => {
          router.push("/Admin/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Admin signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1a2e] to-[#0a1628] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1a2e] to-[#0a1628] flex items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-md backdrop-blur-md border border-blue-500/20 rounded-3xl px-6 sm:px-8 py-8 sm:py-10 shadow-2xl shadow-blue-500/5"
        style={{
          background: "rgba(10, 14, 30, 0.85)",
        }}
      >
        {/* Logo */}
        {/* <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <Image
              src="/Logo/NovaWealth.png"
              alt="Nova Wealth"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
        </div> */}

        {/* Title */}
        <h1
          className={`${playfair.className} text-2xl sm:text-3xl font-light text-center text-white mb-2`}
        >
          Admin Registration
        </h1>
        <p
          className={`${raleway.className} text-center text-[#94a3b8] text-sm mb-8`}
        >
          Create an admin account for managing the application.
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p
              className={`${raleway.className} text-green-400 text-sm text-center`}
            >
              {success}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p
              className={`${raleway.className} text-red-400 text-sm text-center`}
            >
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              className={`${raleway.className} text-[#94a3b8] text-sm block mb-1.5`}
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-3 bg-[#0a0e1a]/50 border border-blue-500/20 rounded-lg text-white placeholder-[#94a3b8]/50 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label
              className={`${raleway.className} text-[#94a3b8] text-sm block mb-1.5`}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 bg-[#0a0e1a]/50 border border-blue-500/20 rounded-lg text-white placeholder-[#94a3b8]/50 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label
              className={`${raleway.className} text-[#94a3b8] text-sm block mb-1.5`}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-[#0a0e1a]/50 border border-blue-500/20 rounded-lg text-white placeholder-[#94a3b8]/50 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Admin Account...
              </span>
            ) : (
              "Create Admin Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-blue-500/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span
              className={`${raleway.className} px-4 text-[#94a3b8] bg-[#0a0e1a]`}
            >
              or
            </span>
          </div>
        </div>

        {/* Login Link */}
        <p
          className={`${raleway.className} text-center text-[#94a3b8] text-sm`}
        >
          Already have an admin account?{" "}
          <Link
            href="/Auth/Admin/signin"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Sign In
          </Link>
        </p>

        {/* Footer */}
        <p
          className={`${caveat.className} text-center text-[#94a3b8]/30 text-xs mt-4`}
        >
          Admin access is restricted to authorized personnel only
        </p>
      </div>
    </div>
  );
}
