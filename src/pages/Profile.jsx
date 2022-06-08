import { useEffect, useState, useContext } from "react";
import {UserContext} from "../App";

const Profile = () => {

  const [myPosts, setMyPosts] = useState([]);
  const {state, dispatch} = useContext(UserContext);

  useEffect(() => {
    //call to create post api
    fetch(`${import.meta.env.VITE_BACKEND_URL}/post/myposts`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenI")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMyPosts(data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])
  
  return (
    <div className="main-container">
      <div className="profile-container">
        <div>
          <img style={{width:"11rem", height:"11rem", borderRadius:"15rem"}} 
          src={state ? state.profilePicUrl : "Loading"}
          />
        </div>
        <div className="details-section">
          <h4>{state ? state.fullName : "Loading..."}</h4>
          <div className="followings">
            <h6>{`${myPosts?.length} posts`}</h6>
            <h6>{state?.result?.followers?.length} followers</h6>
            <h6>{state?.result?.following?.length} following</h6>
          </div>
        </div>
      </div>
      <div className="posts">
        {myPosts.map(post => (
          
            <img 
              key={post._id}
              src={post.image}
              alt={`Imagen de ${post.title}`}
              className="post"
            />
        ))}
      </div>
    </div>
  )
};

export default Profile;