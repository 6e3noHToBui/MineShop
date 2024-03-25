import React, { useState, useEffect } from 'react';
import './Mods.css';
import { useGlobalContext } from '../../context/globalContext';

function Mods() {
    const { crewStats, getServerCrewStat } = useGlobalContext();
    const [startDate, setStartDate] = useState(localStorage.getItem('startDate') || '');
    const [endDate, setEndDate] = useState(localStorage.getItem('endDate') || '');
    const [serverName, setServerName] = useState(localStorage.getItem('serverName') || 'null');

    const handleAcceptClick = () => {
        if (!startDate || !endDate || serverName === "null") {
            alert('Please fill in all fields');
            return;
        }
        const requestData = {
            serverName: serverName,
            startDate: startDate,
            endDate: endDate
        };
        getServerCrewStat(requestData);
    }

    const handleDateChange = (e, dateType) => {
        const value = e.target.value;
        if (dateType === 'startDate') {
            setStartDate(value);
            localStorage.setItem('startDate', value);
        } else if (dateType === 'endDate') {
            setEndDate(value);
            localStorage.setItem('endDate', value);
        }
    }

    const handleServerNameChange = (e) => {
        const value = e.target.value;
        setServerName(value);
        localStorage.setItem('serverName', value);
    }

    useEffect(() => {
        const storedStartDate = localStorage.getItem('startDate');
        const storedEndDate = localStorage.getItem('endDate');
        const storedServerName = localStorage.getItem('serverName');
    
        if (storedStartDate && storedEndDate && storedServerName) {
            setStartDate(storedStartDate);
            setEndDate(storedEndDate);
            setServerName(storedServerName);
    
            const requestData = {
                serverName: storedServerName,
                startDate: storedStartDate,
                endDate: storedEndDate
            };
        }
    
        const dateInputs = document.querySelectorAll('.data');
        dateInputs.forEach((input) => {
            const inputName = input.getAttribute('name');
            if (inputName === 'startDate') {
                input.value = storedStartDate || '';
            } else if (inputName === 'endDate') {
                input.value = storedEndDate || '';
            }
        });
    }, []);

    return (
        <div className="mods-container">
            <div className="crew-stat-form">
                <input className="data" type="date" name="startDate" pattern="\d{4}-\d{2}-\d{2}" onChange={(e) => handleDateChange(e, 'startDate')}></input>
                <input className="data" type="date" name="endDate" pattern="\d{4}-\d{2}-\d{2}" onChange={(e) => handleDateChange(e, 'endDate')}></input>
                <select className="serverSelect" onChange={handleServerNameChange} value={serverName}>
                    <option value="null">Select server</option>
                    <option value="HiTech 1.7.10">Hitech 1.7.10</option>
                </select>
                <button className="get-crew-accept" onClick={() => handleAcceptClick()}>Accept</button>
            </div>
            <div className="crew-stat-list">
                <hr/>
                <table className="crew-table">
                    <thead>
                        <tr>
                            <th>[Name]</th>
                            <th>[Playtime]</th>
                            <th>[Vanish]</th>
                            <th>[Avg Time]</th>
                            <th>[G]</th>
                            <th>[L]</th>
                            <th>[Warn]</th>
                            <th>[Tempmute]</th>
                            <th>[Tempban]</th>
                            <th>[Ban]</th>
                            <th>[Kick]</th>
                        </tr>
                    </thead>
                    <tbody>
                        {crewStats.map((crew) => {
                            const { name, totalVanishHours, totalHours, avgTime, globalMsg, localMsg, warn, ban, tempBan, tempMute,kick } = crew
                            return (
                                <tr key={name}>
                                    <td>{name}</td>
                                    <td>{totalHours}</td>
                                    <td>{totalVanishHours}</td>
                                    <td>{avgTime}</td>
                                    <td>{globalMsg}</td>
                                    <td>{localMsg}</td>
                                    <td>{warn}</td>
                                    <td>{tempMute}</td>
                                    <td>{tempBan}</td>
                                    <td>{ban}</td>
                                    <td>{kick}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className='salary-calculator'>
            </div>
        </div>
    )
}

export default Mods;
