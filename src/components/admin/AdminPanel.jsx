import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from 'react-router-dom';
import "../../styles/AdminPanel.css";
import studentIcon from "../../assets/icons/adminStudent.svg";
import dormIcon from "../../assets/icons/adminDormitories.svg";
import appIcon from "../../assets/icons/adminApplications.svg";
import newStudentIcon from "../../assets/icons/adminStudentPlus.svg";
import newDormIcon from "../../assets/icons/adminDormAdd.svg";
import approveIcon from "../../assets/icons/adminApprove.svg";
import importIcon from "../../assets/icons/adminImport.svg";
import moveoutIcon from "../../assets/icons/adminMoveOut.svg";
import api from "../../api.js";
import AuditLog from "./AuditLog.jsx";
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
  const navigate = useNavigate()
  const [stats, setStats] = useState(mockStats);
  const [actions, setActions] = useState(mockActions);
  const [studentCount, setStudentCount] = useState()
  const [dormsCount, setDormsCount] = useState()
  const [appsCount, setAppsCount] = useState()
  const [loading, setLoading] = useState(true);
  const [allowEdit, setAllowEdit] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [isEditWarningOpen, setIsEditWarningOpen] = useState(false);


  useEffect(() => {
    const fetchStudentCount = async () => {
        try {
            const response = await api.get('/students/count');
            setStudentCount(response.data);
        } catch (err) {
            setStudentCountError('Не удалось загрузить данные');
        } finally {
            setLoading(false);
        }
    };



    const fetchDormCount = async () => {
      try {
          const response = await api.get('/dorms/count');
          setDormsCount(response.data);
      } catch (err) {
          setDormsCountError('Не удалось загрузить данные');
      } finally {
          setLoading(false);
      }
  };



  const fetchAppsCount = async () => {
    try {
        const response = await api.get('/apps/count');
        setAppsCount(response.data);
    } catch (err) {
        setAppsCountError('Не удалось загрузить данные');
    } finally {
        setLoading(false);
    }
};

    fetchAppsCount()
    fetchStudentCount();
    fetchDormCount()
}, []);




const handleNavigate = (to) => {
      navigate(`/admin/${to}`);
};

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <h2 className="admin-title">Админ панель</h2>
        <div className="admin-dashboard-cards">
          <div className="admin-card">
            <img src={studentIcon} alt="" className="admin-card-icon" />
            <div className="admin-card-title">Студенты</div>
            <div className="admin-card-count">{studentCount ? studentCount.count : ""}</div>
            <div className="admin-card-desc">Зарегистрировано студентов</div>
            <button className="admin-card-btn" onClick={() => handleNavigate("students")}>Управление</button>
          </div>
          <div className="admin-card">
            <img src={dormIcon} alt="" className="admin-card-icon" />
            <div className="admin-card-title">Общежития</div>
            <div className="admin-card-count">{dormsCount?.total_dorms ?? 0}</div>
            <div className="admin-card-desc">Общежитий в системе</div>
            <button className="admin-card-btn" onClick={() => handleNavigate("dormitories")}>Управление</button>
          </div>
          <div className="admin-card">
            <img src={appIcon} alt="" className="admin-card-icon" />
            <div className="admin-card-title">Заявки</div>
            <div className="admin-card-count">{appsCount ? appsCount.count : ""}</div>
            <div className="admin-card-desc">Заявок на рассмотрении</div>
            <button className="admin-card-btn" onClick={() => handleNavigate("applications")}>Управление</button>
          </div>
        </div>
        {/* <div className="admin-last-actions">
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
        </div> */}
        <AuditLog />
      </div>
    </div>
  );
};

export default AdminPanel;
