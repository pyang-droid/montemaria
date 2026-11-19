"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getAccountRole } from "../lib/loginRouting";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  ShieldAlert,
  ArrowRight,
  LogOut,
} from "lucide-react";

export type StaffRole = "Staff" | "Tourism" | "Visitor" | "Unknown";

export interface StaffAccountData {
  uid: string;
  email: string;
  fullName: string;
  role: StaffRole;
  employeeId: string;
  assignedAttraction: string;
  shift: string;
  status: "Active" | "Inactive" | "On-Duty";
}

interface StaffAuthContextType {
  user: User | null;
  accountData: StaffAccountData | null;
  role: StaffRole;
  isStaff: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  assignedAttraction: string;
  setAssignedAttraction: (attraction: string) => void;
  logout: () => Promise<void>;
  switchAccount: () => void;
}

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

export function StaffAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<StaffRole>("Unknown");
  const [accountData, setAccountData] = useState<StaffAccountData | null>(null);
  const [assignedAttraction, setAssignedAttraction] = useState<string>("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRole("Unknown");
        setAccountData(null);
        setIsLoading(false);
        return;
      }

      setUser(currentUser);
      let detectedRole: StaffRole = "Visitor";

      try {
        const docRole = await getAccountRole(currentUser);
        if (docRole === "tourism" || docRole === "admin") {
          detectedRole = "Tourism";
        } else if (docRole === "staff") {
          detectedRole = "Staff";
        }
        const [profileSnapshot, assignmentSnapshot] = await Promise.all([
          getDoc(doc(db, "users", currentUser.uid)),
          getDoc(doc(db, "staffAssignments", currentUser.uid)),
        ]);
        if (!profileSnapshot.exists()) {
          setRole("Unknown");
          setAccountData(null);
          setAssignedAttraction("");
          setAuthError("Your account profile is missing from Firestore.");
          setIsLoading(false);
          return;
        }
        const profile = profileSnapshot.data();
        const assignment = assignmentSnapshot.exists()
          ? assignmentSnapshot.data()
          : null;
        const assignmentName =
          detectedRole === "Tourism"
            ? "All Attractions (Supervisor)"
            : assignment?.active === true
              ? String(assignment.attractionName ?? "")
              : "";
        const name = [profile.firstName, profile.lastName]
          .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
          .join(" ");
        const staffAccount: StaffAccountData = {
          uid: currentUser.uid,
          email: currentUser.email || "",
          fullName: name || currentUser.displayName || currentUser.email || "",
          role: detectedRole,
          employeeId: typeof profile.employeeId === "string" ? profile.employeeId : "—",
          assignedAttraction: assignmentName,
          shift: typeof assignment?.shift === "string" ? assignment.shift : "—",
          status: profile.status === "Inactive" ? "Inactive" : "Active",
        };

        setRole(detectedRole);
        setAccountData(staffAccount);
        setAssignedAttraction(assignmentName);
        setAuthError("");
      } catch (err) {
        console.error("Could not load the staff account from Firestore:", err);
        setRole("Unknown");
        setAccountData(null);
        setAssignedAttraction("");
        setAuthError("Unable to load your staff account. Check your connection and permissions.");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, router, user]);

  const logout = async () => {
    await signOut(auth);
  };

  const switchAccount = () => {
    logout();
  };

  const isStaff = role === "Staff";
  const isAdmin = role === "Tourism";
  const hasAccess = isStaff || isAdmin;

  // 1. Loading state (Uniform landing page tone)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center p-6">
        <img
          src="/montemarialogo.png"
          alt="Montemaria Logo"
          className="h-16 w-16 object-contain mb-4 animate-pulse"
        />
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
          Verifying Staff Clearance
        </h2>
        <p className="text-sm text-[#86868b] mt-1">
          Synchronizing credentials with Firebase…
        </p>
      </div>
    );
  }

  // 2. Unauthenticated users return to the public homepage.
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center p-6">
        <img
          src="/montemarialogo.png"
          alt="Montemaria Logo"
          className="h-16 w-16 object-contain mb-4 animate-pulse"
        />
        <p className="text-sm text-[#86868b]">
          {authError || "Returning to the Montemaria homepage…"}
        </p>
      </div>
    );
  }

  // 3. Authenticated but Unauthorized (e.g. Regular Visitor Account)
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-black/[0.06] p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 text-[#c1122f] mx-auto flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 bg-red-50 text-[#c1122f] text-xs font-bold rounded-full uppercase tracking-wider mb-3">
            Access Restricted • Staff Only
          </span>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.04em] text-[#1d1d1f] mb-2">
            Staff &amp; Administrator Portal
          </h1>

          <p className="text-[#6e6e73] text-sm mb-6 leading-relaxed">
            Your current logged-in account (<strong>{user.email}</strong>) is registered as a{" "}
            <span className="font-semibold text-[#1d1d1f]">Visitor</span>. This terminal is strictly
            reserved for on-duty station personnel and Tourism Administrators.
          </p>

          <div className="bg-[#f5f5f7] border border-black/[0.06] rounded-2xl p-4 text-left text-xs text-[#424245] mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#86868b]">Current Role:</span>
              <span className="font-semibold text-[#1d1d1f]">{role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#86868b]">Permitted Roles:</span>
              <span className="font-semibold text-[#c1122f]">Staff, Tourism Administrator</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 py-3.5 px-5 rounded-full bg-[#1d1d1f] hover:bg-black text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Visitor Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="py-3.5 px-5 rounded-full border border-black/10 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Access Granted
  return (
    <StaffAuthContext.Provider
      value={{
        user,
        accountData,
        role,
        isStaff,
        isAdmin,
        isLoading,
        assignedAttraction,
        setAssignedAttraction,
        logout,
        switchAccount,
      }}
    >
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const context = useContext(StaffAuthContext);
  if (!context) {
    throw new Error("useStaffAuth must be used within a StaffAuthProvider");
  }
  return context;
}

export default function StaffAuthGuard({ children }: { children: React.ReactNode }) {
  return <StaffAuthProvider>{children}</StaffAuthProvider>;
}
