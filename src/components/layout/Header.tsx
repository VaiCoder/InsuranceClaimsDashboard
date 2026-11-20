import { Bell, UserCircle } from "lucide-react";

export function Header() {
  return (
    <header className="header">
      <div className="breadcrumb">Workspace / Dashboard</div>

      <div className="header-actions">
        <button className="icon-button" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className="user-profile">
          <UserCircle size={25} />
          <div>
            <strong>Admin User</strong>
            <small>Claims Administrator</small>
          </div>
        </div>
      </div>
    </header>
  );
}
