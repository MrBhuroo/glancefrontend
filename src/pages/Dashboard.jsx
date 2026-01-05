import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMeeting } from '../context/MeetingContext';
import Navbar from '../components/Navbar';
import { FiVideo, FiCopy, FiCheck } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const { createMeeting, joinMeeting } = useMeeting();
    const [meetingId, setMeetingId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    const handleCreateMeeting = async () => {
        setLoading(true);
        setError('');

        const result = await createMeeting();

        if (result.success) {
            navigate(`/meeting/${result.meeting.meetingId}`);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleJoinMeeting = async (e) => {
        e.preventDefault();

        if (!meetingId.trim()) {
            setError('Please enter a meeting ID');
            return;
        }

        setLoading(true);
        setError('');

        const result = await joinMeeting(meetingId.trim());

        if (result.success) {
            navigate(`/meeting/${meetingId.trim()}`);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="dashboard-page">
            <Navbar />
            <div className="dashboard-container container">
                <div className="dashboard-header fade-in">
                    <h1>Welcome back, {user?.name}! 👋</h1>
                    <p>Start a new meeting or join an existing one</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="dashboard-grid">
                    {/* Create Meeting Card */}
                    <div className="dashboard-card glass slide-in">
                        <div className="card-icon">
                            <FiVideo size={40} />
                        </div>
                        <h2>Start New Meeting</h2>
                        <p>Create a new video conference and invite participants</p>
                        <button
                            onClick={handleCreateMeeting}
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', marginTop: 'auto' }}
                        >
                            {loading ? 'Creating...' : 'Create Meeting'}
                        </button>
                    </div>

                    {/* Join Meeting Card */}
                    <div className="dashboard-card glass slide-in" style={{ animationDelay: '0.1s' }}>
                        <div className="card-icon">
                            <FiVideo size={40} />
                        </div>
                        <h2>Join Meeting</h2>
                        <p>Enter a meeting ID to join an ongoing conference</p>
                        <form onSubmit={handleJoinMeeting} style={{ marginTop: 'auto', width: '100%' }}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Enter Meeting ID"
                                    value={meetingId}
                                    onChange={(e) => setMeetingId(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ width: '100%' }}
                            >
                                {loading ? 'Joining...' : 'Join Meeting'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Features Section */}
                <div className="dashboard-features">
                    <div className="feature-item">
                        <div className="feature-icon-small">
                            <FiVideo />
                        </div>
                        <div>
                            <h4>HD Video Quality</h4>
                            <p>Crystal clear video with adaptive bitrate</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon-small">
                            <FiCopy />
                        </div>
                        <div>
                            <h4>Easy Sharing</h4>
                            <p>Share meeting links with one click</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon-small">
                            <FiCheck />
                        </div>
                        <div>
                            <h4>Secure Meetings</h4>
                            <p>End-to-end encrypted connections</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
