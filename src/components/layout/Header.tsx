import { useLocation } from "react-router-dom";
import { Bell, CircleUserRound } from "lucide-react";

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/claims": "Claims",
  "/users": "Users & Roles",
  "/settings": "Settings",
};

export default function Header() {
  const location = useLocation();

  const currentPage = routeLabels[location.pathname] ?? "Workspace";

  return (
    <header className="header">
      <div className="breadcrumb">Workspace / {currentPage}</div>

      <div className="header-actions">
        <button className="icon-button" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className="user-profile">
          <CircleUserRound size={24} />
          <div>
            <strong>Admin User</strong>
            <small>Claims Administrator</small>
          </div>
        </div>
      </div>
    </header>
  );
}
