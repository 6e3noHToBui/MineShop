import React, { useState, useEffect } from 'react';
import './TechPanel.css';
import { useGlobalContext } from '../../context/globalContext';

function TechPanel() {
    const [serverName, setServerName] = useState('')
    const { userServers, getUserServers, serverCrew, getServerCrew } = useGlobalContext()

    useEffect(() => {
        getUserServers();
    }, []);

    const handleServerNameChange = (e) => {
        setServerName(e.target.value)
        if (e.target.value !== 'null') {
            const server = {
                serverName: e.target.value
            }
            getServerCrew(server)
        }
    }

    return (
        <div className='panel'>
                <div className='crew-list-panel'>
                    {serverCrew.map((crewMember) => (
                        <div key={crewMember._id} className='member'>
                            <div className='option'>
                                <button className='add-role'>Add role</button>
                                <button className='remove-member'>X</button>
                            </div>
                            <hr />
                            <img src={`https://enthusiasm.world/_next/image?url=https%3A%2F%2Fskins.enthusiasm.world%2F%3Fname%3D${crewMember.name}%26mode%3D5%26fx%3D36%26fy%3D36&w=48&q=75`} alt={crewMember.name} />
                            <p>{crewMember.name}</p>
                            <p>{crewMember.rank}<button className='remove-role'>-</button></p>
                        </div>
                    ))}
                </div>
            <div className='search'>
                <input type="text"></input>
                <select name="server-name" onChange={handleServerNameChange} value={serverName}>
                    <option value='null'>Select server</option>
                    {userServers.map((serv) => (
                        <option key={serv._id} value={serv.serverName}>{serv.serverName}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default TechPanel;
