"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onOpenSignUp,
}: LoginModalProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userEmail =
        userCredential.user.email?.toLowerCase() || "";

      let userRole = "";
      try {
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists()) {
          userRole = (userDoc.data()?.role || "").toLowerCase();
        }
      } catch (docErr) {
        console.warn("Could not retrieve user role from Firestore:", docErr);
      }

      onClose();

      if (userRole === "tourism" || userRole === "admin" || userEmail.includes("tourism") || userEmail.includes("admin")) {
        router.push("/tourismdashboard");
      } else if (userRole === "staff" || userEmail.includes("staff")) {
        router.push("/staffdashboard");
      } else {
        router.push("/dashboard");
      }

      router.refresh();
    } catch (err: any) {
      console.error(err.code);
      setError("Invalid email address or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* LOGIN BOARD */}
      <div
        className="relative w-full max-w-[420px] rounded-2xl bg-white px-7 py-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 text-xl text-gray-400 transition hover:text-black"
          aria-label="Close login"
        >
          ×
        </button>

        {/* LOGO */}
        <div className="mb-2 flex justify-center">
          <img
            src="/montemarialogo.png"
            alt="Montemaria Batangas Logo"
            className="h-20 w-20 object-contain"
          />
        </div>

        {/* HEADER */}
        <div className="mb-5 text-center">
          <h2
            className="mb-1 text-2xl font-bold text-gray-900"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Welcome Back
          </h2>

          <p
            className="text-sm text-gray-500"
            style={{
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Sign in to continue your spiritual journey
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-700 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-700 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
            />
          </div>

          {/* REMEMBER / FORGOT */}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="h-4 w-4"
              />

              <span className="text-sm text-gray-600">
                Remember me
              </span>
            </label>

            <button
              type="button"
              disabled={loading}
              className="text-sm text-gray-700 transition hover:text-black hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* SIGN IN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Verifying Credentials..." : "Sign In"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="my-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-xs text-gray-400">
            OR
          </span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* SIGN UP */}
        <p className="text-center text-sm text-gray-600">
          No account yet?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSignUp();
            }}
            className="font-semibold text-gray-900 hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}