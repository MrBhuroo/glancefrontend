import React from 'react';
import { FiUsers } from 'react-icons/fi';
import './ParticipantList.css';

const ParticipantList = ({ participants = [] }) => {
    return (
        <div className="participant-list glass">
            <div className="participant-header">
                <h3>
                    <FiUsers /> Participants ({participants.length})
                </h3>
            </div>
            <div className="participant-items">
                {participants.map((participant, index) => (
                    <div key={index} className="participant-item">
                        <div className="participant-avatar">
                            {participant.userName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="participant-name">{participant.userName}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParticipantList;
