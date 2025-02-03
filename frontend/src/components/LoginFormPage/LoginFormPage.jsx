import {useState} from 'react';
import * as sessionActions from '../../store/session'
import {useDispatch, useSelector} from 'react-redux';
import { Navigate } from 'react-router-dom';
import './LoginForm.css';




const LoginFormPage =() => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state)=> state.session.user);

    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})

    //Checks to see if there is a user log in.
    if (sessionUser) return <Navigate to="/" replace={true}/>;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({credential,password}))
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data?.errors) setErrors(data.errors);
                }
            );
    };

    return (
        <div className='login-box'>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <label>
                    Username or Email
                    <input
                        className='form-input'
                        type='text'
                        onChange={(e) => setCredential(e.target.value)}
                        value={credential}
                        // placeholder='Username or Email'
                        name='credential'
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        className='form-input'
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        // placeholder='Password'
                        name='password'
                        required
                    />
                </label>
                { //displays errors if there are any present
                    errors.credential && <p>{errors.credential}</p>
                }
                <button type='submit' className='login-bttn'>Log In</button>
            </form>
        </div>
    )

}

export default LoginFormPage;
