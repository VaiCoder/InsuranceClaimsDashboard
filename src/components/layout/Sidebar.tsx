import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ShieldCheck,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Claims", path: "/claims", icon: FileText },
  { label: "Users & Roles", path: "/users", icon: Users },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <ShieldCheck size={25} />
        <span>ClaimSphere</span>
      </div>

      <p className="navigation-label">WORKSPACE</p>

      <nav>
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">Enterprise Claims Platform</div>
    </aside>
  );
}
