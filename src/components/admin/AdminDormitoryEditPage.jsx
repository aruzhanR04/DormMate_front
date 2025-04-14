import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminActions.css';

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
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        const fetchDormData = async () => {
            try {
                const response = await api.get(`dorms/${id}/`);
                setDormData(response.data);
                setExistingImages(response.data.images || []);
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
            await api.put(`dorms/${id}/`, dormData);
            if (newImages.length > 0) {
                for (const file of newImages) {
                    const formDataImages = new FormData();
                    formDataImages.append("dorm", id);
                    formDataImages.append("image", file);
                    await api.post("dorm-images/", formDataImages);
                }
            }
            navigate('/admin/dormitories');
        } catch (err) {
            setError('Ошибка при сохранении данных общежития.');
            console.error(err);
        }
    };


    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);
    };

    const handleRemoveNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteExistingImage = async (imageId) => {
        try {
            await api.delete(`dorm-images/${imageId}/`);
            setExistingImages(prev => prev.filter(img => img.id !== imageId));
        } catch (err) {
            console.error("Ошибка при удалении фотографии", err);
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

                    <div className="form-group">
                        <label>Существующие фотографии:</label>
                        {existingImages.length > 0 ? (
                            <div className="dorm-images-list">
                                {existingImages.map((img) => (
                                    <div key={img.id} className="dorm-image-item">
                                        <img src={img.image} alt="Dorm" style={{ maxWidth: '100px' }}/>
                                        <button type="button" onClick={() => handleDeleteExistingImage(img.id)}>
                                            Удалить
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Фото отсутствуют</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Новые фотографии:</label>
                        <input 
                            type="file" 
                            name="newImages" 
                            multiple 
                            onChange={handleNewImageChange} 
                            accept="image/*" 
                        />
                        {newImages.length > 0 && (
                            <ul>
                                {newImages.map((file, index) => (
                                    <li key={index}>
                                        {file.name}
                                        <button type="button" onClick={() => handleRemoveNewImage(index)}>
                                            Удалить
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
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
