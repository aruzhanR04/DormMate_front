// src/pages/admin/AdminApplicationsDistributePage.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // Убедитесь, что путь верно указывает на ваш Axios-инстанс
import AdminSidebar from "./AdminSidebar";
import searchIcon from "../../assets/icons/Search.svg";
import filterIcon from "../../assets/icons/filter.svg";
import refreshIcon from "../../assets/icons/refresh.svg";
import xmark from "../../assets/icons/xmark.png";
import "../../styles/AdminApplicationsDistribute.css";

const ITEMS_PER_PAGE = 8;

export default function AdminApplicationsDistributePage() {
  const navigate = useNavigate();

  // ——— Заявки (левая колонка) ———
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Фильтры (левый верхний блок)
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef();

  // Фильтрация по полу
  const [arrowGender, setArrowGender] = useState(false);
  const [maleOnly, setMaleOnly] = useState(false);
  const [femaleOnly, setFemaleOnly] = useState(false);

  // Фильтрация по статусу заселения
  const [arrowRoomStatus, setArrowRoomStatus] = useState(false);
  const [assignedOnly, setAssignedOnly] = useState(false);
  const [unassignedOnly, setUnassignedOnly] = useState(false);

  // ——— Общежития и этажи (правая колонка) ———
  const [dorms, setDorms] = useState([]);
  const [selectedDorm, setSelectedDorm] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [rooms, setRooms] = useState([]); // список комнат
  const [roomOccupants, setRoomOccupants] = useState({}); // { roomId: [{ id, fio }, ...] }

  // ───────────── Загрузка списка общежитий ─────────────
  useEffect(() => {
    api
      .get("/dorms/")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.results)
          ? res.data.results
          : [];
        setDorms(data);
        if (data.length > 0) {
          setSelectedDorm(data[0]);
        }
      })
      .catch((err) => {
        console.error("Не удалось загрузить общежития:", err);
      });
  }, []);

  // ───────────── При смене selectedDorm: получить этажи ─────────────
  useEffect(() => {
    if (!selectedDorm) {
      setFloors([]);
      setSelectedFloor(null);
      return;
    }

    api
      .get(`/dorms/${selectedDorm.id}/floors_count/`)
      .then((res) => {
        const count =
          typeof res.data.floors_count === "number"
            ? res.data.floors_count
            : 0;
        const arr = Array.from({ length: count }, (_, i) => i + 1);
        setFloors(arr);
        setSelectedFloor(arr.length > 0 ? arr[0] : null);
      })
      .catch((err) => {
        console.error(
          `Не удалось получить этажи для dorm ${selectedDorm.id}:`,
          err
        );
        setFloors([]);
        setSelectedFloor(null);
      });
  }, [selectedDorm]);

  // ───────────── При смене selectedDorm или selectedFloor: получить комнаты ─────────────
  const fetchRooms = () => {
    if (!selectedDorm || selectedFloor === null) {
      setRooms([]);
      return;
    }

    api
      .get(`/rooms/?dorm=${selectedDorm.id}&floor=${selectedFloor}`)
      .then((res) => {
        const roomsData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.results)
          ? res.data.results
          : [];
        setRooms(roomsData);
      })
      .catch((err) => {
        console.error(
          `Не удалось загрузить комнаты для dorm ${selectedDorm.id} и floor ${selectedFloor}:`,
          err
        );
        setRooms([]);
      });
  };
  useEffect(fetchRooms, [selectedDorm, selectedFloor]);

  // ───────────── Загрузка списка заявок ─────────────
  const fetchApplications = () => {
    api
      .get("/student-in-dorm/")
      .then((res) => {
        const apps = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.results)
          ? res.data.results
          : Object.values(res.data);
        setApplications(apps);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке списка заявок:", err);
        setApplications([]);
      });
  };
  useEffect(fetchApplications, []);

  // ───────────── Обновляем roomOccupants, когда меняются rooms или applications ─────────────
  useEffect(() => {
    const map = {};
    rooms.forEach((r) => {
      map[r.id] = [];
    });
    applications.forEach((app) => {
      if (app.room && app.room.id in map) {
        const fio = `${app.student.last_name} ${app.student.first_name} ${
          app.student.middle_name || ""
        }`.trim();
        map[app.room.id].push({ id: app.id, fio });
      }
    });
    setRoomOccupants(map);
  }, [rooms, applications]);

  // ───────────── Сбросить фильтры ─────────────
  const resetFilters = () => {
    setArrowGender(false);
    setMaleOnly(false);
    setFemaleOnly(false);
    setArrowRoomStatus(false);
    setAssignedOnly(false);
    setUnassignedOnly(false);
  };

  // ───────────── Drag & Drop ─────────────

  // 1) Начало перетаскивания карточки студента
  const handleDragStart = (event, studentInDormId) => {
    event.dataTransfer.setData("studentInDormId", studentInDormId);
  };


  const handleSendOrders = async () => {
    try {
      const response = await api.post('/issue-order/');
      setMessage({ type: 'success', text: response.data.detail });
      fetchApplications();
    } catch (error) {
      console.error('Ошибка отправки ордеров:', error);
      setMessage({ type: 'error', text: 'Ошибка отправки ордеров.' });
    }
  };

  // 2) Разрешаем сброс на комнату
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // 3) Отпустили карточку над комнатой → PATCH
  const handleDrop = (event, roomId) => {
    event.preventDefault();
    const studentInDormId = event.dataTransfer.getData("studentInDormId");
    if (!studentInDormId) return;

    api
      .patch(`/student-in-dorm/${studentInDormId}/`, { room_id: roomId })
      .then(() => {
        setTimeout(() => {
          fetchRooms();
          fetchApplications();
        }, 200);
      })
      .catch((err) => {
        console.error("PATCH ERROR:", err.response?.data || err);
      });
  };

  // 4) Отвязывание студента от комнаты
  const handleUnassign = (studentInDormId) => {
    api
      .patch(`/student-in-dorm/${studentInDormId}/`, { room_id: null })
      .then(() => {
        setTimeout(() => {
          fetchRooms();
          fetchApplications();
        }, 200);
      })
      .catch((err) => {
        console.error("UNASSIGN ERROR:", err.response?.data || err);
      });
  };

  // ───────────── Автоматическое распределение по группам ─────────────
  const handleGroupDistribution = async () => {
    try {
      const response = await api.post("/distribute-students2/");
      // Предполагаем, что возвращается { detail: "..." }
      alert(response.data.detail || "Автоматическое распределение выполнено");
      fetchApplications();
    } catch (error) {
      console.error("Ошибка распределения по группам:", error);
      alert("Ошибка распределения по группам");
    }
  };

  // ───────────── Выбор общежития ─────────────
  const handleSelectDorm = (dorm) => {
    setSelectedDorm(dorm);
    setIsOpen(false);
  };

  // ───────────── Фильтрация заявок для пагинации ─────────────
  let filteredApps = (applications || []).filter((app) => {
    const fio = `${app.student?.last_name ?? ""} ${app.student?.first_name ?? ""} ${
      app.student?.middle_name ?? ""
    }`;
    return fio.toLowerCase().includes(search.toLowerCase());
  });

  if (maleOnly || femaleOnly) {
    filteredApps = filteredApps.filter((app) => {
      const gender = app.student?.gender; // "M" или "F"
      if (maleOnly && gender === "M") return true;
      if (femaleOnly && gender === "F") return true;
      return false;
    });
  }
  if (assignedOnly || unassignedOnly) {
    filteredApps = filteredApps.filter((app) => {
      const hasRoom = Boolean(app.room);
      if (assignedOnly && hasRoom) return true;
      if (unassignedOnly && !hasRoom) return true;
      return false;
    });
  }

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const paginatedApps = filteredApps.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        {/* ====== Заголовок и кнопки ====== */}
        <div className="header-row">
          <h1>Заявки</h1>
          <div className="actions-list-distribute">
            <button
              className="actions-list-distribute-btn active"
              onClick={() => navigate("/admin/applications")}
            >
              Все заявки
            </button>
            <button
              className="actions-list-distribute-btn selected"
              onClick={() => navigate("/admin/applications/distribute")}
            >
              Распределить студентов
            </button>
          </div>
        </div>

        <div className="admin-applications-page-flex">
          {/* ====== ЛЕВАЯ КОЛОНКА: Одобренные заявки ====== */}
          <div className="approved-requests-block">
            <div className="approved-requests-title-row">
              Одобренные заявки
              <img
                src={refreshIcon}
                alt="refresh"
                className="rooms-block-refresh"
                onClick={fetchApplications}
              />
            </div>

            <div className="approved-requests-search-row">
              <div className="search-filter-row">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Поиск..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
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
                    {/* ===== ФИЛЬТР ПО ПОЛУ ===== */}
                    <div className="filter-section">
                      <div className="filter-checkbox-row">
                        <label style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <input
                            type="checkbox"
                            checked={arrowGender}
                            onChange={() => setArrowGender((a) => !a)}
                          />
                          <span style={{ marginLeft: "5px" }}>По полу</span>
                          <span className="filter-arrow" style={{ marginLeft: "auto" }}>
                            {arrowGender ? "▲" : "▼"}
                          </span>
                        </label>
                      </div>
                      {arrowGender && (
                        <div className="filter-suboptions" style={{ paddingLeft: "20px" }}>
                          <div className="filter-checkbox-row">
                            <input
                              type="checkbox"
                              id="maleOnly"
                              checked={maleOnly}
                              onChange={() => setMaleOnly((v) => !v)}
                            />
                            <label htmlFor="maleOnly" style={{ cursor: "pointer", marginLeft: "5px" }}>
                              Мужчины
                            </label>
                          </div>
                          <div className="filter-checkbox-row">
                            <input
                              type="checkbox"
                              id="femaleOnly"
                              checked={femaleOnly}
                              onChange={() => setFemaleOnly((v) => !v)}
                            />
                            <label htmlFor="femaleOnly" style={{ cursor: "pointer", marginLeft: "5px" }}>
                              Женщины
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ===== ФИЛЬТР ПО СТАТУСУ ЗАСЕЛЕНИЯ ===== */}
                    <div className="filter-section" style={{ marginTop: "10px" }}>
                      <div className="filter-checkbox-row">
                        <label style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <input
                            type="checkbox"
                            checked={arrowRoomStatus}
                            onChange={() => setArrowRoomStatus((a) => !a)}
                          />
                          <span style={{ marginLeft: "5px" }}>Статус заселения</span>
                          <span className="filter-arrow" style={{ marginLeft: "auto" }}>
                            {arrowRoomStatus ? "▲" : "▼"}
                          </span>
                        </label>
                      </div>
                      {arrowRoomStatus && (
                        <div className="filter-suboptions" style={{ paddingLeft: "20px" }}>
                          <div className="filter-checkbox-row">
                            <input
                              type="checkbox"
                              id="assignedOnly"
                              checked={assignedOnly}
                              onChange={() => setAssignedOnly((v) => !v)}
                            />
                            <label htmlFor="assignedOnly" style={{ cursor: "pointer", marginLeft: "5px" }}>
                              Назначена комната
                            </label>
                          </div>
                          <div className="filter-checkbox-row">
                            <input
                              type="checkbox"
                              id="unassignedOnly"
                              checked={unassignedOnly}
                              onChange={() => setUnassignedOnly((v) => !v)}
                            />
                            <label htmlFor="unassignedOnly" style={{ cursor: "pointer", marginLeft: "5px" }}>
                              Без комнаты
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ===== КНОПКА СБРОСИТЬ ФИЛЬТРЫ ===== */}
                    <div className="filter-reset-row" style={{ marginTop: "15px", textAlign: "center" }}>
                      <button type="button" className="filter-reset-btn" onClick={resetFilters}>
                        Сбросить фильтры
                      </button>
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
                  key={app.id}
                  className={
                    "approved-requests-item" +
                    (app.status === "approved" ? " approved" : "") +
                    (app.room ? " has-room" : " no-room")
                  }
                  draggable
                  onDragStart={(e) => handleDragStart(e, app.id)}
                >
                  <div className="fio">
                    {app.student?.last_name} {app.student?.first_name}{" "}
                    {app.student?.middle_name}
                  </div>
                  <div className="extra">
                    S{app.student?.s} <br />
                    Тест: {app.application.test_result ?? "-"} <br />
                    Пол: {app.student?.gender === "M" ? "Муж." : "Жен."} <br />
                    {app.room ? (
                      <>{`Заселен в: ${
                        app.room.dorm?.name
                          ? `${app.room.dorm.name}, комн. ${app.room.number}`
                          : `комн. ${app.room.number}`
                      }`}</>
                    ) : (
                      "Не заселен"
                    )}
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

          {/* ====== ПРАВАЯ КОЛОНКА: Общежитие → Этажи → Комнаты ====== */}
          <div className="rooms-block">
            <div className="rooms-block-title-row">
              {/* Дропдаун выбора общежития */}
              <div className="rooms-block" ref={dropdownRef}>
                <div
                  className="rooms-block-title"
                  onClick={() => setIsOpen((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                >
                  {selectedDorm ? selectedDorm.name : "Загрузка..."}{" "}
                  <span className="chevron">{isOpen ? "▲" : "▼"}</span>
                </div>

                {isOpen && (
                  <div className="rooms-dropdown">
                    {Array.isArray(dorms) && dorms.length > 0 ? (
                      dorms.map((dorm) => (
                        <div
                          key={dorm.id}
                          className="room-item"
                          onClick={() => handleSelectDorm(dorm)}
                        >
                          {dorm.name}
                        </div>
                      ))
                    ) : (
                      <div className="room-item">Общежитий не найдено</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Кнопки этажей */}
            <div className="floors-row">
              {floors.length === 0 && <div className="no-floors">Этажи не найдены</div>}
              {floors.map((floor) => (
                <button
                  key={floor}
                  className={`floor-btn${selectedFloor === floor ? " selected" : ""}`}
                  onClick={() => setSelectedFloor(floor)}
                >
                  {floor} этаж
                </button>
              ))}
            </div>

            {/* Карточки комнат (Drop target) */}
            <div className="rooms-row">
              {rooms.length === 0 && <div className="no-rooms">Комнаты не найдены</div>}
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="room-card"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, room.id)}
                >
                  <div className="room-header">{room.number}</div>
                  <div className="room-capacity">{room.capacity}-местная</div>
                  <div className="room-free">
                    {room.free_spots} свободн
                    {room.free_spots === 1 ? "о" : "ых"} мест
                  </div>
                  <div className="student-list">
                    {Array.isArray(roomOccupants[room.id]) &&
                    roomOccupants[room.id].length > 0 ? (
                      roomOccupants[room.id].map((stu) => (
                        <div className="student-item" key={stu.id}>
                          <span>{stu.fio}</span>
                          <img
                            src={xmark}
                            alt="Удалить"
                            className="xmark-icon"
                            width="20px"
                            onClick={() => handleUnassign(stu.id)}
                          />
                        </div>
                      ))
                    ) : (
                      <div>— Нет заселённых студентов</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Нижние кнопки */}
        <div className="bottom-actions-row">
          <button className="orders-btn" onClick={() => handleSendOrders()}>Разослать ордера</button>
          <button className="actions-list-distribute-btn selected" onClick={() => handleGroupDistribution()}>
            Автоматически распределить по группам
          </button>
        </div>
      </div>
    </div>
  );
}
