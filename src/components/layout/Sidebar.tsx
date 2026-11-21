import { NavLink } from "react-router-dom";
import {
  Bolt,
  SquareUserRound,
  Box,
  Wallet,
  BadgePercent,
  MessageCircleQuestionMark,
  KeyRound,
  ChevronRight,
  ChevronDown,
  UserRound,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/claims", icon: KeyRound },
  { label: "Product", path: "/products", icon: Box },
  { label: "Customers", path: "/", icon: SquareUserRound },
  { label: "Income", path: "/users", icon: Wallet },
  { label: "Promote", path: "/settings", icon: BadgePercent },
  { label: "Help", path: "/settings", icon: MessageCircleQuestionMark },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Bolt size={25} />
        <span>Dashboard</span>
      </div>

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
            <span className="nav-item-arrow"><ChevronRight size={16} /></span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-profile-icon"><UserRound size={42} /></div>
          <div>
            <strong>Evano</strong>
            <small>Project Manager</small>
          </div>
          <div className="nav-item-arrow"><ChevronDown size={16} /></div>
        </div>

      </div>
    </aside>
  );
}
