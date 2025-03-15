import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import AdminSidebar from './AdminSidebar';
import '../styles/AdminActions.css';

const AdminDormitoryEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dormData, setDormData] = useState({
        name: '',
        total_places: '',
        rooms_for_two: '',
        rooms_for_three: '',
        rooms_for_four: '',
        cost: ''
    });

    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDormData = async () => {
            try {
                const response = await api.get(`/dorms/${id}/`);
                setDormData(response.data);
            } catch (err) {
                setError('Ошибка при загрузке данных общежития.');
                console.error(err);
            }
        };

        fetchDormData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDormData({ ...dormData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/dormitories/${id}`, dormData);
            navigate('/admin/dormitories');
        } catch (err) {
            setError('Ошибка при сохранении данных общежития.');
            console.error(err);
        }
    };

    return (
        <div className="admin-page-container">
            <AdminSidebar />
            <div className="content-area">
                <h1>Изменение данных общежития</h1>
                {error && <p className="error-message">{error}</p>}
                <form className="dormitory-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Название</label>
                        <input
                            type="text"
                            name="name"
                            value={dormData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Количество мест</label>
                        <input
                            type="number"
                            name="total_places"
                            value={dormData.total_places}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Комнаты на 2</label>
                        <input
                            type="number"
                            name="rooms_for_two"
                            value={dormData.rooms_for_two}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Комнаты на 3</label>
                        <input
                            type="number"
                            name="rooms_for_three"
                            value={dormData.rooms_for_three}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Комнаты на 4</label>
                        <input
                            type="number"
                            name="rooms_for_four"
                            value={dormData.rooms_for_four}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Стоимость</label>
                        <input
                            type="number"
                            name="cost"
                            value={dormData.cost}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-button">Сохранить</button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate('/admin/dormitories')}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDormitoryEditPage;
