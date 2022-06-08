import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import M from "materialize-css";
import {UserContext} from "../App";

const Login = () => {

  const {state, dispatch} = useContext(UserContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if(/^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/.test(email)) {
      M.toast({html: "Enter valid email!", classes:"#c62828 red darken-3"});
      return;
    }
    fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data.error) {
        M.toast({html: data.error, classes:"#c62828 red darken-3"});
      } else {
        localStorage.setItem('tokenI', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
        //dispatch the action and state to the reducer
        dispatch({
          type: "USER",
          payload: data.userInfo
        })
        M.toast({html: "Login Successful!", classes:"#388e3c green darken-2"});
        navigate('/');
      }
    }).catch(error => {
      console.log(error);
    })
  };

  return (
    <div className="login-container">
      <div className="card login-card input-field">
        <h2>Instagram</h2>
        <input 
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button 
          type="button"
          onClick={() => login()}
          className="btn waves-effect waves-light btn-large #64b5f6 blue darken-1">LOGIN</button>
        <h6>
          <Link to='/signup'>Already have an account</Link>
        </h6>
      </div>
    </div>
  )
};

export default Login;