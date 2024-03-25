import {LOGIN_USER, LOGOUT_USER} from '../actions/userActions'

const initialState ={
    isAuth: false,
    accessPanel: false,
    login: null,
    balance: 0,
}

export const userReducer = (state=initialState, action)=> {
    switch(action.type) {
        case LOGIN_USER:
            return {
                isAuth:true,
                accessPanel: action.payload.accessPanel,
                login: action.payload.login,
                balance: action.payload.balance
            }
        case LOGOUT_USER:
            return{
                initialState
            }
        default: return state;
    }
}
