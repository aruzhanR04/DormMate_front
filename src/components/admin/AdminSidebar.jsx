import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/AdminSidebar.css";

import adminDashboard from "../../assets/icons/adminDashboard.svg";
import adminStudent from "../../assets/icons/adminStudent.svg";
import adminDormitories from "../../assets/icons/adminDormitories.svg";
import adminApplications from "../../assets/icons/adminApplications.svg";
import adminChats from "../../assets/icons//adminApplications.svg";
import adminAdmin from "../../assets/icons/adminAdmin.svg";
import adminEvidence from "../../assets/icons/adminEvidence.svg";

const menuItems = [
  { path: "/admin", label: "Панель", icon: adminDashboard },
  { path: "/admin/students", label: "Студенты", icon: adminStudent },
  { path: "/admin/dormitories", label: "Общежития", icon: adminDormitories },
  { path: "/admin/applications", label: "Заявки", icon: adminApplications },
  { path: "/admin/chats", label: "Чаты", icon: adminChats },
  { path: "/admin/admins", label: "Администраторы", icon: adminAdmin },
  { path: "/admin/evidence-types", label: "Категории справок", icon: adminEvidence },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="sidebar">
      <ul>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li
              key={item.path}
              className={isActive ? "active" : ""}
              onClick={() => navigate(item.path)}
              tabIndex={0}
              onKeyDown={e => e.key === "Enter" && navigate(item.path)}
            >
              <span className="sidebar-marker" />
              <img
                src={item.icon}
                alt={item.label}
                className="nav-icon"
                draggable={false}
              />
              <span className="sidebar-label">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AdminSidebar;
