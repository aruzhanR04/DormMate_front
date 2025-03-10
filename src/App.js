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
import Logout from './components/Logout';
import ChatIcon from './components/ChatIcon';
import DormDetails from './pages/DormDetails';
import api from './api';
// Новые компоненты админки:
import AdminPanel from './components/AdminPanel';
import AdminStudentsPage from './components/AdminStudentsPage';
import AdminDormitoriesPage from './components/AdminDormitoriesPage';
import AdminApplicationsPage from './components/AdminApplicationsPage';
import ApplicationDetailPage from './components/ApplicationDetailPage';
import DormitoriesViewAll from './components/DormitoriesViewAll';
import StudentsViewAll from './components/StudentsViewAll';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const accessToken = localStorage.getItem('access');
            if (accessToken) {
                try {
                    const response = await api.get('/usertype/');
                    if (response.data) {
                        setIsAuthenticated(true);
                        setUserRole(response.data.user_type);
                        console.log(response.data);
                    }
                } catch (error) {
                    setIsAuthenticated(false);
                    setUserRole(null);
                }
            } else {
                setIsAuthenticated(false);
                setUserRole(null);
            }
        };
        checkAuthStatus();
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
    };

    return (
        <Router>
            <div>
                <Navbar isAuthenticated={isAuthenticated} userRole={userRole} onLogout={handleLogout} />
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/web-assistant" element={<WebAssistant />} />
                    <Route path="/" element={<Home />} />

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
                                <ApplicationStatus />
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

                    {/* Новые маршруты админки */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                                <AdminPanel />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/students"
                        element={
                            <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                                <AdminStudentsPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/students/view-all"
                        element={
                            <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                                <StudentsViewAll />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/dormitories"
                        element={
                            <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                                <AdminDormitoriesPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/dormitories/view-all"
                        element={
                            <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                                <DormitoriesViewAll />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/applications"
                        element={
                            <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                                <AdminApplicationsPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/applications/:id"
                        element={
                            <AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}>
                                <ApplicationDetailPage />
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
