// src/components/AdminPanel.jsx

import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminPanel.css";
import studentIcon from "../../assets/icons/adminStudent.svg";
import dormIcon from "../../assets/icons/adminDormitories.svg";
import appIcon from "../../assets/icons/adminApplications.svg";
import AuditLog from "./AuditLog.jsx";
import api from "../../api.js";
import { useI18n } from "../../i18n/I18nContext";

const AdminPanel = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState(null);
  const [dormsCount, setDormsCount] = useState(null);
  const [appsCount, setAppsCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [studRes, dormRes, appsRes] = await Promise.all([
          api.get("/students/count"),
          api.get("/dorms/count"),
          api.get("/apps/count"),
        ]);
        setStudentCount(studRes.data);
        setDormsCount(dormRes.data);
        setAppsCount(appsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const handleNavigate = (to) => navigate(`/admin/${to}`);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        {/* Header buttons */}
        <div className="admin-header-row">
          <div style={{ flex: 1 }} />
          <button
            className="admin-chat-btn"
            onClick={() => navigate("/admin/dorm-chats")}
            style={{ marginRight: "2vw" }}
          >
            {t("adminPanel.header.dormChats")}
          </button>
          <button
            className="admin-chat-btn"
            onClick={() => navigate("/admin/chats")}
          >
            {t("adminPanel.header.chats")}
          </button>
        </div>

        <h2 className="admin-title">{t("adminPanel.title")}</h2>

        <div className="admin-dashboard-cards">
          {/* Students card */}
          <div className="admin-card">
            <img
              src={studentIcon}
              alt=""
              className="admin-card-icon"
            />
            <div className="admin-card-title">
              {t("adminPanel.cards.students.title")}
            </div>
            <div className="admin-card-count">
              {!loading && studentCount?.count}
            </div>
            <div className="admin-card-desc">
              {t("adminPanel.cards.students.desc")}
            </div>
            <button
              className="admin-card-btn"
              onClick={() => handleNavigate("students")}
            >
              {t("adminPanel.cards.students.btn")}
            </button>
          </div>

          {/* Dormitories card */}
          <div className="admin-card">
            <img
              src={dormIcon}
              alt=""
              className="admin-card-icon"
            />
            <div className="admin-card-title">
              {t("adminPanel.cards.dormitories.title")}
            </div>
            <div className="admin-card-count">
              {!loading && dormsCount?.total_dorms}
            </div>
            <div className="admin-card-desc">
              {t("adminPanel.cards.dormitories.desc")}
            </div>
            <button
              className="admin-card-btn"
              onClick={() => handleNavigate("dormitories")}
            >
              {t("adminPanel.cards.dormitories.btn")}
            </button>
          </div>

          {/* Applications card */}
          <div className="admin-card">
            <img
              src={appIcon}
              alt=""
              className="admin-card-icon"
            />
            <div className="admin-card-title">
              {t("adminPanel.cards.applications.title")}
            </div>
            <div className="admin-card-count">
              {!loading && appsCount?.count}
            </div>
            <div className="admin-card-desc">
              {t("adminPanel.cards.applications.desc")}
            </div>
            <button
              className="admin-card-btn"
              onClick={() => handleNavigate("applications")}
            >
              {t("adminPanel.cards.applications.btn")}
            </button>
          </div>
        </div>

        {/* Audit log */}
        <AuditLog />
      </div>
    </div>
  );
};

export default AdminPanel;
