import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMeeting } from '../context/MeetingContext';
import { useAuth } from '../context/AuthContext';
import { useWebRTC } from '../hooks/useWebRTC';
import VideoTile from '../components/VideoTile';
import ControlBar from '../components/ControlBar';
import ChatPanel from '../components/ChatPanel';
import ParticipantList from '../components/ParticipantList';
import { FiMessageSquare, FiUsers, FiX } from 'react-icons/fi';
import './MeetingRoom.css';

const MeetingRoom = () => {
    const { meetingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        socket,
        currentMeeting,
        joinMeeting,
        leaveMeeting,
        localStream,
        remoteStreams,
        participants,
        setParticipants
    } = useMeeting();

    const {
        initializeLocalStream,
        isAudioMuted,
        isVideoOff,
        isSharingScreen,
        toggleAudio,
        toggleVideo,
        startScreenShare,
        stopScreenShare
    } = useWebRTC(user?.name || 'Guest');

    const [showChat, setShowChat] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [meetingDuration, setMeetingDuration] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);

    // Timer for meeting duration
    useEffect(() => {
        const timer = setInterval(() => {
            setMeetingDuration(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Initialize meeting
    useEffect(() => {
        const init = async () => {
            try {
                // Join the meeting
                const result = await joinMeeting(meetingId);
                if (!result.success) {
                    alert(result.error);
                    navigate('/dashboard');
                    return;
                }

                // Initialize local media stream
                await initializeLocalStream();
                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize meeting:', error);
                alert('Failed to access camera/microphone');
                navigate('/dashboard');
            }
        };

        init();
    }, [meetingId]);

    // Join socket room when initialized
    useEffect(() => {
        if (socket && currentMeeting && isInitialized) {
            socket.connect();
            socket.emit('join-room', {
                roomId: currentMeeting.meetingId,
                userId: socket.id,
                userName: user?.name || 'Guest'
            });

            // Add self to participants
            setParticipants([{
                userId: 'local',
                userName: user?.name || 'Guest'
            }]);
        }
    }, [socket, currentMeeting, isInitialized]);

    const handleLeave = () => {
        leaveMeeting();
        navigate('/dashboard');
    };

    const handleToggleScreenShare = () => {
        if (isSharingScreen) {
            stopScreenShare();
        } else {
            startScreenShare();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate video grid class based on participant count
    const totalParticipants = 1 + remoteStreams.size; // 1 for local + remote streams
    const gridClass = `video-grid video-grid-${Math.min(totalParticipants, 9)}`;

    if (!isInitialized) {
        return (
            <div className="meeting-loading flex-center">
                <div className="text-gradient" style={{ fontSize: '2rem' }}>
                    Joining Meeting...
                </div>
            </div>
        );
    }

    return (
        <div className="meeting-room">
            {/* Top Bar */}
            <div className="meeting-header glass-header">
                <div className="meeting-info">
                    <span className="meeting-id">Meeting ID: {meetingId}</span>
                    <span className="meeting-timer">{formatTime(meetingDuration)}</span>
                </div>
                <div className="meeting-actions flex gap-sm">
                    <button
                        onClick={() => setShowParticipants(!showParticipants)}
                        className="btn btn-glass"
                    >
                        <FiUsers /> {participants.length}
                    </button>
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className="btn btn-glass"
                    >
                        <FiMessageSquare />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="meeting-content">
                {/* Video Grid */}
                <div className="video-section">
                    <div className={gridClass}>
                        {/* Local Video */}
                        {localStream && (
                            <VideoTile
                                stream={localStream}
                                userName={user?.name || 'You'}
                                isMuted={isAudioMuted}
                                isLocal={true}
                            />
                        )}

                        {/* Remote Videos */}
                        {Array.from(remoteStreams.entries()).map(([peerId, stream]) => {
                            const participant = participants.find(p => p.userId === peerId);
                            return (
                                <VideoTile
                                    key={peerId}
                                    stream={stream}
                                    userName={participant?.userName || 'Participant'}
                                    isMuted={false}
                                    isLocal={false}
                                />
                            );
                        })}
                    </div>

                    {/* Control Bar */}
                    <ControlBar
                        isAudioMuted={isAudioMuted}
                        isVideoOff={isVideoOff}
                        isSharingScreen={isSharingScreen}
                        onToggleAudio={toggleAudio}
                        onToggleVideo={toggleVideo}
                        onToggleScreenShare={handleToggleScreenShare}
                        onLeave={handleLeave}
                    />
                </div>

                {/* Side Panels */}
                {showParticipants && (
                    <div className="side-panel slide-in">
                        <button
                            onClick={() => setShowParticipants(false)}
                            className="panel-close"
                        >
                            <FiX />
                        </button>
                        <ParticipantList participants={participants} />
                    </div>
                )}

                {showChat && (
                    <div className="side-panel slide-in">
                        <button
                            onClick={() => setShowChat(false)}
                            className="panel-close"
                        >
                            <FiX />
                        </button>
                        <ChatPanel />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeetingRoom;
