// src/api.js
import axios from 'axios';

// Создаем экземпляр axios с базовым URL API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
});


// export const openAIApi = axios.create({
//     baseURL: 'https://api.openai.com/v1',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, 
//     },
//   });
  

// Перехватчик для добавления токена авторизации в каждый запрос
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Перехватчик ответа для обработки ошибок авторизации и обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если получаем 401 (Unauthorized) и запрос еще не был повторен
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Запрос на обновление токена
        const refreshToken = localStorage.getItem('refresh');
        const response = await axios.post('http://127.0.0.1:8000/api/v1/token/refresh/', {
          refresh: refreshToken,
        });

        const { access } = response.data;

        // Сохраняем новый токен и повторяем оригинальный запрос
        localStorage.setItem('access', access);
        api.defaults.headers['Authorization'] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Ошибка обновления токена:', refreshError);

        // Если обновление токена не удалось, перенаправляем на страницу входа
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
