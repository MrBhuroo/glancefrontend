import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import { useMeeting } from '../context/MeetingContext';
import { useAuth } from '../context/AuthContext';
import './ChatPanel.css';

const ChatPanel = () => {
    const { socket, currentMeeting } = useMeeting();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        socket.on('receive-message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.off('receive-message');
        };
    }, [socket]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !currentMeeting) return;

        socket.emit('send-message', {
            roomId: currentMeeting.meetingId,
            message: newMessage,
            userName: user?.name || 'Guest'
        });

        setNewMessage('');
    };

    return (
        <div className="chat-panel glass">
            <div className="chat-header">
                <h3>Chat</h3>
            </div>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${msg.userId === socket?.id ? 'self' : ''}`}
                    >
                        <div className="message-header">
                            <span className="message-username">{msg.userName}</span>
                            <span className="message-time">
                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        <div className="message-content">{msg.message}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                    type="text"
                    className="input-field chat-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary chat-send-btn">
                    <FiSend />
                </button>
            </form>
        </div>
    );
};

export default ChatPanel;
