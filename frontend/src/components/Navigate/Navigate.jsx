import { NavLink } from 'react-router-dom';
import { useSelector} from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css'
import SignupFormModal from '../SignupFormModal/SignupFormModal';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
//   const dispatch = useDispatch();

//   const logout = (e) => {
//     e.preventDefault();
//     dispatch(sessionActions.logoutUser());
//   };

  const sessionLinks = sessionUser ? (
    <>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    </>
  ) : (
    <>
      <li>
        <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
        />
      </li>
      <li>
      <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
        />
      </li>
    </>
  );

  return (
    <nav>
        <ul>
            <li>
                <NavLink to="/">Home</NavLink>
            </li>
            {isLoaded && sessionLinks}
        </ul>
    </nav>
  );
}

export default Navigation;
