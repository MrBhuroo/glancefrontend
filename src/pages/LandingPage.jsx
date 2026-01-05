import React from 'react';
import { Link } from 'react-router-dom';
import {
    FiVideo,
    FiMonitor,
    FiMessageSquare,
    FiLock,
    FiShield,
    FiUsers,
    FiClock,
    FiZap
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <Navbar />

            {/* SECTION 1: HERO */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content fade-in">
                        <h1 className="hero-title">
                            Connect Anywhere,<br />
                            Collaborate Everywhere
                        </h1>
                        <p className="hero-subtitle">
                            Experience the future of video conferencing with crystal-clear calls,
                            seamless screen sharing, and enterprise-grade security.
                        </p>
                        <div className="hero-cta flex gap-md">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Get Started Free
                            </Link>
                            <Link to="/dashboard" className="btn btn-secondary btn-lg">
                                Join a Meeting
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: FEATURES */}
            <section className="features-section section">
                <div className="container">
                    <h2 className="section-title text-center">Powerful Features</h2>
                    <p className="section-subtitle text-center">
                        Everything you need for seamless video collaboration
                    </p>

                    <div className="features-grid">
                        <div className="feature-card glass card">
                            <div className="feature-icon">
                                <FiVideo size={40} />
                            </div>
                            <h3>HD Video & Audio</h3>
                            <p>Crystal-clear video quality with adaptive bitrate streaming for smooth calls.</p>
                        </div>

                        <div className="feature-card glass card">
                            <div className="feature-icon">
                                <FiMonitor size={40} />
                            </div>
                            <h3>Screen Sharing</h3>
                            <p>Share your screen, specific windows, or applications with one click.</p>
                        </div>

                        <div className="feature-card glass card">
                            <div className="feature-icon">
                                <FiMessageSquare size={40} />
                            </div>
                            <h3>Real-time Chat</h3>
                            <p>In-meeting messaging to collaborate without interrupting the flow.</p>
                        </div>

                        <div className="feature-card glass card">
                            <div className="feature-icon">
                                <FiUsers size={40} />
                            </div>
                            <h3>Multi-party Calls</h3>
                            <p>Connect with multiple participants in high-quality video conferences.</p>
                        </div>

                        <div className="feature-card glass card">
                            <div className="feature-icon">
                                <FiClock size={40} />
                            </div>
                            <h3>Meeting Timer</h3>
                            <p>Track your meeting duration with built-in timer functionality.</p>
                        </div>

                        <div className="feature-card glass card">
                            <div className="feature-icon">
                                <FiZap size={40} />
                            </div>
                            <h3>Instant Join</h3>
                            <p>No downloads required. Join meetings directly from your browser.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: SECURITY */}
            <section className="security-section section">
                <div className="container">
                    <div className="security-content">
                        <div className="security-text">
                            <h2>Enterprise-Grade Security</h2>
                            <p className="section-subtitle">
                                Your privacy and security are our top priorities
                            </p>

                            <div className="security-features">
                                <div className="security-item">
                                    <FiShield size={24} className="text-gradient" />
                                    <div>
                                        <h4>End-to-End Encryption</h4>
                                        <p>All communications are encrypted using WebRTC standards.</p>
                                    </div>
                                </div>

                                <div className="security-item">
                                    <FiLock size={24} className="text-gradient" />
                                    <div>
                                        <h4>Secure Authentication</h4>
                                        <p>JWT-based authentication ensures only authorized access.</p>
                                    </div>
                                </div>

                                <div className="security-item">
                                    <FiUsers size={24} className="text-gradient" />
                                    <div>
                                        <h4>Meeting Controls</h4>
                                        <p>Host controls to manage participants and meeting settings.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="security-visual">
                            <div className="security-badge glass">
                                <FiShield size={80} />
                                <p>Bank-Level<br />Security</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: WORKFLOW */}
            <section className="workflow-section section">
                <div className="container">
                    <h2 className="section-title text-center">How It Works</h2>
                    <p className="section-subtitle text-center">
                        Get started in three simple steps
                    </p>

                    <div className="workflow-steps">
                        <div className="workflow-step">
                            <div className="step-number">1</div>
                            <h3>Create Account</h3>
                            <p>Sign up for free in seconds with just your email.</p>
                        </div>

                        <div className="workflow-connector"></div>

                        <div className="workflow-step">
                            <div className="step-number">2</div>
                            <h3>Start or Join</h3>
                            <p>Create a new meeting or join using a meeting ID.</p>
                        </div>

                        <div className="workflow-connector"></div>

                        <div className="workflow-step">
                            <div className="step-number">3</div>
                            <h3>Collaborate</h3>
                            <p>Enjoy HD video, screen sharing, and real-time chat.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: CTA */}
            <section className="cta-section section">
                <div className="container">
                    <div className="cta-content glass">
                        <h2>Ready to Transform Your Meetings?</h2>
                        <p>Join thousands of teams already using Glance for their video conferencing needs.</p>
                        <div className="cta-buttons flex gap-md">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Start Free Now
                            </Link>
                            <Link to="/login" className="btn btn-glass btn-lg">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <p>&copy; 2026 Glance. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
