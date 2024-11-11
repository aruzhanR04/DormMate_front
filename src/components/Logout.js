import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Удаляем токены из localStorage
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    // Перенаправляем на страницу входа
    navigate('/login');
  }, [navigate]);

  return null; // Нет визуального представления, т.к. компонент только перенаправляет
};

export default Logout;
