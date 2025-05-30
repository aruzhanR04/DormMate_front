import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/Login.css';
import eyeIcon from '../../assets/icons/Eye.svg';
import eyeOffIcon from '../../assets/icons/Eyeoff.svg';
import LoginPic1 from '../../assets/images/LoginPic1.png';
import LoginPic2 from '../../assets/images/LoginPic2.png';

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token) {
            navigate('/profile');
        }
    }, [navigate]);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isLogin = login.startsWith('F') || login.startsWith('S');
        const loginData = {
            [isLogin ? 's' : 'phone_number']: login,
            password,
        };

        try {
            const response = await api.post('custom_token/', loginData);
            if (response.status === 200) {
                const { access, refresh } = response.data;
                localStorage.setItem('access', access);
                localStorage.setItem('refresh', refresh);
                const userTypeResponse = await api.get('usertype/');
                const { user_type } = userTypeResponse.data;
                localStorage.setItem('isAdmin', user_type === 'admin');
                navigate(user_type === 'admin' ? '/admin' : '/profile');
                window.location.reload();
            }
        } catch (err) {
            const errorData = err.response?.data || {};
            setError(errorData.detail || 'Ошибка авторизации');
        }
    };

    return (
        <div className="login-row">
            <div className="login-side login-side--left">
                <img src={LoginPic1} alt="Персонаж слева" />
            </div>
            <div className="login-center">
                <h1 className="login-title">Вход в систему</h1>
                <p className="login-subtitle">
                    Введите свои учетные данные для<br />доступа к системе
                </p>
                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <p className="error">{error}</p>}
                    <label htmlFor="login" className="login-label">Логин</label>
                    <input
                        id="login"
                        className="login-input"
                        type="text"
                        placeholder="Введите ваш логин или номер телефона"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        autoComplete="username"
                    />

                    <label htmlFor="password" className="login-label">Пароль</label>
                    <div className="login-password-field">
                        <input
                            id="password"
                            className="login-input"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Введите ваш пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                            tabIndex={-1}
                        >
                            <img src={showPassword ? eyeOffIcon : eyeIcon} alt="toggle password" />
                        </button>
                    </div>

                    <button type="submit" className="login-btn">
                        Войти
                    </button>
                </form>
            </div>
            <div className="login-side login-side--right">
                <img src={LoginPic2} alt="Персонаж справа" />
            </div>
        </div>
    );
};

export default Login;
