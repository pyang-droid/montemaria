"use client";

import { useMemo, useState } from "react";
import AdminNav from "../AdminNav";

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

const initialUsers: UserAccount[] = [
  {
    id: "USR-1001",
    fullName: "Juan Dela Cruz",
    email: "juan@gmail.com",
    role: "Visitor",
    status: "Active",
    dateCreated: "Sep 25, 2026",
  },
  {
    id: "USR-1002",
    fullName: "Maria Santos",
    email: "maria@gmail.com",
    role: "Visitor",
    status: "Active",
    dateCreated: "Sep 26, 2026",
  },
  {
    id: "USR-1003",
    fullName: "Carlo Reyes",
    email: "carlo@gmail.com",
    role: "Visitor",
    status: "Active",
    dateCreated: "Sep 27, 2026",
  },
  {
    id: "USR-1004",
    fullName: "Mark Garcia",
    email: "staff@montemaria.com",
    role: "Staff",
    status: "Active",
    dateCreated: "Sep 20, 2026",
  },
  {
    id: "USR-1005",
    fullName: "Tourism Administrator",
    email: "tourism@gmail.com",
    role: "Tourism",
    status: "Active",
    dateCreated: "May 27, 2026",
  },
  {
    id: "USR-1006",
    fullName: "Angela Cruz",
    email: "angela@gmail.com",
    role: "Visitor",
    status: "Inactive",
    dateCreated: "Sep 21, 2026",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | UserRole>("All");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        user.fullName.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.id.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const visitors = users.filter(
    (user) => user.role === "Visitor"
  ).length;

  const staffAccounts = users.filter(
    (user) => user.role === "Staff"
  ).length;

  const toggleAccountStatus = (id: string) => {
    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };

  return (
    <>
      <AdminNav />

      <main className="min-h-screen bg-[#f7f7f8] px-6 pb-16 pt-[112px] lg:px-8">
        <div className="mx-auto max-w-[1400px]">

          {/* HEADER */}
          <div className="mb-8 border-b border-gray-200 pb-7">
            <p
              className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c1122f]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Account Management
            </p>

            <h1
              className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Users
            </h1>

            <p
              className="mt-3 max-w-3xl text-sm leading-6 text-gray-500 md:text-base"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              View registered user accounts, assigned roles, and account
              status.
            </p>
          </div>

          {/* SUMMARY */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Users
              </p>

              <p
                className="mt-3 text-3xl font-bold text-gray-900"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {users.length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Active Accounts
              </p>

              <p
                className="mt-3 text-3xl font-bold text-green-600"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {activeUsers}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Visitors
              </p>

              <p
                className="mt-3 text-3xl font-bold text-gray-900"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {visitors}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Staff Accounts
              </p>

              <p
                className="mt-3 text-3xl font-bold text-gray-900"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {staffAccounts}
              </p>
            </div>
          </div>

          {/* USER RECORDS */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* SECTION HEADER */}
            <div className="flex flex-col gap-5 border-b border-gray-100 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2
                  className="text-2xl font-bold text-gray-900"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  User Accounts
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Registered accounts and their current access status.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* SEARCH */}
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search user..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#c1122f] sm:w-[250px]"
                />

                {/* ROLE FILTER */}
                <select
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(
                      event.target.value as "All" | UserRole
                    )
                  }
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#c1122f]"
                >
                  <option value="All">All Roles</option>
                  <option value="Visitor">Visitor</option>
                  <option value="Staff">Staff</option>
                  <option value="Tourism">Tourism</option>
                </select>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      User ID
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      User
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Account Status
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Date Created
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
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
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            user.role === "Tourism"
                              ? "bg-red-50 text-[#c1122f]"
                              : user.role === "Staff"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              user.status === "Active"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          />

                          <span
                            className={`text-sm font-semibold ${
                              user.status === "Active"
                                ? "text-green-700"
                                : "text-gray-500"
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-500">
                        {user.dateCreated}
                      </td>

                      <td className="px-6 py-5 text-right">
                        {/* Tourism account cannot deactivate itself */}
                        {user.role === "Tourism" ? (
                          <span className="text-xs font-medium text-gray-400">
                            Administrator
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              toggleAccountStatus(user.id)
                            }
                            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                              user.status === "Active"
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-green-200 text-green-700 hover:bg-green-50"
                            }`}
                          >
                            {user.status === "Active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* EMPTY RESULT */}
            {filteredUsers.length === 0 && (
              <div className="px-6 py-16 text-center">
                <p
                  className="text-lg font-bold text-gray-800"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  No users found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing the search term or role filter.
                </p>
              </div>
            )}

            {/* FOOTER */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <p className="text-xs text-gray-400">
                Showing {filteredUsers.length} of {users.length} user
                accounts
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}