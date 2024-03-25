import { useState } from "react"

function ChangePassword() {
    const [oldpassword, setOldPassword] = useState('')
    const [newpassword, setnewPassword] = useState('')
    const [reapetpassword, setRepeatPassword] = useState('')

    const handleOldPassword = (e) => {
        setOldPassword(e.target.value);
    }

    const handleNewPasswordChange = (e) => {
        if(e.target===newpassword){
            setnewPassword(e.target.value)
        }else{
            setRepeatPassword(e.target.value)
        }
    }

    return (
            <div className='auth-form'>
                <p>Change Password</p>
                <hr/>
                <div className='input-fields'>
                    <input type='password' value={oldpassword} onChange={handleOldPassword} placeholder="Old Password" />
                    <input type='password' value={newpassword} onChange={handleNewPasswordChange} placeholder="New Password" />
                    <input type='reapetpassword' value={reapetpassword} onChange={handleNewPasswordChange} placeholder="Repeat password" />
                </div>
                <div className='accept-button'>
                    <button>Accept</button>
                </div>
            </div>
    )
}

export default ChangePassword