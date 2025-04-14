import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';
import '../../styles/AdminActions.css';
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


    const [images, setImages] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prevFiles => [...prevFiles, ...files]);
    };

    const handleRemoveFile = (index) => {
        setImages(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const dormResponse = await api.post("dorms/", formData);
          if (dormResponse.status === 201 || dormResponse.status === 200) {
            const createdDorm = dormResponse.data;
            if (images.length > 0) {
              for (const file of images) {
                const formDataFile = new FormData();
                formDataFile.append("dorm", createdDorm.id);
                formDataFile.append("image", file);
                const imageResponse = await api.post("dorm-images/", formDataFile);
                if (imageResponse.status !== 201 && imageResponse.status !== 200) {
                  console.error(`Ошибка загрузки фотографии: ${file.name}`);
                }
              }
            }
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
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <label>
                        Количество мест:
                        <input 
                            type="number" 
                            name="total_places" 
                            value={formData.total_places} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <label>
                        Комнаты на 2:
                        <input 
                            type="number" 
                            name="rooms_for_two" 
                            value={formData.rooms_for_two} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <label>
                        Комнаты на 3:
                        <input 
                            type="number" 
                            name="rooms_for_three" 
                            value={formData.rooms_for_three} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <label>
                        Комнаты на 4:
                        <input 
                            type="number" 
                            name="rooms_for_four" 
                            value={formData.rooms_for_four} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <label>
                        Стоимость:
                        <input 
                            type="number" 
                            name="cost" 
                            value={formData.cost} 
                            onChange={handleChange} 
                            required 
                        />
                    </label>
                    <label>
                        Фотографии:
                        <input 
                            type="file" 
                            name="images" 
                            multiple 
                            onChange={handleFileChange} 
                            accept="image/*" 
                        />
                    </label>
                    {images.length > 0 && (
                        <ul>
                            {images.map((file, index) => (
                                <li key={index}>
                                    {file.name} 
                                    <button type="button" onClick={() => handleRemoveFile(index)}>
                                        Удалить
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="form-actions">
                        <button type="submit" className="save-button">Добавить</button>
                        <button 
                            type="button" 
                            className="cancel-button" 
                            onClick={() => navigate("/admin/dormitories")}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDormitoryAddPage;
