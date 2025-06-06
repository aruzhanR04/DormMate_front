// src/components/admin/AdminApplicationsDistributePage.jsx

import React, { useEffect, useState } from "react";
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

  // ------------------------------------------------------------------
  // 1. Стейт
  // ------------------------------------------------------------------
  const [applications, setApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Для открытия модалок
  const [modal, setModal] = useState(null); // "confirm" или "details" или null
  const [modalApp, setModalApp] = useState(null);
  const [modalType, setModalType] = useState(null); // "approve" или "reject"

  // Для модалки уведомлений/автоматического отбора
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false); // индикатор загрузки

  // ------------------------------------------------------------------
  // 2. Функция fetchApplications с серверной пагинацией
  // ------------------------------------------------------------------
  const fetchApplications = async () => {
    try {
      const params = { page, page_size: ITEMS_PER_PAGE };
      const res = await api.get("/applications/", { params });
      const data = res.data;
      const resultsArray = Array.isArray(data.results) ? data.results : [];
      setApplications(resultsArray);
      setTotalCount(typeof data.count === "number" ? data.count : 0);
    } catch (err) {
      console.error("Ошибка при загрузке заявок:", err);
      setApplications([]);
      setTotalCount(0);
    }
  };

  // ------------------------------------------------------------------
  // 3. Хук: запрашиваем при монтировании и при смене page
  // ------------------------------------------------------------------
  useEffect(() => {
    fetchApplications();
  }, [page]);

  // ------------------------------------------------------------------
  // 4. Локальная фильтрация по строке search (по ФИО студента)
  // ------------------------------------------------------------------
  const filteredApps = applications.filter((app) => {
    const fio = `${app.student?.last_name ?? ""} ${app.student?.first_name ?? ""}`.toLowerCase();
    return fio.includes(search.toLowerCase());
  });

  // ------------------------------------------------------------------
  // 5. Вычисляем число страниц (по totalCount)
  // ------------------------------------------------------------------
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // ------------------------------------------------------------------
  // 6. Handlers для модалок “Одобрить/Отклонить” и “Подробнее”
  // ------------------------------------------------------------------
  const handleApproveSuccess = (id) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "approved" } : app))
    );
    setModal(null);
  };
  const handleRejectSuccess = (id) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "rejected" } : app))
    );
    setModal(null);
  };

  // ------------------------------------------------------------------
  // 7. Обработка автоматического отбора (раньше был alert)
  // ------------------------------------------------------------------
  const handleAutomaticSelection = async () => {
    try {
      const response = await api.post("/generate-selection/");
      setNotifyMessage(response.data.detail || "Автоматический отбор завершён");
    } catch (error) {
      console.error("Ошибка при автоматическом отборе:", error);
      setNotifyMessage("Произошла ошибка при автоматическом отборе");
    } finally {
      setNotifyModalOpen(true);
      fetchApplications();
    }
  };

  // ------------------------------------------------------------------
  // 8. Обработка уведомления студентов с индикацией загрузки
  // ------------------------------------------------------------------
  const handleNotifyStudents = async () => {
    setNotifyLoading(true);
    try {
      const response = await api.post("/notify-approved/");
      setNotifyMessage(response.data.detail || "Уведомления отправлены");
    } catch (error) {
      console.error("Ошибка при уведомлении студентов:", error);
      setNotifyMessage("Произошла ошибка при отправке уведомлений");
    } finally {
      setNotifyLoading(false);
      setNotifyModalOpen(true);
      fetchApplications();
    }
  };

  // ------------------------------------------------------------------
  // 9. JSX
  // ------------------------------------------------------------------
  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        {/* ===== Заголовок и вкладки ===== */}
        <div className="header-row">
          <h1 style={{ fontSize: 29, fontWeight: 700, color: "#222" }}>
            Распределение студентов
          </h1>
          <div className="actions-list-distribute">
            <button
              className="actions-list-distribute-btn selected"
              onClick={() => navigate("/admin/applications")}
            >
              Все заявки
            </button>
            <button className="actions-list-distribute-btn active" onClick={() => navigate("/admin/applications/distribute")}>
              Распределить студентов
            </button>
            <button className="actions-list-distribute-btn saveexel">
              Выгрузить Excel
            </button>
          </div>
        </div>

        {/* ===== Строка поиска ===== */}
        <div className="students-table-container">
          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <div className="search-row" style={{ margin: 0, position: "relative" }}>
              <input
                className="search-input"
                placeholder="Поиск..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
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

          {/* ===== Таблица с заявками (показываем filteredApps) ===== */}
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Студент</th>
                <th>GPA/ЕНТ</th>
                <th>Статус</th>
                <th>Оплата</th>
                <th>Операции</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", color: "#888", padding: 34 }}
                  >
                    Нет данных для отображения.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>
                      {app.student
                        ? `${app.student.last_name} ${app.student.first_name} ${app.student.middle_name || ""}`
                        : "-"}
                    </td>
                    <td>{app.gpa ?? app.ent_result ?? "-"}</td>
                    <td>{app.status || "-"}</td>
                    <td>
                      {app.payment_file ? (
                        <a href={app.payment_file} target="_blank" rel="noreferrer">
                          Посмотреть чек
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {/* Кнопка “Одобрить” */}
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
                          src={app.status !== "rejected" && app.status !== "pending" ? approveRed : approveGray}
                          alt="approve"
                        />
                      </button>

                      {/* Кнопка “Отклонить” */}
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
                          src={app.status === "rejected" ? rejectRed : rejectGray}
                          alt="reject"
                        />
                      </button>

                      {/* Кнопка “Подробнее” */}
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

        {/* ===== Пагинация (отображаем только если totalPages > 1) ===== */}
        {totalPages > 1 && (
          <div className="pagination">
            {/* Prev */}
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              &lt;
            </button>

            {/* Номера страниц */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn${page === pageNum ? " active" : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next */}
            <button
              className="pagination-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              &gt;
            </button>
          </div>
        )}

        {/* ===== Нижние кнопки ===== */}
        <div
          style={{
            display: "flex",
            gap: 18,
            marginTop: 28,
            justifyContent: "flex-end",
          }}
        >
          <button
            className="actions-list-distribute-btn selected"
            onClick={handleAutomaticSelection}
          >
            Автоматический отбор
          </button>
          <button
            className="actions-list-distribute-btn ve"
            onClick={handleNotifyStudents}
            disabled={notifyLoading}
          >
            {notifyLoading ? "Отправка..." : "Уведомить студентов"}
          </button>
        </div>
      </div>

      {/* ===== Модалки ===== */}
      {modal === "confirm" && modalApp && (
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
      {modal === "details" && modalApp && (
        <ModalDetails application={modalApp} onClose={() => setModal(null)} />
      )}

      {/* ===== Модалка уведомлений/авт. отбора ===== */}
      {notifyModalOpen && (
        <NotificationModal
          message={notifyMessage}
          onClose={() => setNotifyModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminApplicationsDistributePage;

// =======================================================================
// Модалка подтверждения (одобрить/отклонить заявку)
// =======================================================================
const ModalConfirm = ({ type, applicationId, onConfirmSuccess, onCancel }) => {
  const handleConfirm = async () => {
    const url =
      type === "approve"
        ? `/applications/${applicationId}/approve/`
        : `/applications/${applicationId}/reject/`;

    try {
      await api.put(url, {});
      onConfirmSuccess();
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
          Вы действительно хотите {type === "approve" ? "одобрить" : "отклонить"} заявку?
        </div>
        <div className="modal-actions" style={{ justifyContent: "center", gap: 24 }}>
          <button className="cancel-btn modal-btn" onClick={onCancel}>
            Отмена
          </button>
          <button className="save-btn modal-btn" onClick={handleConfirm}>
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};

// =======================================================================
// Модалка подробностей заявки и справок
// =======================================================================
const ModalDetails = ({ application, onClose }) => {
  const evidencesList = application.evidences || [];

  // Оптимистичное обновление статуса справки в UI
  const updateEvidenceStatus = async (evidenceId, approveValue) => {
    onClose(); // Закрываем детали, чтобы при следующем fetch список обновился
    try {
      await api.put(`/evidences/${evidenceId}/update-status/`, {
        approved: approveValue,
      });
    } catch (err) {
      console.error("Не удалось обновить статус справки:", err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ minWidth: 520 }}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        <h2 style={{ fontWeight: 700, fontSize: 22 }}>
          Заявка ID: {application.id}
        </h2>

        <div className="form-container">
          <div>
            <label>
              <strong>Студент</strong>
              <input
                value={
                  application.student
                    ? `${application.student.last_name} ${application.student.first_name} ${
                        application.student.middle_name || ""
                      }`
                    : ""
                }
                disabled
              />
            </label>

            <label>
              <strong>GPA / ЕНТ</strong>
              <input
                value={application.gpa ?? application.ent_result ?? "-"}
                disabled
              />
            </label>

            <label>
              <strong>Оплата</strong>
              <input value={application.payment_file ?? "-"} disabled />
            </label>

            <div style={{ marginTop: 16, marginBottom: 6 }}>
              <strong>Справки:</strong>
            </div>
            {evidencesList.length === 0 ? (
              <div style={{ color: "#888", fontStyle: "italic" }}>
                Нет загруженных справок
              </div>
            ) : (
              evidencesList.map((cert) => (
                <div
                  key={cert.id}
                  style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
                >
                  <input
                    style={{ flex: 1, marginRight: 10 }}
                    value={cert.evidence_type_code || cert.code || ""}
                    disabled
                  />
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginRight: 10,
                      textDecoration: "underline",
                      color: "#363636",
                    }}
                  >
                    Просмотреть
                  </a>
                  <button
                    style={{ background: "transparent", border: "none", marginRight: 6 }}
                    onClick={() => updateEvidenceStatus(cert.id, true)}
                    title="Принять справку"
                  >
                    <img
                      src={cert.approved === true ? approveRed : approveGray}
                      alt="Принять"
                      className="operation-icon"
                    />
                  </button>
                  <button
                    style={{ background: "transparent", border: "none" }}
                    onClick={() => updateEvidenceStatus(cert.id, false)}
                    title="Отклонить справку"
                  >
                    <img
                      src={cert.approved === false ? rejectRed : rejectGray}
                      alt="Отклонить"
                      className="operation-icon"
                    />
                  </button>
                </div>
              ))
            )}
          </div>

          <div>
            <label>
              <strong>Общежитие</strong>
              <input value={application.dorm?.name ?? "-"} disabled />
            </label>
            <label>
              <strong>Статус</strong>
              <input value={application.status ?? "-"} disabled />
            </label>
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: 24 }}>
          <button className="cancel-btn" onClick={onClose}>
            Отмена
          </button>
          <button className="save-btn" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

// =======================================================================
// Модалка уведомлений/автоматического отбора
// =======================================================================
const NotificationModal = ({ message, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: 350, textAlign: "center" }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Информация</h2>
        <div style={{ fontSize: 16, marginBottom: 24 }}>{message}</div>
        <button className="save-btn modal-btn" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};
