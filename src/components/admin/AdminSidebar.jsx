// src/components/AdminSidebar.jsx

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/AdminSidebar.css";
import { useI18n } from "../../i18n/I18nContext";

import adminDashboard from "../../assets/icons/adminDashboard.svg";
import adminStudent from "../../assets/icons/adminStudent.svg";
import adminDormitories from "../../assets/icons/adminDormitories.svg";
import adminApplications from "../../assets/icons/adminApplications.svg";
import adminAdmin from "../../assets/icons/adminAdmin.svg";
import adminEvidence from "../../assets/icons/adminEvidence.svg";

const menuItems = [
  { path: "/admin", key: "dashboard", icon: adminDashboard },
  { path: "/admin/students", key: "students", icon: adminStudent },
  { path: "/admin/dormitories", key: "dormitories", icon: adminDormitories },
  { path: "/admin/applications", key: "applications", icon: adminApplications },
  { path: "/admin/admins", key: "admins", icon: adminAdmin },
  { path: "/admin/evidence-types", key: "evidenceTypes", icon: adminEvidence },
];

const AdminSidebar = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="sidebar">
      <ul>
        {menuItems.map(({ path, key, icon }) => {
          const isActive = location.pathname === path;
          return (
            <li
              key={path}
              className={isActive ? "active" : ""}
              onClick={() => navigate(path)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(path)}
            >
              <span className="sidebar-marker" />
              <img
                src={icon}
                alt={t(`adminSidebar.menu.${key}`)}
                className="nav-icon"
                draggable={false}
              />
              <span className="sidebar-label">
                {t(`adminSidebar.menu.${key}`)}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AdminSidebar;
