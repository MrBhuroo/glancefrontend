import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar glass-header">
            <div className="container">
                <div className="navbar-content flex-between">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <span className="logo-text text-gradient">Glance</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="navbar-actions flex gap-md">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="btn btn-glass navbar-btn"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <div className="user-info flex gap-sm">
                                    <FiUser size={20} />
                                    <span>{user?.name}</span>
                                </div>
                                <button onClick={handleLogout} className="btn btn-glass navbar-btn">
                                    <FiLogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-glass navbar-btn">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary navbar-btn">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
