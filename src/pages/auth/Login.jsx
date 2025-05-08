import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../styles/Login.css';
import eyeIcon from '../../assets/icons/Eye.svg';
import eyeOffIcon from '../../assets/icons/Eye off.svg';

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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
        <div className="login-container">
            {}
            <div className="login-left">
                <h1>NARXOZ UNIVERSITY</h1>
                <h2>Dorm Mate</h2>
                <h2>Lorem ipsum dejavu. Nikamy ne gavari svoi parol&!</h2>
            </div>

            {}
            <div className="login-right">
                <form onSubmit={handleSubmit}>
                    {error && <p className="error">{error}</p>}

                    {}
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>

                    {}
                    <div className="input-container password-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            <img src={showPassword ? eyeOffIcon : eyeIcon} alt="toggle password" />
                        </button>
                    </div>

                    {}
                    <button type="submit" className="login-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
