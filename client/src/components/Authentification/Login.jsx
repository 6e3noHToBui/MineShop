import React, { useState } from 'react';
import { useGlobalContext } from '../../context/globalContext';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { loginUser } from '../../store/actions/userActions';
import axios from 'axios';
import './Authentification.css';
const BASE_URL = "http://localhost:5000/api/enthusiasm/";

function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const {error, setError } = useGlobalContext();
    const navigate = useNavigate();
    const isAuth = useSelector(state=>state.user.isAuth)
    const dispatch = useDispatch()

    const handleLoginChange = (e) => {
        setError('')
        const newLogin = e.target.value;
        setLogin(newLogin);
        if (newLogin.length < 5) {
            setLoginError('Login is too short');
        } else if (newLogin.length > 20) {
            setLoginError('Login is too long');
        } else {
            setLoginError('');
        }
    };

    const handlePasswordChange = (e) => {
        setError('')
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (newPassword.length < 5) {
            setPasswordError('Password is too short');
        } else if (newPassword.length > 20) {
            setPasswordError('Password is too long');
        } else {
            setPasswordError('');
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (loginError || passwordError) {
            return;
        }
        const data = {
            login: login,
            password: password
        };
        if (data.login ==='' || data.password === '') {
            return
        } else {
            //signUp(data)
            try {
                const response = await axios.post(`${BASE_URL}login`,data)
                if (response.data.dataUser) {
                    const userData = response.data.dataUser;
                    dispatch(loginUser(userData))
                    sessionStorage.setItem('token', response.data.token)
                } else {
                    setError(response.data.error);
                    if (response.data.error === 'Account not verified') {
                        navigate('/changepassword')
                    }
                }
            } catch (err) {
                setError(err.message)
            }
        }
    };
    

    return (
        (!isAuth && 
        <div className='auth-form'>
            <p>Log in</p>
            <hr />
            <div className='input-fields'>
                <input
                    type='text'
                    value={login}
                    onChange={handleLoginChange}
                    placeholder='Login'
                />
                <input
                    type='password'
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder='Password'
                />
                <div className='validation-error'>
                    {login !== '' && <li className='error-message'>{loginError}</li>}
                    {password !== '' && <li className='error-message'>{passwordError}</li>}
                    {error && <li className='error-message'>{error}</li>}
                </div>
            </div>
            <div className='accept-button'>
                <button onClick={handleSignUp}>Log In</button>
            </div>
        </div>
    ));
}

export default Login;
