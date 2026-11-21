"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getFirebaseErrorCode } from "../lib/firebaseErrors";

export default function PasswordResetButton({
  email,
  disabled,
  className,
}: {
  email: string;
  disabled: boolean;
  className: string;
}) {
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleReset() {
    const address = email.trim();
    if (!address) {
      setFeedback("Enter your email address first.");
      return;
    }

    const confirmation = "Check your email for a password reset link.";
    setSending(true);
    setFeedback("");
    try {
      await sendPasswordResetEmail(auth, address);
      setFeedback(confirmation);
    } catch (error) {
      switch (getFirebaseErrorCode(error)) {
        case "auth/user-not-found":
          setFeedback(confirmation);
          break;
        case "auth/invalid-email":
          setFeedback("Enter a valid email address.");
          break;
        default:
          setFeedback("Could not request a password reset. Please try again later.");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="text-right">
      <button
        type="button"
        className={className}
        disabled={disabled || sending}
        onClick={handleReset}
      >
        {sending ? "Sending…" : "Forgot password?"}
      </button>
      {feedback && <p role="status" className="mt-1 max-w-56 text-sm text-gray-700">{feedback}</p>}
    </div>
  );
}
