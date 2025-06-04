// AdminApplicationsDistributePage.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // Ваш axios-инстанс
import AdminSidebar from "./AdminSidebar";
import searchIcon from "../../assets/icons/Search.svg";
import filterIcon from "../../assets/icons/filter.svg";
import refreshIcon from "../../assets/icons/refresh.svg";
import xmark from "../../assets/icons/xmark.png";
import "../../styles/AdminApplicationsDistribute.css";

const ITEMS_PER_PAGE = 8;

const AdminApplicationsDistributePage = () => {
  const navigate = useNavigate();

  // ——— Заявки (левая колонка) ———
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [page, setPage] = useState(1);

  // Фильтры (левый верхний блок)
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef();
  const [byTest, setByTest] = useState(false);
  const [byDate, setByDate] = useState(false);
  const [byGender, setByGender] = useState(false);
  const [arrowTest, setArrowTest] = useState(true);
  const [arrowDate, setArrowDate] = useState(true);
  const [arrowGender, setArrowGender] = useState(false);

  // ——— Общежития и этажи (правая колонка) ———
  const [dorms, setDorms] = useState([]);
  const [selectedDorm, setSelectedDorm] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]); // список комнат с сервера

  // ───────────── Загрузка списка общежитий ─────────────
  useEffect(() => {
    api
      .get("/dorms/")
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.results)
          ? response.data.results
          : [];
        setDorms(data);
        if (data.length > 0) {
          setSelectedDorm(data[0]);
        }
      })
      .catch((error) => {
        console.error("Не удалось загрузить общежития:", error);
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
      .then((response) => {
        const count =
          typeof response.data.floors_count === "number"
            ? response.data.floors_count
            : 0;
        const arr = Array.from({ length: count }, (_, i) => i + 1);
        setFloors(arr);
        setSelectedFloor(arr.length > 0 ? arr[0] : null);
      })
      .catch((error) => {
        console.error(
          `Не удалось получить этажи для dorm ${selectedDorm.id}:`,
          error
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
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.results)
          ? response.data.results
          : [];
        setRooms(data);
      })
      .catch((error) => {
        console.error(
          `Не удалось загрузить комнаты для dorm ${selectedDorm.id} и floor ${selectedFloor}:`,
          error
        );
        setRooms([]);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, [selectedDorm, selectedFloor]);

  // ───────────── Закрытие дропдауна общежитий при клике вне ─────────────
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // ───────────── Закрытие фильтров при клике вне ─────────────
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ───────────── Загрузка списка заявок ─────────────
  const fetchApplications = async () => {
    try {
      const response = await api.get("/student-in-dorm/");
      const apps = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.results)
        ? response.data.results
        : Object.values(response.data);
      setApplications(apps);
    } catch (error) {
      console.error("Ошибка при загрузке заявок:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ───────────── Фильтрация заявок по поиску ─────────────
  const filteredApps = applications.filter((app) => {
    const fio = `${app.student?.last_name ?? ""} ${
      app.student?.first_name ?? ""
    } ${app.student?.middle_name ?? ""}`;
    return fio.toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const paginatedApps = filteredApps.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // ───────────── Обработчик выбора общежития ─────────────
  const handleSelectDorm = (dorm) => {
    setSelectedDorm(dorm);
    setIsOpen(false);
  };

  // ───────────── Обработчики Drag & Drop ─────────────

  // Когда начинаем перетаскивать карточку студента
  const handleDragStart = (event, studentInDormId) => {
    event.dataTransfer.setData("studentInDormId", studentInDormId);
  };

  // Для комнат: разрешаем сброс
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Когда отпустили карточку над комнатой
  const handleDrop = (event, roomId) => {
    event.preventDefault();
    const studentInDormId = event.dataTransfer.getData("studentInDormId");
    if (!studentInDormId) return;

    api
      .patch(`/student-in-dorm/${studentInDormId}/`, {
        room: roomId,
      })
      .then(() => {
        fetchRooms();
        fetchApplications();
      })
      .catch((error) => {
        console.error(
          `Не удалось назначить студента ${studentInDormId} в комнату ${roomId}:`,
          error
        );
      });
  };

  // ───────────── Отвязывание студента от комнаты ─────────────
  const handleUnassign = (studentInDormId) => {
    api
      .patch(`/student-in-dorm/${studentInDormId}/`, {
        room: null,
      })
      .then(() => {
        fetchRooms();
        fetchApplications();
      })
      .catch((error) => {
        console.error(
          `Не удалось отвязать студента ${studentInDormId} от комнаты:`,
          error
        );
      });
  };

  return (
    <div className="admin-page-container">
      <AdminSidebar />
      <div className="content-area">
        {/* Заголовок и кнопки */}
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
          {/* ===================== ЛЕВАЯ КОЛОНКА: Одобренные заявки ===================== */}
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
                      <label htmlFor="byTest" style={{ cursor: "pointer" }}>
                        По тесту
                      </label>
                      <span
                        className="filter-arrow"
                        onClick={() => setArrowTest((a) => !a)}
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
                      <label htmlFor="byDate" style={{ cursor: "pointer" }}>
                        По дате
                      </label>
                      <span
                        className="filter-arrow"
                        onClick={() => setArrowDate((a) => !a)}
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
                      <label htmlFor="byGender" style={{ cursor: "pointer" }}>
                        По полу
                      </label>
                      <span
                        className="filter-arrow"
                        onClick={() => setArrowGender((a) => !a)}
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
                  key={app.id}
                  className={
                    "approved-requests-item" +
                    (app.status === "approved" ? " approved" : "") +
                    (app.room ? " has-room" : " no-room")
                  }
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, app.id)}
                >
                  <div className="fio">
                    {app.student?.last_name}{" "}
                    {app.student?.first_name}{" "}
                    {app.student?.middle_name}
                  </div>
                  <div className="extra">
                    S{app.student?.s} <br />
                    Тест: {app.test_result ?? "-"} <br />
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
                    className={`pagination-btn${
                      page === idx + 1 ? " active" : ""
                    }`}
                    onClick={() => setPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===================== ПРАВАЯ КОЛОНКА: Выбор общежития → Этажи → Комнаты ===================== */}
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

              {/* Кнопка «обновить общежития» */}
              <img
                src={refreshIcon}
                alt="refresh"
                className="rooms-block-refresh"
                onClick={() => {
                  api
                    .get("/dorms/")
                    .then((response) => {
                      const data = Array.isArray(response.data)
                        ? response.data
                        : Array.isArray(response.data.results)
                        ? response.data.results
                        : [];
                      setDorms(data);
                      if (data.length > 0) {
                        setSelectedDorm(data[0]);
                      }
                    })
                    .catch((error) => {
                      console.error(
                        "Не удалось загрузить общежития:",
                        error
                      );
                    });
                }}
              />
            </div>

            {/* Рендерим кнопки этажей */}
            <div className="floors-row">
              {floors.length === 0 && (
                <div className="no-floors">Этажи не найдены</div>
              )}
              {floors.map((floor) => (
                <button
                  key={floor}
                  className={`floor-btn${
                    selectedFloor === floor ? " selected" : ""
                  }`}
                  onClick={() => setSelectedFloor(floor)}
                >
                  {floor} этаж
                </button>
              ))}
            </div>

            {/* Рендерим реальные комнаты с сервера и навешиваем Drop */}
            <div className="rooms-row">
              {rooms.length === 0 && (
                <div className="no-rooms">Комнаты не найдены</div>
              )}
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="room-card"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, room.id)}
                >
                  <div className="room-header">{room.number}</div>
                  <div className="room-capacity">
                    {room.capacity}-местная
                  </div>
                  <div className="room-free">
                    {room.free_spots} свободн
                    {room.free_spots === 1 ? "о" : "ых"} мест
                  </div>
                  <div className="student-list">
                    {Array.isArray(room.assigned_students) &&
                      room.assigned_students.map((stu) => (
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
                      ))}
                    {room.assigned_students.length === 0 && (
                      <div>— Нет заселённых студентов</div>
                    )}
                  </div>
                  {/* <button
                    className="settle-btn"
                    disabled={room.free_spots === 0}
                  >
                    Заселить
                  </button> */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Нижние кнопки */}
        <div className="bottom-actions-row">
          <button className="orders-btn">Разослать ордера</button>
          <button className="actions-list-distribute-btn selected">
            Автоматически распределить по комнатам
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationsDistributePage;
