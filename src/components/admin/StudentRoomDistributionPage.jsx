import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import AdminSidebar from "./AdminSidebar";
import searchIcon from "../../assets/icons/Search.svg";
import approveRed from "../../assets/icons/approve-color.svg";
import approveGray from "../../assets/icons/approve-gray.svg";
import rejectRed from "../../assets/icons/decline-color.svg";
import rejectGray from "../../assets/icons/decline-gray.svg";
import eyeRed from "../../assets/icons/viewIcon.svg";
import "../../styles/AdminApplicationsDistribute.css";

const ITEMS_PER_PAGE = 10;

const AdminApplicationsDistributePage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("distribute");
  const [modal, setModal] = useState(null);

  const [modalApp, setModalApp] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/student-in-dorm/");
      let data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setApplications(data);
    } catch {
      setApplications([]);
    }
  };

  const filteredApps = applications.filter((app) => {
    const fio = `${app.student?.last_name ?? ""} ${app.student?.first_name ?? ""}`.toLowerCase();
    return fio.includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const paginatedApps = filteredApps.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const ModalConfirm = ({ type, onConfirm, onCancel }) => (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 370 }}>
        <h2 style={{ fontSize: 22, marginBottom: 18 }}>
          {type === "approve" ? "Одобрение заявки" : "Отклонение заявки"}
        </h2>
        <div style={{ fontSize: 18, marginBottom: 20 }}>
          Вы действительно хотите {type === "approve" ? "одобрить" : "отклонить"} заявку студента?
        </div>
        <div className="modal-actions" style={{ justifyContent: "center", gap: 24 }}>
          <button className="cancel-btn modal-btn" onClick={onCancel}>Отмена</button>
          <button className="save-btn modal-btn" onClick={onConfirm}>Далее</button>
        </div>
      </div>
    </div>
  );

  const ModalDetails = ({ application, onClose }) => (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 520 }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2 style={{ fontWeight: 700, fontSize: 22 }}>Заявка ID:{application.id}</h2>
        <div className="form-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div>
            <label><strong>Студент</strong>
              <input value={application.student ? `${application.student.last_name} ${application.student.first_name}` : ""} disabled />
            </label>
            <label><strong>GPA/ЕНТ</strong>
              <input value={application.application.gpa || application.application.ent_result || "-"} disabled />
            </label>
            <label><strong>Оплата</strong>
              <input value={application.payment_file || "-"} disabled />
            </label>
            {(application.certificates || []).map((cert, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                <input style={{ flex: 1, marginRight: 10 }} value={cert.name} disabled />
                <button style={{ background: "transparent", border: "none" }}>
                  <img src={approveGray} alt="Принять" className="operation-icon" />
                </button>
                <button style={{ background: "transparent", border: "none" }}>
                  <img src={rejectGray} alt="Отклонить" className="operation-icon" />
                </button>
              </div>
            ))}
          </div>
          <div>
            <label><strong>Общежитие</strong>
              <input value={application.dorm?.name || "-"} disabled />
            </label>
            <label><strong>Статус</strong>
              <input value={application.application.status || "-"} disabled />
            </label>
          </div>
        </div>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Отмена</button>
          <button className="save-btn">Далее</button>
        </div>
      </div>
    </div>
  );


  const handleApprove = (id) => {
    setModal(null);
  };
  const handleReject = (id) => {
    setModal(null);
  };


  const handleTab = (tab) => {
    setActiveTab(tab);
    if (tab === "all") navigate("/admin/applications");
    if (tab === "distribute") navigate("/admin/applications/distribute");
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <div className="header-row">
          <h1 style={{ fontSize: 29, fontWeight: 700, color: "#222" }}>Распределение студентов</h1>
          <div className="actions-list-distribute">
            <button className="actions-list-distribute-btn selected" onClick={() => navigate("/admin/applications")}>
              Все заявки
            </button>
            <button
              className="actions-list-distribute-btn active"
            >
              Распределить студентов
            </button>
            <button className="actions-list-distribute-btn saveexel">
              Выгрузить Exel
            </button>
          </div>
        </div>

        <div className="students-table-container">
          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <div className="search-row" style={{ margin: 0, position: "relative" }}>
              <input
                className="search-input"
                placeholder="Поиск..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingRight: 44 }}
              />
              <img
                src={searchIcon}
                alt="search"
                className="search-icon"
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 28,
                  height: 28,
                  opacity: 0.83,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Студент</th>
                <th>Общежитие</th>
                <th>GPA/ЕНТ</th>
                <th>Статус</th>
                <th>Оплата</th>
                <th>Операции</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#888", padding: 34 }}>
                    Нет данных для отображения.
                  </td>
                </tr>
              ) : paginatedApps.map(app => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.student ? `${app.student.last_name} ${app.student.first_name}` : "-"}</td>
                  <td>{app.dorm?.name || "-"}</td>
                  <td>{app.application?.gpa || app.application?.ent_result || "-"}</td>
                  <td>{app.application?.status || "-"}</td>
                  <td>
                    {app.payment_file
                      ? <a href={app.payment_file} target="_blank" rel="noreferrer">Посмотреть чек</a>
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="operation-icon"
                      title="Одобрить"
                      style={{ background: "none", border: "none" }}
                      onClick={() => { setModalType("approve"); setModalApp(app); setModal("confirm"); }}
                    >
                      <img src={app.application?.status === "approved" ? approveGray : approveRed} alt="approve" />
                    </button>
                    <button
                      className="operation-icon"
                      title="Отклонить"
                      style={{ background: "none", border: "none" }}
                      onClick={() => { setModalType("reject"); setModalApp(app); setModal("confirm"); }}
                    >
                      <img src={app.application?.status === "rejected" ? rejectGray : rejectRed} alt="reject" />
                    </button>
                    <button
                      className="operation-icon"
                      title="Подробнее"
                      style={{ background: "none", border: "none" }}
                      onClick={() => { setModalType("details"); setModalApp(app); setModal("details"); }}
                    >
                      <img src={eyeRed} alt="view" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                className={`pagination-btn${page === idx + 1 ? " active" : ""}`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 18, marginTop: 28, justifyContent: "flex-end" }}>
          <button className="actions-list-distribute-btn selected">Автоматический отбор</button>
          <button className="actions-list-distribute-btn save">Уведомить студентов</button>
        </div>
      </div>

      {/* Модалки */}
      {modal === "confirm" && (
        <ModalConfirm
          type={modalType}
          onConfirm={() =>
            modalType === "approve"
              ? handleApprove(modalApp.id)
              : handleReject(modalApp.id)
          }
          onCancel={() => setModal(null)}
        />
      )}
      {modal === "details" && (
        <ModalDetails
          application={modalApp}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default AdminApplicationsDistributePage;
