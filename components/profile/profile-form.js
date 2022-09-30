import classes from './profile-form.module.css';
import {useRef} from "react";

function ProfileForm({onChangePassword}) {
    const newPassRef = useRef();
    const oldPassRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const enteredOldPassword = oldPassRef.current.value;
        const enteredNewPassword = newPassRef.current.value;
        onChangePassword({oldPassword: enteredOldPassword, newPassword: enteredNewPassword})
    }

    return (
        <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.control}>
                <label htmlFor='new-password'>New Password</label>
                <input type='password' id='new-password' ref={newPassRef}/>
            </div>
            <div className={classes.control}>
                <label htmlFor='old-password'>Old Password</label>
                <input type='password' id='old-password' ref={oldPassRef}/>
            </div>
            <div className={classes.action}>
                <button type='submit'>Change Password</button>
            </div>
        </form>
    );
}

export default ProfileForm;
