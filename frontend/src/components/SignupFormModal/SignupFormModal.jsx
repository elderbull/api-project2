import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

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
      )
        .then(closeModal)
        .catch(async (res) => {
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

  return (
    <div className='signup-box'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className='signup-form'>

          <input
            placeholder='Email'
            className='form-input'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

        {errors.email && <p className='input-error'>{errors.email}</p>}

          <input
            placeholder='Username'
            className='form-input'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

        {errors.username && <p className='input-error'>{errors.username}</p>}

          <input
            placeholder='First Name'
            className='form-input'
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

        {errors.firstName && <p className='input-error'>{errors.firstName}</p>}

          <input
            placeholder='Last Name'
            className='form-input'
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

        {errors.lastName && <p className='input-error'>{errors.lastName}</p>}

          <input
            placeholder='Password'
            className='form-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

        {errors.password && <p className='input-error'>{errors.password}</p>}

          <input
            placeholder='Confirm Password'
            className='form-input'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

        {errors.confirmPassword && (
          <p className='input-error'>{errors.confirmPassword}</p>
        )}
        <button type="submit" id='signup-bttn'>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
