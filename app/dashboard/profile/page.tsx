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
import ProfilePhotoCrop from "./ProfilePhotoCrop";
import DashboardNav from "../DashboardNav";
import { auth, db } from "../../lib/firebase";

const profileFields = [
  { name: "username", label: "Username", type: "text", autoComplete: "username" },
  { name: "firstName", label: "First Name", type: "text", autoComplete: "given-name" },
  { name: "lastName", label: "Last Name", type: "text", autoComplete: "family-name" },
  { name: "mobileNumber", label: "Mobile Number", type: "tel", autoComplete: "tel" },
] as const;

type ProfileDetails = Record<(typeof profileFields)[number]["name"], string>;

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

  const [profileDraft, setProfileDraft] = useState<ProfileDetails | null>(null);
  const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(" ");

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return;
      setUser(currentUser);
      setProfileDraft(null);
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

  useEffect(() => {
    if (photoPreview) return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    e.currentTarget.value = "";
    if (!file || savingPhoto) return;
    if (!user) {
      setPhotoError("Sign in to save a profile photo.");
      return;
    }
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setPhotoError("Choose an image file no larger than 5 MB.");
      return;
    }

    setPhotoError("");
    setSuccess("");
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSavePhoto = async (photo: Blob) => {
    if (!user || savingPhoto) return;
    setSavingPhoto(true);
    setPhotoError("");
    setSuccess("");
    try {
      if (photo.size > 100_000) {
        setPhotoError("The cropped photo is too large. Try a different crop or photo.");
        return;
      }
      const photoURL = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") resolve(reader.result);
          else reject(new Error("Unable to read cropped photo."));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(photo);
      });
      await updateDoc(doc(db, "users", user.uid), {
        photoURL,
        updatedAt: serverTimestamp(),
      });
      setProfileImage(photoURL);
      setPhotoPreview(null);
      setSuccess("Profile photo updated.");
    } catch (saveError) {
      console.error("Unable to save profile photo:", saveError);
      setPhotoError("Unable to save the profile photo. Check your connection and try again.");
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileDraft || savingProfile) return;
    if (!user) {
      setError("Sign in to update your profile.");
      return;
    }
    const details = {
      username: profileDraft.username.trim(),
      firstName: profileDraft.firstName.trim(),
      lastName: profileDraft.lastName.trim(),
      mobileNumber: profileDraft.mobileNumber.trim(),
    };
    setSavingProfile(true);
    setError("");
    setSuccess("");
    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...details,
        updatedAt: serverTimestamp(),
      });
      setFormData((previous) => ({ ...previous, ...details }));
      setProfileDraft(null);
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
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative h-20 w-20 shrink-0 rounded-full sm:h-32 sm:w-32 overflow-hidden bg-gray-200">
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
              <div className="min-w-0">
                <p className="mb-3 break-words text-lg font-bold text-gray-900 sm:text-2xl">
                  {fullName || formData.username || "Visitor"}
                </p>
                <label
                  htmlFor="profile-upload"
                  className="px-6 py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-brand-red-dark transition-all cursor-pointer inline-block"
                  style={{ fontFamily: "var(--font-montemaria-sans)" }}
                >
                  {profileImage ? "Change Photo" : "Choose Photo"}
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelection}
                  disabled={savingPhoto}
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
            {photoError && !photoPreview && <p role="alert" className="mt-4 text-sm text-red-700">{photoError}</p>}
            {photoPreview && (
              <ProfilePhotoCrop
                key={photoPreview}
                source={photoPreview}
                saving={savingPhoto}
                saveError={photoError}
                onSave={handleSavePhoto}
                onCancel={() => {
                  setPhotoPreview(null);
                  setPhotoError("");
                }}
              />
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              {!profileDraft && (
                <button
                  type="button"
                  className="rounded-lg border border-brand-red px-4 py-2 text-sm font-semibold text-brand-red hover:bg-red-50"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    const { username, firstName, lastName, mobileNumber } = formData;
                    setProfileDraft({ username, firstName, lastName, mobileNumber });
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>
            {profileDraft ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <fieldset disabled={savingProfile} className="grid gap-5 sm:grid-cols-2">
                  {profileFields.map(({ name, label, type, autoComplete }) => (
                    <label key={name} className="block text-sm font-medium text-gray-700">
                      {label}
                      <input
                        name={name}
                        type={type}
                        autoComplete={autoComplete}
                        value={profileDraft[name]}
                        onChange={(event) => {
                          const { value } = event.currentTarget;
                          setProfileDraft((previous) => previous && { ...previous, [name]: value });
                        }}
                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-brand-red"
                      />
                    </label>
                  ))}
                </fieldset>
                <p className="break-words text-sm text-gray-700">
                  <span className="block font-medium">Email Address</span>
                  {formData.email || "?"}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="rounded-lg bg-brand-red px-5 py-3 font-medium text-white hover:bg-brand-red-dark disabled:opacity-50"
                  >
                    {savingProfile ? "Saving?" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    disabled={savingProfile}
                    className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setProfileDraft(null);
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <dl className="grid gap-5 sm:grid-cols-2">
                {profileFields.map(({ name, label }) => (
                  <div key={name} className="min-w-0">
                    <dt className="text-sm font-medium text-gray-500">{label}</dt>
                    <dd className="mt-1 break-words text-gray-900">{formData[name] || "?"}</dd>
                  </div>
                ))}
                <div className="min-w-0">
                  <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                  <dd className="mt-1 break-words text-gray-900">{formData.email || "?"}</dd>
                </div>
              </dl>
            )}
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