import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import {UserContext} from "../App";

const NavBar = () => {

  const navigate = useNavigate();

  const {state, dispatch} = useContext(UserContext);

  const logOut = () => {
    localStorage.clear();
    dispatch({
      type: "LOGOUT"
    })
    navigate('/login');
  }

  return (
    <nav>
    <div className="nav-wrapper">
      <Link to={state ? '/' : '/login'} className="brand-logo">Fakenstagram</Link>
      <ul id="nav-mobile" className="right">
        {state ? (
          <>
            <li><Link to="/create-post">Create Post</Link></li>
            <li>
              <Link to="/postsfromfollowing">
                Post from Followings
              </Link>
            </li>
            <li>
              <Link to="/profile">
                Profile
              </Link>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => logOut()}
                className="btn waves-effect waves-light #d32f2f red darken-2">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </div>
  </nav>
  )
};

export default NavBar;