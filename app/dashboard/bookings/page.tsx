import Link from "next/link";
import DashboardNav from "../DashboardNav";
import MyBookings from "../components/MyBookings";

export default function MyBookingsPage() {
  return (
    <>
      <DashboardNav />
      <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-28">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-brand-red"
          >
            <span aria-hidden="true">←</span>
            Back to attractions
          </Link>
          <MyBookings />
        </div>
      </main>
    </>
  );
}
