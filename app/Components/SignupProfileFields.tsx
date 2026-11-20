const profileFields = [
  { name: "firstName", label: "First Name", autoComplete: "given-name", type: "text" },
  { name: "lastName", label: "Last Name", autoComplete: "family-name", type: "text" },
  { name: "username", label: "Username", autoComplete: "username", type: "text" },
  { name: "mobileNumber", label: "Mobile Number", autoComplete: "tel", type: "tel" },
] as const;

export function readSignupProfile(form: HTMLFormElement) {
  const data = new FormData(form);
  const profile = {
    firstName: String(data.get("firstName") ?? "").trim(),
    lastName: String(data.get("lastName") ?? "").trim(),
    username: String(data.get("username") ?? "").trim(),
    mobileNumber: String(data.get("mobileNumber") ?? "").trim(),
  };
  return profileFields.every(({ name }) => profile[name]) ? profile : null;
}

export default function SignupProfileFields({ disabled }: { disabled: boolean }) {
  return (
    <fieldset disabled={disabled} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {profileFields.map(({ name, label, autoComplete, type }) => (
        <label key={name} className="block text-sm font-medium text-gray-700">
          {label}
          <input
            name={name}
            type={type}
            autoComplete={autoComplete}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-brand-red disabled:bg-gray-50"
          />
        </label>
      ))}
    </fieldset>
  );
}
