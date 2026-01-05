import React from 'react';
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

                {/* Screen Share Toggle */}
                <button
                    onClick={onToggleScreenShare}
                    className={`control-btn ${isSharingScreen ? 'active' : ''}`}
                    title={isSharingScreen ? 'Stop Sharing' : 'Share Screen'}
                >
                    <FiMonitor size={24} />
                </button>

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
