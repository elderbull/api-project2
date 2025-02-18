import { NavLink } from 'react-router-dom';
import { useSelector} from 'react-redux';
import ProfileButton from './ProfileButton';
import ProfileButtonLoggedOut from './ProfileButtonLogOut';
import './Navigation.css'


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ? (
    <ul className="navbar-menu-bttn">
      <li>
        <NavLink to='/spots/new' id="createspot-link">Create a New Spot</NavLink>
      </li>

      <li>
        <ProfileButton user={sessionUser} />
      </li>
    </ul>
  ) : (
    <>
      <ProfileButtonLoggedOut />
    </>
  );

  return (
      <ul className="nav">
            <li className='home-box'>
              <NavLink to="/" id='home-bttn'>
              <img src="/favicon-32x32.png" id='profile-logo' />
              Jewels of the West Indies</NavLink>
            </li>
            {isLoaded && sessionLinks}
      </ul>
  );
}

export default Navigation;
