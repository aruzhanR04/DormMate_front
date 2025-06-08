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
import { useI18n } from "../../i18n/I18nContext";

const ITEMS_PER_PAGE = 10;

const AdminApplicationsDistributePage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const cfg = t("adminApplicationsDistributePage");

  // 1. State
  const [applications, setApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Modals
  const [modal, setModal] = useState(null); // "confirm" | "details" | null
  const [modalApp, setModalApp] = useState(null);
  const [modalType, setModalType] = useState(null); // "approve" | "reject"

  // Notification / auto-selection modal
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);

  // 2. Fetch with server-side pagination
  const fetchApplications = async () => {
    try {
      const { data } = await api.get("/applications/", {
        params: { page, page_size: ITEMS_PER_PAGE },
      });
      setApplications(Array.isArray(data.results) ? data.results : []);
      setTotalCount(typeof data.count === "number" ? data.count : 0);
    } catch {
      setApplications([]);
      setTotalCount(0);
    }
  };

  // 3. On mount and page change
  useEffect(() => {
    fetchApplications();
  }, [page]);

  // 4. Local filter by student name
  const filteredApps = applications.filter((app) => {
    const fio = `${app.student?.last_name ?? ""} ${app.student?.first_name ?? ""}`.toLowerCase();
    return fio.includes(search.toLowerCase());
  });

  // 5. Compute pages
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 6. Handlers for approve/reject
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




  const handleApprove = async (id) => {
    const url = `/applications/${id}/approve/`;
    try {
      const resp = await api.put(url, {});
      handleApproveSuccess(id);
      // при желании можно снова fetchApplications(), чтобы подтянуть всё
      // await fetchApplications();
    } catch (err) {
      alert("Не удалось одобрить заявку");
    }
  };
  
  const handleReject = async (id) => {
    const url = `/applications/${id}/reject/`;
    console.log("[Reject] sending PUT to", url);
    try {
      const resp = await api.put(url, {});
      console.log("[Reject] response", resp.status, resp.data);
      handleRejectSuccess(id);
      // await fetchApplications();
    } catch (err) {
      console.error("[Reject] error", err.response?.status, err.response?.data || err.message);
      alert("Не удалось отклонить заявку");
    }
  };

  // 7. Automatic selection
  const handleAutomaticSelection = async () => {
    try {
      const { data } = await api.post("/generate-selection/");
      setNotifyMessage(data.detail);
    } catch {
      setNotifyMessage(cfg.notificationModal.errorAutomatic ?? cfg.notificationModal.title);
    } finally {
      setNotifyModalOpen(true);
      fetchApplications();
    }
  };

  // 8. Notify students
  const handleNotifyStudents = async () => {
    setNotifyLoading(true);
    try {
      const { data } = await api.post("/notify-approved/");
      setNotifyMessage(data.detail);
    } catch {
      setNotifyMessage(cfg.notificationModal.errorNotify ?? cfg.notificationModal.title);
    } finally {
      setNotifyLoading(false);
      setNotifyModalOpen(true);
      fetchApplications();
    }
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        {/* Header & Tabs */}
        <div className="header-row">
          <h1 className="page-title">{cfg.title}</h1>
          <div className="actions-list-distribute">
            <button
              className="actions-list-distribute-btn"
              onClick={() => navigate("/admin/applications")}
            >
              {cfg.tabs.all}
            </button>
            <button
              className="actions-list-distribute-btn selected"
              onClick={() => navigate("/admin/applications/distribute")}
            >
              {cfg.tabs.distribute}
            </button>
            <button className="actions-list-distribute-btn">
              {cfg.tabs.export}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="search-row">
          <input
            className="search-input"
            placeholder={cfg.searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <img src={searchIcon} alt="search" className="search-icon" />
        </div>

        {/* Table */}
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                {Object.values(cfg.table.headers).map((hdr) => (
                  <th key={hdr}>{hdr}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-row">
                    {cfg.table.empty}
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
                    <td>{app.status ?? "-"}</td>
                    <td>
                      {app.payment_file ? (
                        <a
                          href={app.payment_file}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {cfg.detailsModal.fields.payment}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {/* Approve */}
                      <button
                        className="operation-icon"
                        onClick={() => {
                          setModalType("approve");
                          setModalApp(app);
                          setModal("confirm");
                        }}
                        title={cfg.confirmModal.approve.title}
                      >
                        <img
                          src={
                            app.status === "approved"
                              ? approveRed
                              : approveGray
                          }
                          alt={cfg.confirmModal.approve.title}
                        />
                      </button>
                      {/* Reject */}
                      <button
                        className="operation-icon"
                        onClick={() => {
                          setModalType("reject");
                          setModalApp(app);
                          setModal("confirm");
                        }}
                        title={cfg.confirmModal.reject.title}
                      >
                        <img
                          src={
                            app.status === "rejected"
                              ? rejectRed
                              : rejectGray
                          }
                          alt={cfg.confirmModal.reject.title}
                        />
                      </button>
                      {/* Details */}
                      <button
                        className="operation-icon"
                        onClick={() => {
                          setModalType("details");
                          setModalApp(app);
                          setModal("details");
                        }}
                        title={cfg.detailsModal.title.replace("{id}", app.id)}
                      >
                        <img src={eyeRed} alt={cfg.detailsModal.title} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              {cfg.pagination.prev}
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn${
                  page === i + 1 ? " active" : ""
                }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              {cfg.pagination.next}
            </button>
          </div>
        )}

        {/* Bottom Buttons */}
        <div className="bottom-actions-row">
          <button
            className="actions-list-distribute-btn"
            onClick={handleAutomaticSelection}
          >
            {cfg.bottomButtons.autoSelect}
          </button>
          <button
            className="actions-list-distribute-btn"
            onClick={handleNotifyStudents}
            disabled={notifyLoading}
          >
            {notifyLoading
              ? cfg.bottomButtons.notifying
              : cfg.bottomButtons.notify}
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {modal === "confirm" && modalApp && (
  <ModalConfirm
    type={modalType}
    onConfirmSuccess={() =>
      modalType === "approve"
        ? handleApprove(modalApp.id)
        : handleReject(modalApp.id)
    }
    onCancel={() => setModal(null)}
  />
)}


      {/* Details Modal */}
      {modal === "details" && modalApp && (
        <ModalDetails application={modalApp} onClose={() => setModal(null)} />
      )}

      {/* Notification Modal */}
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

// Confirm Modal
const ModalConfirm = ({ type, onConfirmSuccess, onCancel }) => {
  const { t } = useI18n();
  const cfg = t("adminApplicationsDistributePage.confirmModal")[type];



  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{cfg.title}</h2>
        <p>{cfg.question}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-btn modal-btn">
            {t("adminApplicationsDistributePage.confirmModal.buttons.cancel")}
          </button>
          <button onClick={onConfirmSuccess} className="save-btn modal-btn">
            {t("adminApplicationsDistributePage.confirmModal.buttons.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

// Details Modal
const ModalDetails = ({ application, onClose }) => {
  const { t } = useI18n();
  const cfg = t("adminApplicationsDistributePage.detailsModal");

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>✕</button>
        <h2>
          {cfg.title.replace("{id}", application.id)}
        </h2>
        <div>
          <label>
            <strong>{cfg.fields.student}</strong>
            <input
              disabled
              value={
                application.student
                  ? `${application.student.last_name} ${application.student.first_name}`
                  : "-"
              }
            />
          </label>
          {/* ... other fields similarly ... */}
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>{cfg.buttons.close}</button>
        </div>
      </div>
    </div>
  );
};

// Notification Modal
const NotificationModal = ({ message, onClose }) => {
  const { t } = useI18n();
  const cfg = t("adminApplicationsDistributePage.notificationModal");

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{cfg.title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>{cfg.buttons.close}</button>
      </div>
    </div>
  );
};
