import {useState} from 'react';
import * as sessionActions from '../../store/session'
import {useDispatch, useSelector} from 'react-redux';
import { Navigate } from 'react-router-dom';
import './SignupForm.css';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"



const SignupFormPage = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setConfirmShowPassword] = useState(false)

    //Check to see if user if login? routes to "/" home : routes to SignUp page
    if (sessionUser) return <Navigate to="/" replace={true} />;

    //Toggles visibility of password
    const togglePasswordVisibility = (setCommand, command ) => {
        setCommand(!command);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
          setErrors({});
          return dispatch(
            sessionActions.signup({
              email,
              username,
              firstName,
              lastName,
              password
            })
          ).catch(async (res) => {
            const data = await res.json();
            if (data?.errors) {
              setErrors(data.errors);
            }
          });
        }
        return setErrors({
          confirmPassword: "Confirm Password field must be the same as the Password field"
        });
      };


    return(
        <>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p>{errors.email}</p>}
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p>{errors.username}</p>}
          <label>
            First Name
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {errors.firstName && <p>{errors.firstName}</p>}
          <label>
            Last Name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {errors.lastName && <p>{errors.lastName}</p>}
          <div className='password-container'>
            <label>
                Password
                <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <div onClick={() => showPassword(togglePasswordVisibility(setShowPassword, showPassword))}>
                {showPassword ? <AiFillEye/> :<AiFillEyeInvisible/>}
                </div>
            </label>
                {errors.password && <p>{errors.password}</p>}
         </div>
         <div className='password-container'>
            <label>
                Confirm Password
                <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
                <div onClick={() => showConfirmPassword(togglePasswordVisibility(setConfirmShowPassword,showConfirmPassword))}>
                {showConfirmPassword ? <AiFillEye/> :<AiFillEyeInvisible/>}
            </div>
            </label>
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </>
    )
}


export default SignupFormPage;
