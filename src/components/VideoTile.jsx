import React, { useRef, useEffect } from 'react';
import { FiMicOff } from 'react-icons/fi';
import './VideoTile.css';

const VideoTile = ({ stream, userName, isMuted = false, isLocal = false }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="video-tile">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal} // Always mute local video to prevent feedback
                className="video-element"
            />
            <div className="video-tile-overlay">
                <div className="video-tile-name">
                    {userName} {isLocal && '(You)'}
                    {isMuted && <FiMicOff className="muted-icon" />}
                </div>
            </div>
        </div>
    );
};

export default VideoTile;
