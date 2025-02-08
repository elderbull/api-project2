import { NavLink } from 'react-router-dom';
import { useSelector} from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css'
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { GiIsland } from "react-icons/gi";
import ProfileButtonLoggedOut from './ProfileButtonLogOut';


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
        <ProfileButton user={sessionUser} className="navbar-profile-bttn" />
      </li>
    </>
  ) : (
    <>
      <ProfileButtonLoggedOut />
    </>
  );

  return (
      <ul className="nav">
            <li className='home-box'>
              <GiIsland id='profile-logo'/>
                <NavLink to="/" id='home-bttn'>Jewel of the West Indies</NavLink>
            </li>
            {isLoaded && sessionLinks}
      </ul>
  );
}

export default Navigation;
