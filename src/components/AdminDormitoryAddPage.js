import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/AdminActions.css';
import AdminSidebar from "./AdminSidebar";

const AdminDormitoryAddPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        total_places: "",
        rooms_for_two: "",
        rooms_for_three: "",
        rooms_for_four: "",
        cost: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/dorms/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                navigate("/admin/dormitories");
            } else {
                console.error("Ошибка при добавлении общежития");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <div className="admin-page-container">
            <AdminSidebar />
            <div className="content-area">
                <h2>Добавить общежитие</h2>
                <form onSubmit={handleSubmit} className="form-container">
                    <label>
                        Название:
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </label>
                    <label>
                        Количество мест:
                        <input type="number" name="total_places" value={formData.total_places} onChange={handleChange} required />
                    </label>
                    <label>
                        Комнаты на 2:
                        <input type="number" name="rooms_for_two" value={formData.rooms_for_two} onChange={handleChange} required />
                    </label>
                    <label>
                        Комнаты на 3:
                        <input type="number" name="rooms_for_three" value={formData.rooms_for_three} onChange={handleChange} required />
                    </label>
                    <label>
                        Комнаты на 4:
                        <input type="number" name="rooms_for_four" value={formData.rooms_for_four} onChange={handleChange} required />
                    </label>
                    <label>
                        Стоимость:
                        <input type="number" name="cost" value={formData.cost} onChange={handleChange} required />
                    </label>
                    <div className="form-actions">
                        <button type="submit" className="save-button">Добавить</button>
                        <button type="button" className="cancel-button" onClick={() => navigate("/admin/dormitories")}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDormitoryAddPage;
