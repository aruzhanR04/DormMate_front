// AdminApplicationsDistributePage.jsx

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
  const [modal, setModal] = useState(null);
  const [modalApp, setModalApp] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setApplications(data);
    } catch (err) {
      console.error("Ошибка при загрузке заявок:", err);
      setApplications([]);
    }
  };

  // Фильтрация по ФИО
  const filteredApps = applications.filter((app) => {
    const fio = `${app.student?.last_name ?? ""} ${app.student?.first_name ?? ""}`.toLowerCase();
    return fio.includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const paginatedApps = filteredApps.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Модальное окно подтверждения (одобрить / отклонить)
  const ModalConfirm = ({ type, applicationId, onConfirmSuccess, onCancel }) => {
    const handleConfirm = async () => {
      const url =
        type === "approve"
          ? `/applications/${applicationId}/approve/`
          : `/applications/${applicationId}/reject/`;
      try {
        await api.put(url, {}); // предполагаем, что именно PUT нужен
        onConfirmSuccess();     // обновим локальное состояние
      } catch (error) {
        alert(`Ошибка: ${error.message}`);
      }
    };

    return (
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
            <button className="save-btn modal-btn" onClick={handleConfirm}>Далее</button>
          </div>
        </div>
      </div>
    );
  };

  // Модальное окно подробностей заявки
  const ModalDetails = ({ application, onClose }) => (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 520 }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <h2 style={{ fontWeight: 700, fontSize: 22 }}>Заявка ID: {application.id}</h2>
        <div className="form-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div>
            <label><strong>Студент</strong>
              <input
                value={application.student ? `${application.student.last_name} ${application.student.first_name}` : ""}
                disabled
              />
            </label>
            <label><strong>GPA/ЕНТ</strong>
              <input
                value={application.gpa || application.ent_result || "-"}
                disabled
              />
            </label>
            <label><strong>Оплата</strong>
              <input
                value={application.payment_file || "-"}
                disabled
              />
            </label>
            {(application.certificates || []).map((cert, idx) => (
              <div
                key={idx}
                style={{ display: "flex", alignItems: "center", marginBottom: 6 }}
              >
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
              <input value={application.status || "-"} disabled />
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

  // после успешного PUT-запроса обновляем локальный массив applications
  const handleApproveSuccess = (id) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "approved" } : app
      )
    );
    setModal(null);
  };
  const handleRejectSuccess = (id) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "rejected" } : app
      )
    );
    setModal(null);
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        {/* Заголовок и вкладки */}
        <div className="header-row">
          <h1 style={{ fontSize: 29, fontWeight: 700, color: "#222" }}>
            Распределение студентов
          </h1>
          <div className="actions-list-distribute">
            <button
              className="actions-list-distribute-btn"
              onClick={() => navigate("/admin/applications")}
            >
              Все заявки
            </button>
            <button className="actions-list-distribute-btn active">
              Распределить студентов
            </button>
            <button className="actions-list-distribute-btn saveexel">
              Выгрузить Exel
            </button>
          </div>
        </div>

        {/* Поисковая строка */}
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

          {/* Таблица с заявками */}
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
              ) : (
                paginatedApps.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>
                      {app.student
                        ? `${app.student.last_name} ${app.student.first_name} ${app.student.middle_name}`
                        : "-"}
                    </td>
                    <td>{app.dorm?.name || "-"}</td>
                    <td>{app.application?.gpa || app.application?.ent_result || "-"}</td>
                    <td>{app.status || "-"}</td>
                    <td>
                      {app.payment_file
                        ? (
                          <a href={app.payment_file} target="_blank" rel="noreferrer">
                            Посмотреть чек
                          </a>
                        )
                        : "-"}
                    </td>
                    <td>
                      <button
                        className="operation-icon"
                        title="Одобрить"
                        onClick={() => {
                          setModalType("approve");
                          setModalApp(app);
                          setModal("confirm");
                        }}
                      >
                        <img
                          src={
                            app.status === "pending" || app.status === "rejected"
                              ? approveGray
                              : approveRed
                          }
                          alt="approve"
                        />
                      </button>

                      <button
                        className="operation-icon"
                        title="Отклонить"
                        onClick={() => {
                          setModalType("reject");
                          setModalApp(app);
                          setModal("confirm");
                        }}
                      >
                        <img
                          src={
                            app.status === "rejected"
                              ? rejectRed
                              : rejectGray
                          }
                          alt="reject"
                        />
                      </button>

                      <button
                        className="operation-icon"
                        title="Подробнее"
                        onClick={() => {
                          setModalType("details");
                          setModalApp(app);
                          setModal("details");
                        }}
                      >
                        <img src={eyeRed} alt="view" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
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

        {/* Нижние кнопки */}
        <div style={{ display: "flex", gap: 18, marginTop: 28, justifyContent: "flex-end" }}>
          <button className="actions-list-distribute-btn selected">Автоматический отбор</button>
          <button className="actions-list-distribute-btn ve">Уведомить студентов</button>
        </div>
      </div>

      {/* Модалки */}
      {modal === "confirm" && (
        <ModalConfirm
          type={modalType}
          applicationId={modalApp.id}
          onConfirmSuccess={() =>
            modalType === "approve"
              ? handleApproveSuccess(modalApp.id)
              : handleRejectSuccess(modalApp.id)
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
