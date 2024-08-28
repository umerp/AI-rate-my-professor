import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";

export default function SignOut({ closeAnchor }) {
  const handleLogout = async () => {
    await signOut();
    closeAnchor();
  };
  return (
    <button
      type="submit"
      className="text-lg font-medium  rounded-lg p-2 transition-all cursor-pointer"
      onClick={handleLogout}
    >
      Logout{" "}
      <span className="ml-10">
        <LogoutIcon />
      </span>
    </button>
  );
}
