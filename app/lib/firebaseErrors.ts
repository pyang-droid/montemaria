export function getFirebaseErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return undefined;
}

export function getLoginErrorMessage(error: unknown): string {
  switch (getFirebaseErrorCode(error)) {
    case "auth/invalid-credential":
    case "auth/invalid-email":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email address or password.";
    case "auth/too-many-requests":
      return "Too many sign-in attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Could not connect. Check your internet connection and try again.";
    default:
      return "Could not sign in. Please try again.";
  }
}
