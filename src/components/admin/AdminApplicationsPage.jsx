import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import AdminSidebar from "./AdminSidebar";
import searchIcon from "../../assets/icons/Search.svg";
import filterIcon from "../../assets/icons/filter.svg";
import refreshIcon from "../../assets/icons/refresh.svg";
import "../../styles/AdminApplicationsDistribute.css";

const FLOORS = [1, 2, 3, 4, 5];
const ITEMS_PER_PAGE = 8;

const AdminApplicationsDistributePage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [page, setPage] = useState(1);

  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef();

  const [byTest, setByTest] = useState(false);
  const [byDate, setByDate] = useState(false);
  const [byGender, setByGender] = useState(false);
  const [arrowTest, setArrowTest] = useState(true);
  const [arrowDate, setArrowDate] = useState(true);
  const [arrowGender, setArrowGender] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mockRooms = [
    { number: "201", free: 1, capacity: 2, students: ["Юсупова Д. Н.", "Касенова Э. А."], disabled: false },
    { number: "202", free: 3, capacity: 4, students: ["Вуйко Я. В."], disabled: false },
    { number: "203", free: 0, capacity: 4, students: ["Фамилия И.", "Фамилия И.", "Фамилия И.", "Фамилия И."], disabled: true },
    { number: "204", free: 3, capacity: 4, students: ["Рыбек А. С."], disabled: false },
    { number: "205", free: 3, capacity: 4, students: ["Жаксыбай С. Б."], disabled: false },
  ];

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await api.get(
        "/applications/?status=approved",
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      let data = res.data;
      if (Array.isArray(data)) setApplications(data);
      else if (Array.isArray(data.results)) setApplications(data.results);
      else setApplications([]);
    } catch {
      setApplications([]);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApps = applications.filter((app) => {
    const fio = `${app.student?.last_name ?? ""} ${app.student?.first_name ?? ""} ${app.student?.middle_name ?? ""}`;
    const searchMatch = fio.toLowerCase().includes(search.toLowerCase());
    return searchMatch;
  });


  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const paginatedApps = filteredApps.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        <div className="header-row">
          <h1>Заявки</h1>
          <div className="actions-list-distribute">
            <button className="actions-list-distribute-btn active">
              Все заявки
            </button>
            <button
              className="actions-list-distribute-btn selected"
              onClick={() => navigate("/admin/applications/distribute")}
            >
              Распределить студентов
            </button>
            <button className="actions-list-distribute-btn save">
              Сохранить
            </button>
          </div>
        </div>
        <div className="admin-applications-page-flex">
          <div className="approved-requests-block">
            <div className="approved-requests-title-row">
              Одобренные заявки
              <img src={refreshIcon} alt="refresh" className="rooms-block-refresh" onClick={fetchApplications} />
            </div>
            <div className="approved-requests-search-row">
              <div className="search-filter-row">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Поиск..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <img src={searchIcon} alt="search" className="search-icon" />
                <button
                  type="button"
                  className="filter-icon-btn"
                  onClick={() => setFilterOpen((prev) => !prev)}
                  aria-label="Фильтр"
                >
                  <img src={filterIcon} alt="filter" />
                </button>
                {filterOpen && (
                  <div className="filter-dropdown" ref={filterRef}>
                    <div className="filter-checkbox-row">
                      <input
                        type="checkbox"
                        checked={byTest}
                        onChange={() => setByTest((v) => !v)}
                        id="byTest"
                      />
                      <label htmlFor="byTest" style={{ cursor: 'pointer' }}>По тесту</label>
                      <span
                        className="filter-arrow"
                        onClick={() => setArrowTest(a => !a)}
                        style={{ marginLeft: "auto" }}
                      >
                        {arrowTest ? "▲" : "▼"}
                      </span>
                    </div>
                    <div className="filter-checkbox-row">
                      <input
                        type="checkbox"
                        checked={byDate}
                        onChange={() => setByDate((v) => !v)}
                        id="byDate"
                      />
                      <label htmlFor="byDate" style={{ cursor: 'pointer' }}>По дате</label>
                      <span
                        className="filter-arrow"
                        onClick={() => setArrowDate(a => !a)}
                        style={{ marginLeft: "auto" }}
                      >
                        {arrowDate ? "▲" : "▼"}
                      </span>
                    </div>
                    <div className="filter-checkbox-row">
                      <input
                        type="checkbox"
                        checked={byGender}
                        onChange={() => setByGender((v) => !v)}
                        id="byGender"
                      />
                      <label htmlFor="byGender" style={{ cursor: 'pointer' }}>По полу</label>
                      <span
                        className="filter-arrow"
                        onClick={() => setArrowGender(a => !a)}
                        style={{ marginLeft: "auto" }}
                      >
                        {arrowGender ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="approved-requests-list">
              {paginatedApps.length === 0 && (
                <div className="approved-requests-item">Нет заявок</div>
              )}
              {paginatedApps.map((app) => (
                <div
                  className={
                    "approved-requests-item" +
                    (app.status === "approved" ? " approved" : "")
                  }
                  key={app.id}
                >
                  <div className="fio">
                    {app.student?.last_name} {app.student?.first_name} {app.student?.middle_name}
                  </div>
                  <div className="extra">
                    S{app.student?.s} <br />
                    Тест: {app.test_result ?? "-"}<br />
                    Пол: {app.student?.gender === "M" ? "Муж." : "Жен."}
                  </div>
                </div>
              ))}
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
          </div>

          <div className="rooms-block">
            <div className="rooms-block-title-row">
              <div className="rooms-block-title">
                Дом студентов 3 <span className="chevron">▼</span>
              </div>
              <img src={refreshIcon} alt="refresh" className="rooms-block-refresh" />
            </div>
            <div className="floors-row">
              {FLOORS.map((floor) => (
                <button
                  key={floor}
                  className={"floor-btn" + (selectedFloor === floor ? " selected" : "")}
                  onClick={() => setSelectedFloor(floor)}
                >
                  {floor} этаж
                </button>
              ))}
            </div>
            <div className="rooms-row">
              {mockRooms.map((room) => (
                <div className="room-card" key={room.number}>
                  <div className="room-header">{room.number}</div>
                  <div className="room-capacity">{room.capacity}-местная</div>
                  <div className="room-free">{room.free} мест{room.free === 1 ? "о" : "а"} свободно</div>
                  <div className="student-list">
                    {room.students.map((s, idx) => (
                      <div key={idx}>• {s}</div>
                    ))}
                  </div>
                  <button className="settle-btn" disabled={room.disabled}>
                    Заселить
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-actions-row">
          <button className="orders-btn">
            Разослать ордера
          </button>
          <button className="actions-list-distribute-btn selected">
            Автоматически распределить по комнатам
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationsDistributePage;
