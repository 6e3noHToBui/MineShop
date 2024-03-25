import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header'
import Mods from './components/Mods/Mods'
import Shop from './components/Shop/Shop'
import Servers from './components/Servers/Servers'
import TechPanel from './components/TechPanel/TechPanel'
import Login from './components/Authentification/Login'
import ChangePassword from './components/Authentification/ChangePassword'
import './App.css'

export default function App() {

    return (
        <div className="app">
            <BrowserRouter>
                <Header />
                    <Routes>
                        <Route path="/servers" element={<Servers />} />
                        <Route path="/mods" element={<Mods />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/panel" element={<TechPanel/>} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/changepassword" element={<ChangePassword/>} />
                    </Routes>
            </BrowserRouter>
        </div>
    );
}