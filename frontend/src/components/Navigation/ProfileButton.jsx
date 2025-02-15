import { useState, useEffect, useRef } from 'react';
import {NavLink} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ImMenu } from "react-icons/im";
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    // if (!showMenu) setShowMenu(true);
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logoutUser());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} id="menu-bttn">
        <ImMenu />
        <FaUserCircle id='profile-logo'/>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {/* <li className='profile-menu-item'>{user.username}</li> */}
        <li className='profile-menu-item'>Hello, {user.firstName}</li>
        <li className='profile-menu-item usr-email'>{user.email}</li>
        <NavLink to={`/spots/current`} className='profile-menu-item manage-spots-box'>Manage Spots</NavLink>
        <li className='profile-menu item logout-box'>
          <button onClick={logout} id="logout-bttn">Log Out</button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
