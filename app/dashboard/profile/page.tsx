"use client";

import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import DashboardNav from "../DashboardNav";
import { auth, db, storage } from "../../lib/firebase";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return;
      setUser(currentUser);
      setLoading(true);
      if (!currentUser) {
        setFormData((previous) => ({ ...previous, email: "" }));
        setLoading(false);
        return;
      }

      try {
        const profileSnapshot = await getDoc(doc(db, "users", currentUser.uid));
        if (!active) return;
        if (!profileSnapshot.exists()) {
          setError("Your account profile is missing from Firestore.");
          setLoading(false);
          return;
        }
        const profile = profileSnapshot.exists() ? profileSnapshot.data() : {};
        setFormData((previous) => ({
          ...previous,
          username: typeof profile.username === "string" ? profile.username : "",
          firstName: typeof profile.firstName === "string" ? profile.firstName : "",
          lastName: typeof profile.lastName === "string" ? profile.lastName : "",
          mobileNumber: typeof profile.mobileNumber === "string" ? profile.mobileNumber : "",
          email: currentUser.email ?? "",
        }));
        setProfileImage(typeof profile.photoURL === "string" ? profile.photoURL : null);
      } catch (loadError) {
        console.error("Unable to load account profile:", loadError);
        if (active) setError("Unable to load your profile. Check your connection and permissions.");
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) {
      setError("Sign in to upload a profile photo.");
      return;
    }
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Choose an image file no larger than 5 MB.");
      return;
    }

    setUploadingImage(true);
    setError("");
    setSuccess("");
    try {
      const fileRef = ref(storage, `users/${user.uid}/profile/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);
      await updateDoc(doc(db, "users", user.uid), {
        photoURL,
        updatedAt: serverTimestamp(),
      });
      setProfileImage(photoURL);
      setSuccess("Profile photo updated.");
    } catch (uploadError) {
      console.error("Unable to upload profile photo:", uploadError);
      setError("Unable to upload the profile photo. Check your access and try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Sign in to update your profile.");
      return;
    }
    setSavingProfile(true);
    setError("");
    setSuccess("");
    try {
      await updateDoc(doc(db, "users", user.uid), {
        username: formData.username.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        updatedAt: serverTimestamp(),
      });
      setSuccess("Profile updated successfully.");
    } catch (saveError) {
      console.error("Unable to update profile:", saveError);
      setError("Unable to update your profile. Check your connection and permissions.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      setError("A password change is only available for email/password accounts.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("The new password must be at least 6 characters long.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    setError("");
    setSuccess("");
    try {
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, formData.newPassword);
      setSuccess("Password updated successfully.");
      setFormData((previous) => ({
        ...previous,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (passwordError) {
      console.error("Unable to update password:", passwordError);
      setError("Unable to update the password. Recheck your current password and try again.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-montemaria-sans)" }}
            >
              My <span className="text-brand-red italic">Profile</span>
            </h1>
            <p
              className="text-gray-600"
              style={{ fontFamily: "var(--font-montemaria-sans)" }}
            >
              Manage your account settings
            </p>
          </div>

          {(error || success) && (
            <p role={error ? "alert" : "status"} className={`mb-6 rounded-xl border p-4 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
              {error || success}
            </p>
          )}

          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">Loading your profile…</div>
          ) : !user ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-600">
              Sign in to manage your profile.
            </div>
          ) : (
          <>

          {/* Profile Picture Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
            <h2
              className="text-2xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-montemaria-sans)" }}
            >
              Profile Picture
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
                    👤
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="profile-upload"
                  className="px-6 py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-brand-red-dark transition-all cursor-pointer inline-block"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                >
                  {uploadingImage ? "Uploading…" : "Upload Photo"}
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
                <p
                  className="text-sm text-gray-500 mt-2"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                >
                  JPG, PNG or GIF. Max size 5 MB.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
            <h2
              className="text-2xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-montemaria-sans)" }}
            >
              Personal Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                />
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    style={{ fontFamily: "var(--font-montemaria-sans)" }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                    style={{ fontFamily: "var(--font-montemaria-sans)" }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    style={{ fontFamily: "var(--font-montemaria-sans)" }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                    style={{ fontFamily: "var(--font-montemaria-sans)" }}
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                />
              </div>

              <p className="text-xs text-gray-500">
                Email is managed by Firebase Authentication and cannot be changed here.
              </p>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-brand-red-dark transition-all"
                style={{ fontFamily: "var(--font-montemaria-sans)" }}
              >
                {savingProfile ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2
              className="text-2xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-montemaria-sans)" }}
            >
              Change Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                >
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                />
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-brand-red-dark transition-all"
                style={{ fontFamily: "var(--font-montemaria-sans)" }}
              >
                {savingPassword ? "Updating…" : "Update Password"}
              </button>
            </form>
          </div>
          </>
          )}
        </div>
      </div>
    </>
  );
}