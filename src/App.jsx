import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import UsersProfile from "./pages/UsersProfile";
import CreatePost from "./pages/CreatePost";
import PostFromFollowing from "./pages/PostFromFollowing";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { createContext, useEffect, useReducer, useContext } from "react";
import {reducer, initialState} from "./reducers/userReducer"

export const UserContext = createContext();

const CustomRouting = () => {

  const navigate = useNavigate();

  const {state, dispatch} = useContext(UserContext);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(userInfo){
      dispatch({
        type: "USER",
        payload: userInfo
      })
      //navigate('/'); //user logged in so redirect to home
    } else {
      navigate('/login');
    }
  }, []); //called when component mounts and get called only once

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route exact path="/profile/:userId" element={<UsersProfile />} />
      <Route exact path="/create-post" element={<CreatePost />} />
      <Route exact path="/postsfromfollowing" element={<PostFromFollowing />} />
    </Routes>
  )
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider 
      value={{
        state,
        dispatch
      }}
    >
      <BrowserRouter>
        <NavBar />
        <CustomRouting />
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
