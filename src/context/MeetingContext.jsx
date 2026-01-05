import React, { createContext, useState, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { api } from './AuthContext';

const MeetingContext = createContext();

export const useMeeting = () => {
    const context = useContext(MeetingContext);
    if (!context) {
        throw new Error('useMeeting must be used within a MeetingProvider');
    }
    return context;
};

export const MeetingProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [currentMeeting, setCurrentMeeting] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [peerConnections, setPeerConnections] = useState(new Map());
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState(new Map());

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io('https://glancevideo.onrender.com', {
            transports: ['websocket'],
            autoConnect: false
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    const createMeeting = async () => {
        try {
            const response = await api.post('/meetings/create');
            setCurrentMeeting(response.data);
            return { success: true, meeting: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create meeting'
            };
        }
    };

    const joinMeeting = async (meetingId) => {
        try {
            const response = await api.post(`/meetings/join/${meetingId}`);
            setCurrentMeeting(response.data);
            return { success: true, meeting: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to join meeting'
            };
        }
    };

    const leaveMeeting = () => {
        if (socket && currentMeeting) {
            socket.emit('leave-room', { roomId: currentMeeting.meetingId });
        }

        // Close all peer connections
        peerConnections.forEach(pc => pc.close());
        setPeerConnections(new Map());

        // Stop local stream
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }

        // Clear remote streams
        setRemoteStreams(new Map());
        setCurrentMeeting(null);
        setParticipants([]);
    };

    const value = {
        socket,
        currentMeeting,
        participants,
        setParticipants,
        peerConnections,
        setPeerConnections,
        localStream,
        setLocalStream,
        remoteStreams,
        setRemoteStreams,
        createMeeting,
        joinMeeting,
        leaveMeeting
    };

    return <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>;
};
