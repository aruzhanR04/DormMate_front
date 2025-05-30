import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import "../../styles/AdminPanel.css";
import studentIcon from "../../assets/icons/adminStudent.svg";
import dormIcon from "../../assets/icons/adminDormitories.svg";
import appIcon from "../../assets/icons/adminApplications.svg";
import newStudentIcon from "../../assets/icons/adminStudentPlus.svg";
import newDormIcon from "../../assets/icons/adminDormAdd.svg";
import approveIcon from "../../assets/icons/adminApprove.svg";
import importIcon from "../../assets/icons/adminImport.svg";
import moveoutIcon from "../../assets/icons/adminMoveOut.svg";

const mockStats = {
  students: 1234,
  dorms: 3,
  applications: 22,
};

const mockActions = [
  {
    icon: newStudentIcon,
    title: "Новый студент",
    desc: "Имя фамилия добавлен в систему",
  },
  {
    icon: newDormIcon,
    title: "Новое общежитие",
    desc: "Дом студентов 4 добавлено в систему",
  },
  {
    icon: approveIcon,
    title: "Заявка одобрена",
    desc: "Заявка #1234 одобрена (фамилия И.)",
  },
  {
    icon: importIcon,
    title: "Импорт данных",
    desc: "Загружен новый список студентов из Excel",
  },
  {
    icon: moveoutIcon,
    title: "Выселение",
    desc: "Фамилия И. выселен из общежития №2",
  },
];

const AdminPanel = () => {
  const [stats, setStats] = useState(mockStats);
  const [actions, setActions] = useState(mockActions);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <h2 className="admin-title">Админ панель</h2>
        <div className="admin-dashboard-cards">
          <div className="admin-card">
            <img src={studentIcon} alt="" className="admin-card-icon" />
            <div className="admin-card-title">Студенты</div>
            <div className="admin-card-count">{stats.students}</div>
            <div className="admin-card-desc">Зарегистрировано студентов</div>
            <button className="admin-card-btn">Управление</button>
          </div>
          <div className="admin-card">
            <img src={dormIcon} alt="" className="admin-card-icon" />
            <div className="admin-card-title">Общежития</div>
            <div className="admin-card-count">{stats.dorms}</div>
            <div className="admin-card-desc">Общежитий в системе</div>
            <button className="admin-card-btn">Управление</button>
          </div>
          <div className="admin-card">
            <img src={appIcon} alt="" className="admin-card-icon" />
            <div className="admin-card-title">Заявки</div>
            <div className="admin-card-count">{stats.applications}</div>
            <div className="admin-card-desc">Заявок на рассмотрении</div>
            <button className="admin-card-btn">Управление</button>
          </div>
        </div>
        <div className="admin-last-actions">
          <div className="admin-last-title">Последние действия</div>
          <div className="admin-last-list">
            {actions.map((a, i) => (
              <div className="admin-action" key={i}>
                <img src={a.icon} alt="" className="admin-action-icon" />
                <div>
                  <div className="admin-action-title">{a.title}</div>
                  <div className="admin-action-desc">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
