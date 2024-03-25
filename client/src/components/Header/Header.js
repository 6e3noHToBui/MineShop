import React from "react"
import { Link } from "react-router-dom";
import './Header.css'
import cart from '../../assets/cart.png'
import { useSelector, useDispatch} from "react-redux";
import {logoutUser} from '../../store/actions/userActions'

function Header() {
    const isAuth = useSelector(state=>state.user.isAuth)
    const dispatch = useDispatch()

    return (
        <div className="header">
            <div className="logo">
                <img alt="logo" src="https://enthusiasm.world/_next/static/media/logo.f603c330.svg" />
            </div>
            <div className="nav-menu">
                <Link to="/mods"><button>Mods</button></Link>
                <Link to="/shop"><button>Shop</button></Link>
                <Link to="/servers"><button>Servers</button></Link>
                <Link to="/panel"><button>Panel</button></Link>
            </div>
            < div className="profile-menu">
                {isAuth ? (
                    <>
                        <div className="cart-logo">
                            <img alt="cart" src={cart}/>
                        </div>
                        <img alt="profile-logo"></img>
                        <div className="user_name">{}</div>
                        <button className="logout" onClick={()=>dispatch(logoutUser())}>LogOut</button>
                    </>):
                         (<div className="login-button"><Link to="/login"><button>Log In</button></Link></div>)
                    }
            </div >
        </div>
    )
}

export default Header