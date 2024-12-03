import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TestPage from './pages/TestPage';
import StudentList from './pages/StudentList';
import DormList from './pages/DormList';
import CreateApplication from './pages/CreateApplication';
import TestSubmission from './pages/TestSubmission';
import ApplicationStatus from './pages/ApplicationStatus';
import UploadPayment from './pages/UploadPayment';
import WebAssistant from './pages/WebAssistant';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminPanel from './components/AdminPanel';
import Logout from './components/Logout';
import ChatIcon from './components/ChatIcon';
import DormDetails from './pages/DormDetails';
import api from './api';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const accessToken = localStorage.getItem('access');

            if (!accessToken) {
                setIsAuthenticated(false);
                setUserRole(null);
                return;
            }

            try {
                const response = await api.get('/usertype/');
                const userType = response?.data?.user_type;

                if (userType) {
                    setIsAuthenticated(true);
                    setUserRole(userType);
                }
            } catch {
                setIsAuthenticated(false);
                setUserRole(null);
            }
        };

        checkAuthStatus();
    }, []);

    useEffect(() => {
        let socket;

        if (isAuthenticated) {
            // Initialize WebSocket connection
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const socketUrl = `${protocol}//${window.location.host}/ws/application-status/`;

            socket = new WebSocket(socketUrl);

            // Listen for messages from the server
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                // Check for a status change notification
                if (data.type === 'status_update') {
                    const currentStatus = localStorage.getItem('applicationStatus');
                    if (data.status !== currentStatus) {
                        setHasNewNotification(true);
                        localStorage.setItem('applicationStatus', data.status);
                    }
                }
            };

            // Handle WebSocket errors
            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            // Cleanup WebSocket connection on component unmount
            return () => {
                socket.close();
            };
        }
    }, [isAuthenticated]);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('applicationStatus');
    };

    const clearNotification = () => {
        setHasNewNotification(false);
    };

    return (
        <Router>
            <div>
                <Navbar
                    isAuthenticated={isAuthenticated}
                    userRole={userRole}
                    onLogout={handleLogout}
                    hasNewNotification={hasNewNotification}
                />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <Profile />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/testpage"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <TestPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/students"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <StudentList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/dormitories"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <DormList />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/dormitories/:id"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <DormDetails />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/create-application"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <CreateApplication />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/test-submission"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <TestSubmission />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/application-status"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <ApplicationStatus clearNotification={clearNotification} />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/upload-payment"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <UploadPayment />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/logout"
                        element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <Logout onLogout={handleLogout} />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                                <AdminPanel />
                            </AdminRoute>
                        }
                    />
                </Routes>

                <ChatIcon isChatOpen={isChatOpen} toggleChat={() => setIsChatOpen(!isChatOpen)} />
                {isChatOpen && <WebAssistant />}
            </div>
        </Router>
    );
}

export default App;
