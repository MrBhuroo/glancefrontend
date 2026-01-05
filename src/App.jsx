import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MeetingProvider } from './context/MeetingContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import MeetingRoom from './pages/MeetingRoom';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <MeetingProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/meeting/:meetingId"
                                element={
                                    <ProtectedRoute>
                                        <MeetingRoom />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </MeetingProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
