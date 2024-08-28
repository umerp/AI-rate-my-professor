import { signIn } from "next-auth/react";

export default function SignIn() {
  const handleLogin = async () => {
    await signIn();
    closeAnchor();
  };
  return (
    <button
      type="submit"
      className="text-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg p-2 transition-all cursor-pointer"
      onClick={handleLogin}
    >
      Sign In
    </button>
  );
}
