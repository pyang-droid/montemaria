import type { ReactNode } from "react";
import AdminAuthGuard from "./AdminAuthGuard";

export default function TourismDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
