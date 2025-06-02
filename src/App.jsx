import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import api from './api';
import './tailwind.css';

import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import Logout from './components/common/Logout';
import ChatIcon from './components/chat/ChatIcon';
import Footer from './components/common/footer';

import AdminPanel from './components/admin/AdminPanel';
import AdminStudentsPage from './components/admin/AdminStudentsPage';
import AdminDormitoriesPage from './components/admin/AdminDormitoriesPage';
import AdminApplicationsPage from './components/admin/AdminApplicationsPage';
import ApplicationDetailPage from './components/admin/ApplicationDetailPage';
import StudentRoomDistributionPage from './components/admin/StudentRoomDistributionPage';
import AdminSelectStudentsPage from './components/admin/AdminSelectStudentsPage';
import AdminListPage from './components/admin/AdminListPage';
import AdminRoute from './components/admin/AdminRoute';
import AdminChatPage from './components/admin/AdminChat';

import EvidenceCategoriesPage from './components/admin/EvidenceCategoriesPage';
import EvidenceEditPage from './components/admin/EvidenceCategoriesEditPage';
import EvidenceKeywordsPage from './components/admin/EvidenceKeywordsPage';

import Home from './pages/main/Home';
import UsefulInfoPage from './pages/main/UsefulInfoPage';
import Login from './pages/auth/Login';
import Profile from './pages/user/Profile';
import TestPage from './pages/application/TestPage';
import StudentList from './pages/user/NotificationsPage';
import CreateApplication from './pages/application/CreateApplication';
import TestSubmission from './pages/application/TestSubmission';
import ApplicationStatus from './pages/application/ApplicationStatus';
import UploadPayment from './pages/application/UploadPayment';
import WebAssistant from './pages/elements/WebAssistant';
import EditApplication from './pages/application/EditApplication';

import DormitoryDetail from './pages/dormitories/Dormitory1';

const DormAdd = () => <div>Добавление общежития</div>;
const DormUpdate = () => <div>Изменение общежития</div>;
const DormDelete = () => <div>Удаление общежития</div>;
const AppExport = () => <div>Выгрузка заселенных студентов</div>;


function FooterWrapper() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) {
    return null;
  }
  return <Footer />;
}

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
          <Route path="/guide" element={<UsefulInfoPage />} />
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
            path="/edit-application"
            element={<PrivateRoute isAuthenticated={isAuthenticated}><EditApplication /></PrivateRoute>}
          />
          <Route
            path="/logout"
            element={<PrivateRoute isAuthenticated={isAuthenticated}><Logout onLogout={handleLogout} /></PrivateRoute>}
          />
          <Route path="/dormitory/:id" element={<DormitoryDetail />} />

          {/* === Админ маршруты === */}
          <Route
            path="/admin"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminPanel /></AdminRoute>}
          />
          <Route
            path="/admin/students"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminStudentsPage /></AdminRoute>}
          />
          <Route
            path="/admin/dormitories"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminDormitoriesPage /></AdminRoute>}
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
          <Route
            path="/admin/admins"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminListPage /></AdminRoute>}
          />
          <Route
            path="/admin/evidence-types"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><EvidenceCategoriesPage /></AdminRoute>}
          />
          <Route
            path="/admin/evidence-types/edit/:id"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><EvidenceEditPage /></AdminRoute>}
          />
          <Route
            path="/admin/evidence-types/keywords"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><EvidenceKeywordsPage /></AdminRoute>}
          />
          <Route
            path="/admin/chats"
            element={<AdminRoute isAuthenticated={isAuthenticated} userRole={userRole}><AdminChatPage /></AdminRoute>}
          />
        </Routes>

        <FooterWrapper />

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
