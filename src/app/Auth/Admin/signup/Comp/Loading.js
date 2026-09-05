"use client";

// Loading Skeleton Component
function SignupSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1a2e] to-[#0a1628] flex items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-md backdrop-blur-md border border-blue-500/20 rounded-3xl px-6 sm:px-8 py-8 sm:py-10 shadow-2xl shadow-blue-500/5"
        style={{
          background: "rgba(10, 14, 30, 0.85)",
        }}
      >
        {/* Logo Skeleton */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#1a2340] animate-pulse"></div>
        </div>

        {/* Title Skeleton */}
        <div className="h-8 bg-[#1a2340] rounded-lg w-48 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-[#1a2340] rounded-lg w-56 mx-auto mb-8 animate-pulse"></div>

        {/* Form Fields Skeleton */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <div className="h-4 bg-[#1a2340] rounded w-24 mb-1.5 animate-pulse"></div>
            <div className="h-12 bg-[#1a2340] rounded-lg w-full animate-pulse"></div>
          </div>

          {/* Email */}
          <div>
            <div className="h-4 bg-[#1a2340] rounded w-24 mb-1.5 animate-pulse"></div>
            <div className="h-12 bg-[#1a2340] rounded-lg w-full animate-pulse"></div>
          </div>

          {/* Password */}
          <div>
            <div className="h-4 bg-[#1a2340] rounded w-24 mb-1.5 animate-pulse"></div>
            <div className="h-12 bg-[#1a2340] rounded-lg w-full animate-pulse"></div>
          </div>

          {/* Submit Button Skeleton */}
          <div className="h-12 bg-gradient-to-r from-blue-600/50 to-blue-500/50 rounded-lg w-full mt-2 animate-pulse"></div>
        </div>

        {/* Divider Skeleton */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-blue-500/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#0a0e1a] text-[#94a3b8]/50">or</span>
          </div>
        </div>

        {/* Login Link Skeleton */}
        <div className="h-4 bg-[#1a2340] rounded w-48 mx-auto animate-pulse"></div>

        {/* Back to Home Skeleton */}
        <div className="h-3 bg-[#1a2340] rounded w-32 mx-auto mt-3 animate-pulse"></div>

        {/* Footer Skeleton */}
        <div className="h-3 bg-[#1a2340] rounded w-64 mx-auto mt-4 animate-pulse"></div>
      </div>
    </div>
  );
}

export default SignupSkeleton;