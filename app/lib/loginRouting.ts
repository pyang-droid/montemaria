import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export type LoginAudience = "user" | "staff-admin";

export interface LoginDestination {
  audience: LoginAudience;
  path: "/dashboard" | "/staffdashboard" | "/tourismdashboard";
}

export async function getAccountRole(user: User): Promise<string> {
  const userDoc = await getDoc(doc(db, "users", user.uid));
  return userDoc.exists()
    ? (userDoc.data()?.role || "").toLowerCase()
    : "";
}

export async function getLoginDestination(
  user: User
): Promise<LoginDestination> {
  const role = await getAccountRole(user);

  if (role === "tourism" || role === "admin") {
    return { audience: "staff-admin", path: "/tourismdashboard" };
  }

  if (role === "staff") {
    return { audience: "staff-admin", path: "/staffdashboard" };
  }

  return { audience: "user", path: "/dashboard" };
}
