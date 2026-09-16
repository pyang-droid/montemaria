"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase"; // Clean relative path from app/login/ to root lib/
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  
  // State variables for form inputs
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // State variables for tracking auth status
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // 1. Log the user in using Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userEmail = user.email ? user.email.toLowerCase() : "";

    // 2. ROLE-BASED REDIRECTION SWITCH
    if (userEmail.includes("tourism")) {
      // If email has "tourism" (e.g., manager@tourism.com) -> send to Tourism Management
      router.push("/tourismdashboard");
    } 
    else if (userEmail.includes("staff")) {
      // If email has "staff" (e.g., guide@staff.montemaria.com) -> send to Staff Dashboard
      router.push("/staffdashboard");
    } 
    else {
      // Anyone else is treated as a Tourist/General User -> send to Main Dashboard
      router.push("/dashboard");
    }

    router.refresh(); // Refresh the router state to ensure layouts load smoothly
  } catch (err: any) {
    console.error(err.code);
    setError("Invalid email address or password.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex">
      {/* Left Side - 50% - Monte Maria Branding Display */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden">
        <img
          src="login-bg.png"
          alt="Monte Maria"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/10 to-brand-red/40" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-center">
          {/* Cross Icon */}
          <div className="relative w-16 h-16 flex items-center justify-center mb-6">
            <div className="absolute w-2 h-16 rounded-full bg-white" />
            <div className="absolute w-16 h-2 rounded-full bg-white" />
          </div>
          
          <h1
            className="text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Monte Maria
          </h1>
          
          <p
            className="text-white/80 text-lg max-w-sm leading-relaxed"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            A sacred mountain sanctuary where faith meets breathtaking nature
          </p>

          <div className="mt-8 w-24 h-0.5 bg-white/30" />
        </div>
      </div>

      {/* Right Side - 50% - Interactive Login Form */}
      <div className="w-full lg:w-[50%] flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile View Screen Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute w-1.5 h-10 rounded-full bg-brand-red" />
                <div className="absolute w-10 h-1.5 rounded-full bg-brand-red" />
              </div>
              <span
                className="text-2xl font-bold text-brand-red"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Monte Maria
              </span>
            </Link>
          </div>

          {/* Form Welcome Header */}
          <div className="mb-8">
            <h2
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Welcome Back
            </h2>
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Sign in to continue your spiritual journey
            </p>
          </div>

          {/* Input Form Fields */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Conditional Error Notice Banner Component */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-medium tracking-wide transition-all animate-fadeIn">
                {error}
              </div>
            )}

            {/* Email Field Wrapper */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all outline-none text-gray-900 disabled:bg-gray-50 disabled:text-gray-400"
                style={{ fontFamily: "'Lato', sans-serif" }}
                placeholder="Enter your email address"
              />
            </div>

            {/* Password Field Wrapper */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all outline-none text-gray-900 disabled:bg-gray-50 disabled:text-gray-400"
                style={{ fontFamily: "'Lato', sans-serif" }}
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me Checking Component */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  disabled={loading}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded text-brand-red focus:ring-brand-red cursor-pointer disabled:cursor-not-allowed"
                />
                <span
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Remember me
                </span>
              </label>
              <button
                type="button"
                disabled={loading}
                className="text-sm text-brand-red hover:text-brand-red-dark transition-colors disabled:text-gray-400"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Forgot password?
              </button>
            </div>

            {/* Action Form Submission Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-red text-gray-700 border-2 border-gray-700 rounded-lg font-medium transition-all shadow-lg shadow-gray-700/20 mt-6 hover:bg-gray-700 hover:text-white hover:shadow-gray-700/30 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:shadow-none"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {loading ? "Verifying Credentials..." : "Sign In"}
            </button>
          </form>

          {/* Form Segment Separation Bar */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>
                OR
              </span>
            </div>
          </div>

          {/* Create New Account Navigation Anchor */}
          <div className="text-center">
            <p className="text-sm text-gray-600" style={{ fontFamily: "'Lato', sans-serif" }}>
              No account yet?{" "}
              <Link href="/signup" className="text-brand-red font-medium hover:text-brand-red-dark transition-colors">
                Create an account
              </Link>
            </p>
          </div>

          {/* Return Home Link */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              <span>←</span> Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}