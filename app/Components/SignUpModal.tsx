"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export default function SignUpModal({
  isOpen,
  onClose,
  onOpenLogin,
}: SignUpModalProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError(
        "You must agree to the Terms of Service and Privacy Policy."
      );
      return;
    }

    setLoading(true);

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;
      const lowerEmail = email.toLowerCase();

      let assignedRole = "visitor";
      let targetDashboard = "/dashboard";

      if (lowerEmail.includes("staff")) {
        assignedRole = "staff";
        targetDashboard = "/staffdashboard";
      } else if (lowerEmail.includes("tourism")) {
        assignedRole = "tourism";
        targetDashboard = "/tourismdashboard";
      }

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        createdAt: new Date().toISOString(),
        role: assignedRole,
      });

      setSuccess("Account created successfully!");

      setTimeout(() => {
        onClose();
        router.push(targetDashboard);
      }, 1500);
    } catch (err: any) {
      console.error("Firebase SignUp Error:", err.code);

      switch (err.code) {
        case "auth/email-already-in-use":
          setError(
            "This email address is already registered."
          );
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/weak-password":
          setError(
            "Password should be at least 6 characters long."
          );
          break;

        default:
          setError(
            "Registration failed. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* SIGN UP BOARD */}
      <div
        className="relative max-h-[90vh] w-full max-w-[420px] overflow-y-auto rounded-2xl bg-white px-7 py-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 text-xl text-gray-400 transition hover:text-black"
          aria-label="Close sign up"
        >
          ×
        </button>

        {/* LOGO */}
        <div className="mb-1 flex justify-center">
          <img
            src="/montemarialogo.png"
            alt="Montemaria Batangas Logo"
            className="h-16 w-16 object-contain"
          />
        </div>

        {/* HEADER */}
        <div className="mb-4 text-center">
          <h2
            className="mb-1 text-2xl font-bold text-gray-900"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Create Account
          </h2>

          <p
            className="text-sm text-gray-500"
            style={{
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Begin your experience with Monte Maria
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSignUp} className="space-y-3">
          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-2.5 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label
              htmlFor="signup-email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email address"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-700 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="signup-password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Create a password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-700 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label
              htmlFor="signup-confirm-password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
              disabled={loading}
              placeholder="Confirm your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-700 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
            />
          </div>

          {/* TERMS */}
          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) =>
                setAgreeTerms(e.target.checked)
              }
              disabled={loading}
              className="mt-1 h-4 w-4"
            />

            <span className="text-xs leading-relaxed text-gray-600">
              I agree to the{" "}
              <button
                type="button"
                className="font-semibold text-gray-900 hover:underline"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="font-semibold text-gray-900 hover:underline"
              >
                Privacy Policy
              </button>
              .
            </span>
          </label>

          {/* CREATE ACCOUNT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="my-3 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-xs text-gray-400">
            OR
          </span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* LOGIN */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="font-semibold text-gray-900 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}