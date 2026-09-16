"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase"; // Import Firestore database instance
import { doc, setDoc } from "firebase/firestore";

export default function SignUpPage() {
  const router = useRouter();

  // Form input hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status indicators
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 1. Validate password equality input matching
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please retype your password.");
      return;
    }

    // 2. Ensure checkbox agreement is flagged positive
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      // 3. Register account credentials securely inside Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 4. Clean the email string to check for dashboard keywords
      const lowerEmail = email.toLowerCase();
      let assignedRole = "visitor";        // Default role
      let targetDashboard = "/dashboard";   // Default route (adjust if your visitor route has a different folder name)

      if (lowerEmail.includes("staff")) {
        assignedRole = "staff";
        targetDashboard = "/staffdashboard";
      } 
      else if (lowerEmail.includes("tourism")) {
        assignedRole = "tourism";
        targetDashboard = "/tourismdashboard";
      }

      // 5. Save the exact role configuration to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        createdAt: new Date().toISOString(),
        role: assignedRole 
      });
      
      setSuccess(`Account registered successfully as ${assignedRole}! Redirecting...`);
      
      // 6. Execute the dynamic routing sequence
      setTimeout(() => {
        router.push(targetDashboard); 
      }, 2000);

    } catch (err: any) {
      console.error("Firebase SignUp Error:", err.code);

      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email address is already registered to an account.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email format.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters long.");
          break;
        default:
          setError("Registration failed. Please try again or check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - 50% - Monte Maria Branding Design (Matches Your Login Panel) */}
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
            Join our community sanctuary and stay connected with faith and nature
          </p>

          <div className="mt-8 w-24 h-0.5 bg-white/30" />
        </div>
      </div>

      {/* Right Side - 50% - Interactive Sign Up Form Grid Layout */}
      <div className="w-full lg:w-[50%] flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Screen Responsive Logo */}
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

          {/* Form Description Header */}
          <div className="mb-8">
            <h2
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Create Account
            </h2>
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Begin your experience with our spiritual mapping sanctuary
            </p>
          </div>

          {/* Input Submission Fields */}
          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Error Message Layout Banner */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-medium tracking-wide">
                {error}
              </div>
            )}

            {/* Success Registration Notice Banner */}
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl font-medium tracking-wide">
                {success}
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

            {/* Password Input Wrapper */}
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
                placeholder="Create a password"
              />
            </div>

            {/* Confirm Password Input Wrapper */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all outline-none text-gray-900 disabled:bg-gray-50 disabled:text-gray-400"
                style={{ fontFamily: "'Lato', sans-serif" }}
                placeholder="Confirm your password"
              />
            </div>

            {/* Legal Policy Terms and Agreement Checks */}
            <div className="flex items-start">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  disabled={loading}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 border-gray-300 rounded text-brand-red focus:ring-brand-red cursor-pointer disabled:cursor-not-allowed"
                />
                <span
                  className="text-sm text-gray-600 leading-tight"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  I certify that I agree to the{" "}
                  <button type="button" className="text-brand-red hover:underline font-medium">Terms of Service</button>
                  {" "}and{" "}
                  <button type="button" className="text-brand-red hover:underline font-medium">Privacy Policy</button>.
                </span>
              </label>
            </div>

            {/* Action Registration Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-red text-gray-700 border-2 border-gray-700 rounded-lg font-medium transition-all shadow-lg shadow-gray-700/20 mt-4 hover:bg-gray-700 hover:text-white hover:shadow-gray-700/30 disabled:bg-100 disabled:border-gray-300 disabled:text-gray-400"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              {loading ? "Creating System Record..." : "Register Account"}
            </button>
          </form>

          {/* Separation Divider Layout */}
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

          {/* Return Anchor back to Existing User Login Layout */}
          <div className="text-center">
            <p className="text-sm text-gray-600" style={{ fontFamily: "'Lato', sans-serif" }}>
              Already have an account?{" "}
              <Link href="/login" className="text-brand-red font-medium hover:text-brand-red-dark transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}