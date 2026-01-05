import React, { useState, useEffect } from 'react';
import {
    FiMic,
    FiMicOff,
    FiVideo,
    FiVideoOff,
    FiMonitor,
    FiPhoneOff
} from 'react-icons/fi';
import './ControlBar.css';

const ControlBar = ({
    isAudioMuted,
    isVideoOff,
    isSharingScreen,
    onToggleAudio,
    onToggleVideo,
    onToggleScreenShare,
    onLeave
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detect mobile device - screen sharing not supported on mobile browsers
        const checkMobile = () => {
            const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsMobile(mobile);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="control-bar glass">
            <div className="controls flex-center gap-md">
                {/* Microphone Toggle */}
                <button
                    onClick={onToggleAudio}
                    className={`control-btn ${isAudioMuted ? 'active' : ''}`}
                    title={isAudioMuted ? 'Unmute' : 'Mute'}
                >
                    {isAudioMuted ? <FiMicOff size={24} /> : <FiMic size={24} />}
                </button>

                {/* Video Toggle */}
                <button
                    onClick={onToggleVideo}
                    className={`control-btn ${isVideoOff ? 'active' : ''}`}
                    title={isVideoOff ? 'Turn On Camera' : 'Turn Off Camera'}
                >
                    {isVideoOff ? <FiVideoOff size={24} /> : <FiVideo size={24} />}
                </button>

                {/* Screen Share Toggle - Hidden on Mobile (not supported) */}
                {!isMobile && (
                    <button
                        onClick={onToggleScreenShare}
                        className={`control-btn ${isSharingScreen ? 'active' : ''}`}
                        title={isSharingScreen ? 'Stop Sharing' : 'Share Screen'}
                    >
                        <FiMonitor size={24} />
                    </button>
                )}

                {/* Leave Meeting */}
                <button
                    onClick={onLeave}
                    className="control-btn leave-btn"
                    title="Leave Meeting"
                >
                    <FiPhoneOff size={24} />
                </button>
            </div>
        </div>
    );
};

export default ControlBar;
