import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/AdminActions.css';
import AdminSidebar from "./AdminSidebar";

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/students/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                navigate("/admin/students");
            } else {
                console.error("Ошибка при добавлении студента");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <div className="admin-page-container">
            <AdminSidebar />
            <div className="content-area">
                <h2>Добавить студента</h2>
                <form onSubmit={handleSubmit} className="form-container">
                    <label>
                        ID (s):
                        <input type="text" name="s" value={formData.s} onChange={handleChange} required />
                    </label>
                    <label>
                        Имя:
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                    </label>
                    <label>
                        Фамилия:
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </label>
                    <label>
                        Отчество:
                        <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </label>
                    <label>
                        Дата рождения:
                        <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
                    </label>
                    <label>
                        Телефон:
                        <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                    </label>
                    <label>
                        Пол:
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="">Выберите...</option>
                            <option value="M">Мужской</option>
                            <option value="F">Женский</option>
                        </select>
                    </label>
                    <label>
                        Курс:
                        <input type="text" name="course" value={formData.course} onChange={handleChange} required />
                    </label>
                    <label>
                        Область:
                        <input type="text" name="region" value={formData.region} onChange={handleChange} required />
                    </label>
                    <label>
                        Пароль:
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </label>
                    <div className="form-actions">
                        <button type="submit" className="save-button">Добавить</button>
                        <button type="button" className="cancel-button" onClick={() => navigate("/admin/students")}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminStudentAddPage;
