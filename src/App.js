import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import api from './api';
import './index.css';

import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import Logout from './components/common/Logout';
import ChatIcon from './components/chat/ChatIcon';

import AdminPanel from './components/admin/AdminPanel';
import AdminStudentsPage from './components/admin/AdminStudentsPage';
import AdminDormitoriesPage from './components/admin/AdminDormitoriesPage';
import AdminDormitoriesOperations from './components/admin/AdminDormitoriesOperations';
import AdminDormitoryAddPage from './components/admin/AdminDormitoryAddPage';
import AdminDormitoryViewPage from './components/admin/AdminDormitoryViewPage';
import AdminDormitoryEditPage from './components/admin/AdminDormitoryEditPage';
import AdminApplicationsPage from './components/admin/AdminApplicationsPage';
import ApplicationDetailPage from './components/admin/ApplicationDetailPage';
import StudentRoomDistributionPage from './components/admin/StudentRoomDistributionPage';
import AdminStudentsWorkPage from './components/admin/AdminStudentsWorkPage';
import AdminSelectStudentsPage from './components/admin/AdminSelectStudentsPage';
import AdminStudentAddPage from './components/admin/AdminStudentAddPage';
import AdminStudentViewPage from './components/admin/AdminStudentViewPage';
import AdminStudentEditPage from './components/admin/AdminStudentEditPage';
import AdminRoute from './components/admin/AdminRoute';

import Home from './pages/main/Home';
import Login from './pages/auth/Login';
import Profile from './pages/user/Profile';
import TestPage from './pages/application/TestPage';
import StudentList from './pages/user/NotificationsPage'; // Или куда у тебя отнесён список студентов
import DormList from './pages/dormitories/DormList';
import CreateApplication from './pages/application/CreateApplication';
import TestSubmission from './pages/application/TestSubmission';
import ApplicationStatus from './pages/application/ApplicationStatus';
import UploadPayment from './pages/application/UploadPayment';
import WebAssistant from './pages/elements/WebAssistant';

import Dormitory1 from './pages/dormitories/Dormitory1';
import Dormitory2 from './pages/dormitories/Dormitory2';
import Dormitory3 from './pages/dormitories/Dormitory3';

const DormAdd = () => <div>Добавление общежития</div>;
const DormUpdate = () => <div>Изменение общежития</div>;
const DormDelete = () => <div>Удаление общежития</div>;
const AppExport = () => <div>Выгрузка заселенных студентов</div>;

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

  const handleLogin = () => setIsAuthenticated(true);

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
          <Route path="/" element={<Home />} />
          <Route path="/web-assistant" element={<WebAssistant />} />

          <Route
            path="/profile"
            element={<PrivateRoute isAuthenticated={isAuthenticated}><Profile /></PrivateRoute>}
          />
          <Route
            path="/testpage"
            element={<PrivateRoute isAuthenticated={isAuthenticated}><TestPage /></PrivateRoute>}
          />
          <Route
            path="/students"
            element={<PrivateRoute isAuthenticated={isAuthenticated}><StudentList /></PrivateRoute>}
          />
          <Route
            path="/dormitories"
            element={<PrivateRoute isAuthenticated={isAuthenticated}><DormList /></PrivateRoute>}
          />
          <Route
            path="/create-application"
            element={<PrivateRoute isAuthenticated={isAuthenticated}><CreateApplication /></PrivateRoute>}
          />
          <Route
            path="/test-submission"
            element={<PrivateRoute isAuthenticated={isAuthenticated}><TestSubmission /></PrivateRoute>}
          />
          <Route
            path="/application-status"
            element={<PrivateRoute isAuthenticated={isAuthenticated}><ApplicationStatus /></PrivateRoute>}
          />
          <Route
            path="/upload-payment"
            element={<PrivateRoute isAuthenticated={isAuthenticated}><UploadPayment /></PrivateRoute>}
          />
          <Route
            path="/logout"
            element={<PrivateRoute isAuthenticated={isAuthenticated}><Logout onLogout={handleLogout} /></PrivateRoute>}
          />
          <Route path="/dormitory1" element={<Dormitory1 />} />
          <Route path="/dormitory2" element={<Dormitory2 />} />
          <Route path="/dormitory3" element={<Dormitory3 />} />

          {/* Админ маршруты */}
          <Route
            path="/admin"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminPanel /></AdminRoute>}
          />
          <Route
            path="/admin/students"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminStudentsPage /></AdminRoute>}
          />
          <Route
            path="/admin/students/work"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminStudentsWorkPage /></AdminRoute>}
          />
          <Route
            path="/admin/students/add"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminStudentAddPage /></AdminRoute>}
          />
          <Route
            path="/admin/students/view-one/:id"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminStudentViewPage /></AdminRoute>}
          />
          <Route
            path="/admin/students/edit/:id"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminStudentEditPage /></AdminRoute>}
          />
          <Route
            path="/admin/dormitories"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminDormitoriesPage /></AdminRoute>}
          />
          <Route
            path="/admin/dormitories/operations"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminDormitoriesOperations /></AdminRoute>}
          />
          <Route
            path="/admin/dormitories/add"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminDormitoryAddPage /></AdminRoute>}
          />
          <Route
            path="/admin/dormitories/view-one/:id"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminDormitoryViewPage /></AdminRoute>}
          />
          <Route
            path="/admin/dormitories/change/:id"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminDormitoryEditPage /></AdminRoute>}
          />
          <Route
            path="/admin/applications"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminApplicationsPage /></AdminRoute>}
          />
          <Route
            path="/admin/applications/select"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminSelectStudentsPage /></AdminRoute>}
          />
          <Route
            path="/admin/applications/:id"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><ApplicationDetailPage /></AdminRoute>}
          />
          <Route
            path="/admin/applications/distribute"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><StudentRoomDistributionPage /></AdminRoute>}
          />
          <Route
            path="/admin/dormitories/delete"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><DormDelete /></AdminRoute>}
          />
          <Route
            path="/admin/applications/export"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AppExport /></AdminRoute>}
          />
        </Routes>

        {/* Чат и иконка чата – только для студентов */}
        {isAuthenticated && userRole === 'student' && (
          <>
            <ChatIcon isChatOpen={isChatOpen} toggleChat={() => setIsChatOpen(!isChatOpen)} />
            {isChatOpen && <WebAssistant />}
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
