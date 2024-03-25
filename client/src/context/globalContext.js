import React, { useContext, useState } from 'react';
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/enthusiasm/";
const GlobalContext = React.createContext();
const token = sessionStorage.getItem('token')

export const GlobalProvider = ({ children }) => {
    const [servers, setServers] = useState([]);
    const [error, setError] = useState(null);
    const [crewStats, setCrewStats] = useState([]);
    const [shop, setShop] = useState([])
    const [serverCrew, setServerCrew] = useState([])
    const [userServers, setUserServers] = useState([])

    const getServers = async (servers) => {
        try {
            const response = await axios.get(`${BASE_URL}get-servers`,servers);
            setServers(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    const getServerCrew = async(server) =>{
        try{
            const response = await axios.post(`${BASE_URL}get-server-crew`, server)
            setServerCrew(response.data)
        }catch(err){
            setError(err.message)
        }
    }

    const getUserServers = async()=>{
        try {
            const response = await axios.get(`${BASE_URL}get-user-servers`,{headers: {
                Authorization: `Bearer ${token}`}})
            setUserServers(response.data)
        } catch (err) {
            setError(err.message)
        }
    }

    const getServerCrewStat = async (serverData) => {
        try {
            const response = await axios.post(`${BASE_URL}get-server-crew-stats`, serverData);
            setCrewStats(response.data.crewStats);
        } catch (err) {
            setError(err.message);
        }
    };

    const getServerShop = async (serverName)=>{
        try {
            const response = await axios.post(`${BASE_URL}get-server-shop`,serverName)
            setShop(response.data.shop)
        } catch (err) {
            setError(err.message);
        }
    }
    const signIn = async (data)=>{
        try {
            const response = await axios.post(`${BASE_URL}login`,data)
            if (response.data.dataUser) {
                const userData = response.data.dataUser;
                sessionStorage.setItem('token', response.data.token)
            } else {
                setError(response.data.error);
            }
        } catch (err) {
            setError(err.message)
        }
    }
    const buyItems = async (cart)=>{
        try {
            const response = await axios.post(`${BASE_URL}buy-items`,{cart},{headers: {
                Authorization: `Bearer ${token}`}})
        } catch (err) {
            setError(err.message)
        }
    }
    return (
        <GlobalContext.Provider
            value={{
                getServers,
                servers,
                getServerCrew,
                serverCrew,
                getUserServers,
                userServers,
                getServerCrewStat,
                crewStats,
                shop,
                signIn,
                buyItems,
                getServerShop,
                error,
                setError
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
