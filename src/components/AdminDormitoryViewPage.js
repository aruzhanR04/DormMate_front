import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import AdminSidebar from './AdminSidebar';
import '../styles/AdminActions.css';

const AdminDormitoryViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dormData, setDormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDormData = async () => {
            try {
                const response = await api.get(`/dorms/${id}/`);
                setDormData(response.data);
            } catch (err) {
                setError('Ошибка при загрузке данных общежития.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDormData();
    }, [id]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="admin-page-container">
            <AdminSidebar />
            <div className="content-area">
                <h1>Просмотр данных общежития</h1>
                <div className="dormitory-info">
                    <p><strong>Название:</strong> {dormData.name}</p>
                    <p><strong>Количество мест:</strong> {dormData.total_places}</p>
                    <p><strong>Комнаты на 2:</strong> {dormData.rooms_for_two}</p>
                    <p><strong>Комнаты на 3:</strong> {dormData.rooms_for_three}</p>
                    <p><strong>Комнаты на 4:</strong> {dormData.rooms_for_four}</p>
                    <p><strong>Стоимость:</strong> {dormData.cost}</p>
                </div>
                <button className="cancel-button" onClick={() => navigate('/admin/dormitories')}>
                    Назад
                </button>
            </div>
        </div>
    );
};

export default AdminDormitoryViewPage;
