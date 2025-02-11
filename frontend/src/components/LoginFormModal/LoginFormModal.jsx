import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoUserLogin = async (e) => {
    e.preventDefault();
    const userInfo = {
      credential: "Demo-lition",
      password: "password"
    };
    return dispatch(sessionActions.login(userInfo))
      .then(closeModal)
  }

  return (
    <div id="login-box">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className='login-form'>


          <input
            className='form-input'
            placeholder='Username or Email'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />


          <input
            className='form-input'
            placeholder='Password'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

        {errors.credential && (
          <p className='input-error'>{errors.credential}</p>
        )}
        <button type="submit" id='login-bttn'>Log In</button>
      </form>
      {/*Demo user button: Demo-lition*/}
      <button onClick={demoUserLogin} id="demo-usr-bttn">Demo User</button>
    </div>
  );
}

export default LoginFormModal;
