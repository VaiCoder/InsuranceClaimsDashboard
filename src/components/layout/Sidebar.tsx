import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ShieldCheck,
} from "lucide-react";

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Claims", icon: FileText },
  { label: "Users & Roles", icon: Users },
  { label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <ShieldCheck size={28} />
        <span>ClaimSphere</span>
      </div>

      <div className="navigation-label">WORKSPACE</div>

      <nav>
        {navigationItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={`nav-item ${index === 0 ? "active" : ""}`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">Enterprise Claims Platform</div>
    </aside>
  );
}
