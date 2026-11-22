"use client";

import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { getAccountRole } from "../lib/loginRouting";

type AccessState = "checking" | "redirecting" | "allowed" | "error";

export default function DashboardAuthGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [access, setAccess] = useState<AccessState>("checking");

  useEffect(() => {
    let active = true;
    let authChangeVersion = 0;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const currentVersion = ++authChangeVersion;
      if (!user) {
        setAccess("redirecting");
        router.replace("/");
        return;
      }

      void getAccountRole(user)
        .then((role) => {
          if (!active || currentVersion !== authChangeVersion) return;
          if (role === "visitor") {
            setAccess("allowed");
            return;
          }

          setAccess("redirecting");
          router.replace(
            role === "staff"
              ? "/staffdashboard"
              : role === "admin" || role === "tourism"
                ? "/tourismdashboard"
                : "/"
          );
        })
        .catch((error: unknown) => {
          if (!active || currentVersion !== authChangeVersion) return;
          console.error("Could not verify visitor dashboard access:", error);
          setAccess("error");
        });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  if (access === "allowed") return children;

  if (access === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">
            Access could not be verified
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Please try signing in again.
          </p>
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
          >
            Return to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-600">
        {access === "redirecting"
          ? "Opening your authorized portal…"
          : "Verifying dashboard access…"}
      </p>
    </main>
  );
}
