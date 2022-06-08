import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";

const UsersProfile = () => {
  const [userProfile, setUserProfile] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  const [showFollow, setShowFollow] = useState(state ? !state.following?.includes(userId) : true);

  useEffect(() => {
    //call to create post api
    fetch(`${import.meta.env.VITE_BACKEND_URL}/${userId}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenI")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //delete follow
  const unFollow = () => {
    //call to create post api
    fetch(`${import.meta.env.VITE_BACKEND_URL}/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokenI")}`,
      },
      body: JSON.stringify({unfollowId: userId})
    })
      .then((response) => response.json())
      .then(function(updatedUser) {
        dispatch({
          type: "UPDATE",
          payload: {following: updatedUser.following, followers: updatedUser.followers}
        })
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setUserProfile((prevState) => {
          const updatedFollowers = prevState.user.followers.filter(uid => uid !== updatedUser._id)
          return {
            ...prevState, //expand current state i.e it has user post info
            user: {
              ...prevState.user,
              //update the followers count by remove the loggedin user id into the follower
              followers: updatedFollowers
            }
          }
        })
        setShowFollow(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //insert follow
  const follow = () => {
    //call to create post api
    fetch(`${import.meta.env.VITE_BACKEND_URL}/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokenI")}`,
      },
      body: JSON.stringify({followId: userId})
    })
      .then((response) => response.json())
      .then(function(updatedUser) {
        dispatch({
          type: "UPDATE",
          payload: {following: updatedUser.following, followers: updatedUser.followers}
        })
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setUserProfile((prevState) => {
          return {
            ...prevState, //expand current state i.e it has user post info
            user: {
              ...prevState.user,
              //update the followers count by adding the loggedin user id into the follower
              followers: [...prevState.user.followers, updatedUser._id]
            }
          }
        })
        setShowFollow(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {userProfile ? (
        <div className='main-container'>
          <div className='profile-container'>
            <div>
              <img
                style={{
                  width: "11rem",
                  height: "11rem",
                  borderRadius: "15rem",
                }}
                src={userProfile.user?.profilePicUrl}
              />
            </div>
            <div className='details-section'>
              <h4>{userProfile.user?.fullName}</h4>
              <div className='followings'>
                <h6>{`${userProfile.posts?.length} posts`}</h6>
                <h6>{userProfile.user?.followers?.length} followers</h6>
                <h6>{userProfile.user?.following?.length} following</h6>
              </div>
              {showFollow ? (
              <button 
              type="button"
              onClick={() => follow()}
              style={{margin: "2rem"}}
              className="btn waves-effect waves-light #0d47a1 blue darken-4">Follow</button>
            ) : (
              <button 
                type="button"
                onClick={() => unFollow()}
                style={{margin: "2rem"}}
                className="btn waves-effect waves-light #0d47a1 blue darken-4">unFollow</button>
            )}
            </div>
          </div>
          <div className='posts'>
            {userProfile.posts?.map((post) => (
              <img
                key={post._id}
                src={post.image}
                alt={`Imagen de ${post.title}`}
                className='post'
              />
            ))}
          </div>
        </div>
      ) : (
        <h3>Loading...</h3>
      )}
    </>
  );
};

export default UsersProfile;
