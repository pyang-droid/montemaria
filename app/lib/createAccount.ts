import { deleteUser, type User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getFirebaseErrorCode } from "./firebaseErrors";

interface AccountProfile {
  role: "visitor" | "staff";
  firstName: string;
  lastName: string;
  username?: string;
  mobileNumber?: string;
}

export class AccountProfileError extends Error {
  constructor(
    public readonly writeError: unknown,
    public readonly loginRemoved: boolean,
  ) {
    super("Firebase could not save the account profile.", { cause: writeError });
  }
}

export async function saveNewAccountProfile(user: User, profile: AccountProfile) {
  try {
    await setDoc(doc(db, "users", user.uid), {
      ...profile,
      email: user.email,
      createdAt: new Date().toISOString(),
      status: "Active",
    });
  } catch (writeError) {
    try {
      await deleteUser(user);
    } catch (cleanupError) {
      console.error("Could not remove the incomplete Firebase login:", cleanupError);
      throw new AccountProfileError(writeError, false);
    }
    throw new AccountProfileError(writeError, true);
  }
}

export function getVisitorSignupErrorMessage(error: unknown): string {
  if (error instanceof AccountProfileError) {
    return error.loginRemoved
      ? "Could not save your profile to Firestore. Please try signing up again."
      : "Your login was created, but your profile could not be saved. Contact support to finish setting up your account.";
  }

  switch (getFirebaseErrorCode(error)) {
    case "auth/email-already-in-use":
      return "This email address is already registered.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/network-request-failed":
      return "Could not connect to Firebase. Check your connection and try again.";
    default:
      return "Registration failed. Please try again.";
  }
}
