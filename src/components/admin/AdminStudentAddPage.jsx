import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import AdminSidebar from "./AdminSidebar";
import '../../styles/AdminFormShared.css'; // подключаем общий стиль

const AdminStudentAddPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        s: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        email: "",
        birth_date: "",
        phone_number: "",
        gender: "",
        course: "",
        region: "",
        password: ""
    });

    const [regions, setRegions] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await api.get('/regions/');
                const regionList = response.data.results || response.data;
                setRegions(regionList);
            } catch (error) {
                console.error("Ошибка при загрузке регионов:", error);
            }
        };
        fetchRegions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "region" ? parseInt(value, 10) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const payload = {
            ...formData,
            s: String(formData.s)
        };

        try {
            const response = await api.post("students/", payload);
            if (response.status === 201 || response.status === 200) {
                navigate("/admin/students");
            }
        } catch (error) {
            if (error.response?.data) {
                setErrors(error.response.data);
            }
        }
    };

    return (
        <div className="admin-form-page">
            <AdminSidebar />
            <div className="admin-form-content">
                <div className="admin-form-box">
                    <h2>Добавить студента</h2>
                    <form onSubmit={handleSubmit} className="admin-form-grid">
                        <label>
                            ID (s):
                            <input type="text" name="s" value={formData.s} onChange={handleChange} required />
                            {errors.s && <p className="admin-error-text">{errors.s}</p>}
                        </label>

                        <label>
                            Имя:
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                            {errors.first_name && <p className="admin-error-text">{errors.first_name}</p>}
                        </label>

                        <label>
                            Фамилия:
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                            {errors.last_name && <p className="admin-error-text">{errors.last_name}</p>}
                        </label>

                        <label>
                            Отчество:
                            <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} />
                            {errors.middle_name && <p className="admin-error-text">{errors.middle_name}</p>}
                        </label>

                        <label>
                            Email:
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            {errors.email && <p className="admin-error-text">{errors.email}</p>}
                        </label>

                        <label>
                            Дата рождения:
                            <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
                            {errors.birth_date && <p className="admin-error-text">{errors.birth_date}</p>}
                        </label>

                        <label>
                            Телефон:
                            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                            {errors.phone_number && <p className="admin-error-text">{errors.phone_number}</p>}
                        </label>

                        <label>
                            Пол:
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="">Выберите...</option>
                                <option value="M">Мужской</option>
                                <option value="F">Женский</option>
                            </select>
                            {errors.gender && <p className="admin-error-text">{errors.gender}</p>}
                        </label>

                        <label>
                            Курс:
                            <input type="text" name="course" value={formData.course} onChange={handleChange} required />
                            {errors.course && <p className="admin-error-text">{errors.course}</p>}
                        </label>

                        <label>
                            Область:
                            <select name="region" value={formData.region} onChange={handleChange} required>
                                <option value="">Выберите регион</option>
                                {regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.region_name}
                                    </option>
                                ))}
                            </select>
                            {errors.region && <p className="admin-error-text">{errors.region}</p>}
                        </label>

                        <label>
                            Пароль:
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                            {errors.password && <p className="admin-error-text">{errors.password}</p>}
                        </label>

                        <div className="admin-form-buttons">
                            <button type="submit" className="admin-save-btn">Добавить</button>
                            <button type="button" className="admin-cancel-btn" onClick={() => navigate("/admin/students")}>
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminStudentAddPage;
