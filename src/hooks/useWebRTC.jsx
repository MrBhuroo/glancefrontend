import { useEffect, useRef, useState } from 'react';
import { useMeeting } from '../context/MeetingContext';

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

export const useWebRTC = (userName) => {
    const {
        socket,
        currentMeeting,
        peerConnections,
        setPeerConnections,
        localStream,
        setLocalStream,
        remoteStreams,
        setRemoteStreams,
        setParticipants
    } = useMeeting();

    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const screenStreamRef = useRef(null);

    // Initialize local media stream
    const initializeLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });
            setLocalStream(stream);
            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
        }
    };

    // Create peer connection
    const createPeerConnection = (peerId) => {
        const peerConnection = new RTCPeerConnection(configuration);

        // Add local stream tracks to peer connection
        if (localStream) {
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        }

        // Handle incoming tracks
        peerConnection.ontrack = (event) => {
            setRemoteStreams(prev => {
                const newMap = new Map(prev);
                newMap.set(peerId, event.streams[0]);
                return newMap;
            });
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && socket) {
                socket.emit('ice-candidate', {
                    candidate: event.candidate,
                    to: peerId
                });
            }
        };

        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
            if (peerConnection.connectionState === 'disconnected' ||
                peerConnection.connectionState === 'failed') {
                handlePeerDisconnection(peerId);
            }
        };

        setPeerConnections(prev => {
            const newMap = new Map(prev);
            newMap.set(peerId, peerConnection);
            return newMap;
        });

        return peerConnection;
    };

    // Handle new peer joining
    const handleUserJoined = async ({ userId, userName: peerName }) => {
        setParticipants(prev => [...prev, { userId, userName: peerName }]);

        const peerConnection = createPeerConnection(userId);

        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            socket.emit('offer', {
                offer,
                to: userId
            });
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    };

    // Handle incoming offer
    const handleOffer = async ({ offer, from }) => {
        const peerConnection = createPeerConnection(from);

        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            socket.emit('answer', {
                answer,
                to: from
            });
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    };

    // Handle incoming answer
    const handleAnswer = async ({ answer, from }) => {
        const peerConnection = peerConnections.get(from);
        if (peerConnection) {
            try {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        }
    };

    // Handle ICE candidate
    const handleIceCandidate = async ({ candidate, from }) => {
        const peerConnection = peerConnections.get(from);
        if (peerConnection) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error('Error adding ice candidate:', error);
            }
        }
    };

    // Handle peer disconnection
    const handlePeerDisconnection = (peerId) => {
        const peerConnection = peerConnections.get(peerId);
        if (peerConnection) {
            peerConnection.close();
            setPeerConnections(prev => {
                const newMap = new Map(prev);
                newMap.delete(peerId);
                return newMap;
            });
        }

        setRemoteStreams(prev => {
            const newMap = new Map(prev);
            newMap.delete(peerId);
            return newMap;
        });

        setParticipants(prev => prev.filter(p => p.userId !== peerId));
    };

    // Toggle audio
    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioMuted(!audioTrack.enabled);
            }
        }
    };

    // Toggle video
    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    // Start screen sharing
    const startScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: 'always'
                },
                audio: true
            });

            screenStreamRef.current = screenStream;
            const videoTrack = screenStream.getVideoTracks()[0];

            // Replace video track in all peer connections
            peerConnections.forEach(peerConnection => {
                const sender = peerConnection.getSenders().find(s => s.track?.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }
            });

            // Notify other participants
            if (socket && currentMeeting) {
                socket.emit('screen-share-start', {
                    roomId: currentMeeting.meetingId,
                    userId: socket.id
                });
            }

            setIsSharingScreen(true);

            // Handle screen share stop (when user clicks browser's stop sharing button)
            videoTrack.onended = () => {
                stopScreenShare();
            };
        } catch (error) {
            console.error('Error starting screen share:', error);
        }
    };

    // Stop screen sharing
    const stopScreenShare = () => {
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }

        // Switch back to camera
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            peerConnections.forEach(peerConnection => {
                const sender = peerConnection.getSenders().find(s => s.track?.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }
            });
        }

        // Notify other participants
        if (socket && currentMeeting) {
            socket.emit('screen-share-stop', {
                roomId: currentMeeting.meetingId
            });
        }

        setIsSharingScreen(false);
    };

    // Socket event listeners
    useEffect(() => {
        if (!socket || !currentMeeting) return;

        socket.on('user-joined', handleUserJoined);
        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handleIceCandidate);
        socket.on('user-left', ({ userId }) => handlePeerDisconnection(userId));

        return () => {
            socket.off('user-joined', handleUserJoined);
            socket.off('offer', handleOffer);
            socket.off('answer', handleAnswer);
            socket.off('ice-candidate', handleIceCandidate);
            socket.off('user-left');
        };
    }, [socket, currentMeeting, localStream, peerConnections]);

    return {
        initializeLocalStream,
        createPeerConnection,
        isAudioMuted,
        isVideoOff,
        isSharingScreen,
        toggleAudio,
        toggleVideo,
        startScreenShare,
        stopScreenShare
    };
};
