
"use client";

import { useMemo, useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import AdminNav from "../AdminNav";
import { db } from "../../lib/firebase";
import { useLiveCollection } from "../../lib/firestore";
import type { UserRecord } from "../../lib/models";
import {
  Users,
  UserCheck,
  UserRound,
  ShieldCheck,
  Search,
  Eye,
  X,
  RotateCcw,
  CalendarDays,
  Mail,
  UserCog,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type UserRole = "Visitor" | "Staff" | "Tourism";
type AccountStatus = "Active" | "Inactive";

interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  dateCreated: string;
}

function RoleBadge({ role }: { role: UserRole }) {
  const styles: Record<UserRole, string> = {
    Tourism: "bg-[#FBECEF] text-[#B21C38]",
    Staff: "bg-[#EAF0F6] text-[#58788F]",
    Visitor: "bg-gray-100 text-gray-600",
  };

  const label = role === "Tourism" ? "Tourism Admin" : role;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${styles[role]}`}
    >
      {label}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: AccountStatus;
}) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
        isActive
          ? "bg-[#E9F3ED] text-[#4D8067]"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isActive ? "bg-[#6B9B83]" : "bg-gray-400"
        }`}
      />
      {status}
    </span>
  );
}

export default function AccountsPage() {
  const { records, loading, error } = useLiveCollection<UserRecord>("users");
  const users: UserAccount[] = records.map((record) => {
    const name = [record.firstName, record.lastName].filter(Boolean).join(" ");
    const date =
      typeof record.createdAt === "string"
        ? record.createdAt
        : record.createdAt &&
            typeof record.createdAt === "object" &&
            "toDate" in record.createdAt &&
            typeof record.createdAt.toDate === "function"
          ? record.createdAt.toDate().toLocaleDateString("en-PH")
          : "—";
    return {
      id: record.id,
      fullName: name || record.username || record.email || "—",
      email: record.email ?? "—",
      role: record.role === "tourism" || record.role === "admin"
        ? "Tourism"
        : record.role === "staff"
          ? "Staff"
          : "Visitor",
      status: record.status === "Inactive" ? "Inactive" : "Active",
      dateCreated: date,
    };
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<"All" | UserRole>("All");
  const [statusFilter, setStatusFilter] =
    useState<"All" | AccountStatus>("All");

  const [selectedUser, setSelectedUser] =
    useState<UserAccount | null>(null);

  const [pendingUser, setPendingUser] =
    useState<UserAccount | null>(null);
  const [actionError, setActionError] = useState("");
  const [updating, setUpdating] = useState(false);

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const visitors = users.filter(
    (user) => user.role === "Visitor"
  ).length;

  const staffAccounts = users.filter(
    (user) => user.role === "Staff"
  ).length;

  const tourismAccounts = users.filter(
    (user) => user.role === "Tourism"
  ).length;

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  const summaryCards = [
    {
      title: "Total Accounts",
      value: totalUsers,
      description: "All registered user accounts",
      icon: Users,
      color: "text-gray-900",
    },
    {
      title: "Active Accounts",
      value: activeUsers,
      description: "Accounts marked as active",
      icon: UserCheck,
      color: "text-[#4D8067]",
    },
    {
      title: "Visitor Accounts",
      value: visitors,
      description: "Registered visitor accounts",
      icon: UserRound,
      color: "text-gray-900",
    },
    {
      title: "Staff Accounts",
      value: staffAccounts,
      description: "Registered staff accounts",
      icon: ShieldCheck,
      color: "text-gray-900",
    },
  ];

  function clearFilters() {
    setSearch("");
    setRoleFilter("All");
    setStatusFilter("All");
  }

  function requestStatusChange(user: UserAccount) {
    if (user.role === "Tourism") return;
    setPendingUser(user);
  }

  async function confirmStatusChange() {
    if (!pendingUser || pendingUser.role === "Tourism") {
      setPendingUser(null);
      return;
    }

    const nextStatus: AccountStatus =
      pendingUser.status === "Active"
        ? "Inactive"
        : "Active";

    setUpdating(true);
    setActionError("");
    try {
      await updateDoc(doc(db, "users", pendingUser.id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
      setPendingUser(null);
    } catch (updateError) {
      console.error("Unable to update account status:", updateError);
      setActionError("Unable to update this account. Check your access and try again.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <>
      <AdminNav />

      <main className="min-h-screen bg-[#f7f7f8] px-5 pb-16 pt-28 sm:px-6 lg:ml-[280px] lg:px-8 lg:pt-12">
        <div className="mx-auto max-w-[1400px]">
          {/* PAGE HEADER */}
          <div className="mb-8 border-b border-gray-200 pb-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p
                  className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c1122f]"
                  style={{
                    fontFamily: "var(--font-montemaria-sans)",
                  }}
                >
                  Tourism Administration
                </p>

                <h1
                  className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
                  style={{
                    fontFamily: "var(--font-montemaria-sans)",
                  }}
                >
                  Manage Accounts
                </h1>

                <p
                  className="mt-3 max-w-3xl text-sm leading-6 text-gray-500 md:text-base"
                  style={{
                    fontFamily: "var(--font-montemaria-sans)",
                  }}
                >
                  View registered user accounts, monitor
                  assigned roles, and manage account access
                  status.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                <span className={`h-2.5 w-2.5 rounded-full ${loading ? "animate-pulse bg-amber-400" : error ? "bg-red-500" : "bg-emerald-500"}`} />

                <div>
                  <p className="text-xs font-bold text-gray-800">
                    {loading ? "Connecting" : error ? "Unavailable" : "Live Data"}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Firebase account records
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {actionError && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}

          {/* SUMMARY CARDS */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {card.title}
                    </p>

                    <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500">
                      <Icon size={18} />
                    </div>
                  </div>

                  <p
                    className={`mt-3 text-3xl font-bold ${card.color}`}
                    style={{
                      fontFamily: "var(--font-montemaria-sans)",
                    }}
                  >
                    {card.value}
                  </p>

                  <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* USER ACCOUNTS */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* SECTION HEADER */}
            <div className="flex flex-col gap-5 border-b border-gray-100 p-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2
                  className="text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "var(--font-montemaria-sans)",
                  }}
                >
                  User Accounts
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Registered accounts and their current
                  access status.
                </p>
              </div>

              {/* FILTERS */}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search name, email, ID..."
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-[#c1122f] sm:w-[220px]"
                  />
                </div>

                <select
                  aria-label="Filter by role"
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(
                      event.target.value as
                        | "All"
                        | UserRole
                    )
                  }
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                >
                  <option value="All">All Roles</option>
                  <option value="Visitor">Visitor</option>
                  <option value="Staff">Staff</option>
                  <option value="Tourism">Tourism Admin</option>
                </select>

                <select
                  aria-label="Filter by account status"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as
                        | "All"
                        | AccountStatus
                    )
                  }
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#c1122f]"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  <RotateCcw size={15} />
                  Clear
                </button>
              </div>
            </div>

            {/* ACCOUNTS TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {[
                      "User ID",
                      "User",
                      "Role",
                      "Account Status",
                      "Date Created",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {!loading && !error && filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-5 text-sm font-semibold text-gray-500">
                        {user.id}
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-gray-900">
                          {user.fullName}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {user.email}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <RoleBadge role={user.role} />
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={user.status} />
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-500">
                        {user.dateCreated}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedUser(user)
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c1122f] hover:underline"
                          >
                            <Eye size={15} />
                            View
                          </button>

                          {user.role === "Tourism" ? (
                            <span className="text-xs font-medium text-gray-400">
                              Protected
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                requestStatusChange(user)
                              }
                              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                                user.status === "Active"
                                  ? "border-[#EACBD0] text-[#A45460] hover:bg-[#F8EBED]"
                                  : "border-[#C8E0D0] text-[#4D8067] hover:bg-[#E9F3ED]"
                              }`}
                            >
                              {user.status === "Active"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* EMPTY STATE */}
            {loading ? (
              <p className="px-6 py-16 text-center text-sm text-gray-500">Loading user accounts…</p>
            ) : !error && filteredUsers.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Users
                  size={30}
                  className="mx-auto mb-3 text-gray-300"
                />

                <p className="text-lg font-bold text-gray-800">
                  No accounts found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {users.length === 0
                    ? "No user accounts are available."
                    : "Try changing your search or filters."}
                </p>
              </div>
            )}

            {/* TABLE FOOTER */}
            <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-400">
                Showing {filteredUsers.length} of {users.length} accounts
              </p>

              <p className="text-xs text-gray-400">
                Tourism Administrator Accounts:{" "}
                {tourismAccounts}
              </p>
            </div>
          </section>

          <p className="mt-8 text-center text-xs text-gray-400">
            Montemaria Express · Tourism Administration
          </p>
        </div>
      </main>

      {/* VIEW DETAILS MODAL */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedUser(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-details-title"
            className="max-h-[90vh] w-full max-w-[540px] overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c1122f]">
                  Account Management
                </p>

                <h2
                  id="account-details-title"
                  className="mt-1 text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "var(--font-montemaria-sans)",
                  }}
                >
                  Account Details
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close account details"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="space-y-6 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FBECEF] text-[#c1122f]">
                  <UserRound size={26} />
                </div>

                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedUser.fullName}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {selectedUser.id}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 border-t border-gray-100 pt-5 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail size={15} />
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Email Address
                    </p>
                  </div>

                  <p className="mt-2 break-all text-sm font-semibold text-gray-800">
                    {selectedUser.email}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <UserCog size={15} />
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Account Role
                    </p>
                  </div>

                  <div className="mt-2">
                    <RoleBadge role={selectedUser.role} />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Account Status
                  </p>

                  <StatusBadge status={selectedUser.status} />
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarDays size={15} />
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Date Created
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {selectedUser.dateCreated}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs leading-5 text-gray-500">
                  {selectedUser.role === "Tourism"
                    ? "This is a protected Tourism Administrator account."
                    : "Account access status is stored in Firestore and enforced by the application security rules."}
                </p>
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>

                {selectedUser.role !== "Tourism" && (
                  <button
                    type="button"
                    onClick={() =>
                      requestStatusChange(selectedUser)
                    }
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white ${
                      selectedUser.status === "Active"
                        ? "bg-[#B76B73] hover:bg-[#A45460]"
                        : "bg-[#6B9B83] hover:bg-[#4D8067]"
                    }`}
                  >
                    {selectedUser.status === "Active"
                      ? "Deactivate Account"
                      : "Activate Account"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM STATUS CHANGE MODAL */}
      {pendingUser && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPendingUser(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-status-title"
            className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div
              className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${
                pendingUser.status === "Active"
                  ? "bg-[#F8EBED] text-[#A45460]"
                  : "bg-[#E9F3ED] text-[#4D8067]"
              }`}
            >
              {pendingUser.status === "Active" ? (
                <AlertTriangle size={24} />
              ) : (
                <CheckCircle2 size={24} />
              )}
            </div>

            <h2
              id="confirm-status-title"
              className="text-2xl font-bold text-gray-900"
              style={{
                fontFamily: "var(--font-montemaria-sans)",
              }}
            >
              {pendingUser.status === "Active"
                ? "Deactivate Account?"
                : "Activate Account?"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Are you sure you want to{" "}
              <strong>
                {pendingUser.status === "Active"
                  ? "deactivate"
                  : "activate"}
              </strong>{" "}
              the account of{" "}
              <strong className="text-gray-800">
                {pendingUser.fullName}
              </strong>
              ?
            </p>

            <p className="mt-3 rounded-xl bg-gray-50 p-3 text-xs leading-5 text-gray-500">
              This change will update the account status in Firestore.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingUser(null)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void confirmStatusChange()}
                disabled={updating}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white ${
                  pendingUser.status === "Active"
                    ? "bg-[#B76B73] hover:bg-[#A45460]"
                    : "bg-[#6B9B83] hover:bg-[#4D8067]"
                }`}
              >
                {updating ? "Saving…" : pendingUser.status === "Active"
                  ? "Deactivate"
                  : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
