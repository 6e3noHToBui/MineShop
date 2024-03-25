import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/globalContext';
import "./Servers.css";

function Servers() {
    const { servers, getServers } = useGlobalContext();
    useEffect(() => {
        getServers();
    }, []);

    return (
        <div className="servers-container">
            {servers.map((serv) => {
                const { serverName, crewList } = serv;
                return (
                    <div key={serverName} className='server'>
                        <div className='server-name'>
                            {serverName}
                        </div>
                        <div className='crew-list'>
                            {crewList.map((crewMember) => (
                                <div key={crewMember._id} className='member'>
                                    <img src={`https://enthusiasm.world/_next/image?url=https%3A%2F%2Fskins.enthusiasm.world%2F%3Fname%3D${crewMember.name}%26mode%3D5%26fx%3D36%26fy%3D36&w=48&q=75`} alt={crewMember.name} />
                                    <p>{crewMember.name}</p>
                                    <p>{crewMember.rank}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Servers;