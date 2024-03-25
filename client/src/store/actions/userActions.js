export const LOGIN_USER = 'LOGIN_USER'
export const LOGOUT_USER = 'LOGOUT_USER'

export const loginUser = (userData) => {
  return {
    type: LOGIN_USER,
    payload: userData
  }
}
  
  export const logoutUser = () => {
    return{
      type: LOGOUT_USER
  }
}