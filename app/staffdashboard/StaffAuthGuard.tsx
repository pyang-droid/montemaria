"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  LogOut,
  AlertCircle,
  Loader2,
  KeyRound,
  UserCheck
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

const DEMO_STAFF_ACCOUNTS: Record<string, Partial<StaffAccountData>> = {
  "staff@montemaria.com": {
    fullName: "Mark Garcia",
    employeeId: "STF-1004",
    role: "Staff",
    assignedAttraction: "Mirage Walk",
    shift: "Morning Shift (08:00 AM - 04:00 PM)",
    status: "On-Duty",
  },
  "tourism@gmail.com": {
    fullName: "Tourism Administrator",
    employeeId: "ADM-9001",
    role: "Tourism",
    assignedAttraction: "All Attractions (Supervisor)",
    shift: "Administrative Shift (08:00 AM - 05:00 PM)",
    status: "On-Duty",
  },
};

export function StaffAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<StaffRole>("Unknown");
  const [accountData, setAccountData] = useState<StaffAccountData | null>(null);
  const [assignedAttraction, setAssignedAttraction] = useState<string>("Mirage Walk");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Manual fast login state inside guard
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // Check for local demo session fallback
        const demoSession = typeof window !== "undefined" ? localStorage.getItem("mm_staff_demo_user") : null;
        if (demoSession) {
          try {
            const parsed = JSON.parse(demoSession);
            setUser({ email: parsed.email, uid: parsed.uid || "demo-uid" } as User);
            setRole(parsed.role as StaffRole);
            setAccountData(parsed);
            if (parsed.assignedAttraction) {
              setAssignedAttraction(parsed.assignedAttraction);
            }
            setIsLoading(false);
            return;
          } catch {
            localStorage.removeItem("mm_staff_demo_user");
          }
        }

        setUser(null);
        setRole("Unknown");
        setAccountData(null);
        setIsLoading(false);
        return;
      }

      setUser(currentUser);
      const email = currentUser.email?.toLowerCase() || "";
      let detectedRole: StaffRole = "Visitor";

      // 1. Check email heuristics first
      if (email.includes("tourism") || email.includes("admin")) {
        detectedRole = "Tourism";
      } else if (email.includes("staff")) {
        detectedRole = "Staff";
      }

      // 2. Fetch role from Firestore "users/{uid}" if available
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const docRole = (data.role || "").toLowerCase();
          if (docRole === "tourism" || docRole === "admin") {
            detectedRole = "Tourism";
          } else if (docRole === "staff") {
            detectedRole = "Staff";
          } else if (docRole === "visitor" || docRole === "user") {
            detectedRole = "Visitor";
          }
        }
      } catch (err) {
        console.warn("Could not fetch user document from Firestore:", err);
      }

      setRole(detectedRole);

      // Build staff account profile
      const demoPreset = DEMO_STAFF_ACCOUNTS[email];
      const staffAccount: StaffAccountData = {
        uid: currentUser.uid,
        email: currentUser.email || "",
        fullName:
          demoPreset?.fullName ||
          currentUser.displayName ||
          (detectedRole === "Tourism" ? "Tourism Administrator" : "Operations Staff"),
        role: detectedRole,
        employeeId: demoPreset?.employeeId || (detectedRole === "Tourism" ? "ADM-9001" : `STF-${currentUser.uid.slice(0, 4).toUpperCase()}`),
        assignedAttraction: demoPreset?.assignedAttraction || "Mirage Walk",
        shift: demoPreset?.shift || "Morning Shift (08:00 AM - 04:00 PM)",
        status: "On-Duty",
      };

      setAccountData(staffAccount);
      if (staffAccount.assignedAttraction) {
        setAssignedAttraction(staffAccount.assignedAttraction);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mm_staff_demo_user");
    }
    await signOut(auth);
    setUser(null);
    setRole("Unknown");
    setAccountData(null);
    router.push("/login");
  };

  const switchAccount = () => {
    logout();
  };

  const handleQuickDemoLogin = (email: string, roleType: StaffRole) => {
    setLoginError("");
    const demoProfile: StaffAccountData = {
      uid: roleType === "Tourism" ? "demo-admin-id" : "demo-staff-id",
      email: email,
      fullName: roleType === "Tourism" ? "Tourism Administrator" : "Mark Garcia (Staff)",
      role: roleType,
      employeeId: roleType === "Tourism" ? "ADM-9001" : "STF-1004",
      assignedAttraction: roleType === "Tourism" ? "All Attractions" : "Mirage Walk",
      shift: "Active Operational Shift",
      status: "On-Duty",
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("mm_staff_demo_user", JSON.stringify(demoProfile));
    }

    setUser({ email: email, uid: demoProfile.uid } as User);
    setRole(roleType);
    setAccountData(demoProfile);
    setAssignedAttraction(demoProfile.assignedAttraction);
  };

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const email = cred.user.email?.toLowerCase() || "";
      if (!email.includes("staff") && !email.includes("tourism") && !email.includes("admin")) {
        setLoginError("This account is not authorized as Staff or Administrator.");
      }
    } catch (err: unknown) {
      console.error(err);
      setLoginError("Invalid credentials. You can use the Quick Demo Staff Sign-In below.");
    } finally {
      setLoginLoading(false);
    }
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
          Synchronizing credentials with Manage Accounts (1.0)...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State (Not logged in) - Uniform Landing Page Design
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md bg-white rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-black/[0.06] overflow-hidden p-8 sm:p-10">
          
          {/* LOGO & HEADER */}
          <div className="text-center mb-6">
            <img
              src="/montemarialogo.png"
              alt="Montemaria Logo"
              className="h-16 w-16 object-contain mx-auto mb-3"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c1122f]">
              Restricted Operations Portal
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.04em] text-[#1d1d1f] mt-1">
              Staff &amp; Admin Sign In
            </h1>
            <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed">
              Sign in with an authorized Staff or Tourism Administrator account to access operational tools.
            </p>
          </div>

          <div className="rounded-2xl bg-[#f5f5f7] p-3.5 mb-6 border border-black/[0.05] flex items-start gap-2.5 text-xs text-[#424245]">
            <ShieldCheck className="w-4 h-4 text-[#c1122f] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#1d1d1f]">Security Policy:</span> Only accounts registered under{" "}
              <span className="font-bold text-[#c1122f]">Staff</span> or{" "}
              <span className="font-bold text-[#c1122f]">Tourism Office</span> are granted operational access.
            </div>
          </div>

          {loginError && (
            <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleDirectLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#424245] uppercase tracking-wider mb-1.5">
                Staff / Admin Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. staff@montemaria.com"
                required
                className="w-full px-4 py-3 bg-[#f5f5f7] border border-black/[0.08] rounded-2xl text-sm text-[#1d1d1f] placeholder:text-gray-400 focus:bg-white focus:border-[#c1122f] focus:ring-2 focus:ring-[#c1122f]/10 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#424245] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-[#f5f5f7] border border-black/[0.08] rounded-2xl text-sm text-[#1d1d1f] placeholder:text-gray-400 focus:bg-white focus:border-[#c1122f] focus:ring-2 focus:ring-[#c1122f]/10 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-full bg-[#c1122f] hover:bg-[#a50f28] text-white font-semibold text-sm shadow-sm transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/[0.06]" />
            </div>
            <span className="relative px-3 bg-white text-[10px] font-bold text-[#86868b] uppercase tracking-widest">
              Instant Demonstration Access
            </span>
          </div>

          {/* Quick Demo Buttons in Landing Page Pill Style */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("staff@montemaria.com", "Staff")}
              className="w-full py-3 px-4 rounded-2xl border border-black/[0.08] bg-[#f5f5f7] hover:bg-white text-xs font-semibold text-[#1d1d1f] flex items-center justify-between transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Staff Officer (Mark Garcia)
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold">
                Staff Role
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin("tourism@gmail.com", "Tourism")}
              className="w-full py-3 px-4 rounded-2xl border border-black/[0.08] bg-[#f5f5f7] hover:bg-white text-xs font-semibold text-[#1d1d1f] flex items-center justify-between transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c1122f]" />
                Tourism Administrator
              </span>
              <span className="text-[10px] bg-[#c1122f]/10 text-[#c1122f] px-2.5 py-0.5 rounded-full font-bold">
                Admin Role
              </span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-black/[0.05] text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition font-medium"
            >
              ← Back to Montemaria Homepage
            </button>
          </div>
        </div>
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
