import { useState, useEffect, useContext } from "react";
import {UserContext} from "../App";
import { Link } from "react-router-dom";

let socket;

const Home = () => {

  const {state, dispatch} = useContext(UserContext);

  const [posts, setPosts] = useState([]); //initialize to empty array

  useEffect(() => {
    //call to create post api
    fetch(`${import.meta.env.VITE_BACKEND_URL}/post/all`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenI")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); //we want to lad once when component is mounting/loading

  const likeUnLike = (postId, url) => {
    //call to create post api
    fetch(`${import.meta.env.VITE_BACKEND_URL}/post/${url}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokenI")}`,
      },
      body: JSON.stringify({postId: postId})
    })
      .then((response) => response.json())
      .then(function(updatePost) {
        const newPostArr = posts.map(oldPost => {
          if(oldPost._id == updatePost._id) {
            return updatePost;
          } else {
            return oldPost
          }
        })
        setPosts(newPostArr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //add a comment
  const submitComment = (e, postId) => {
    e.preventDefault();
    const commentText = e.target[0].value;

    //call to update post api
    fetch(`${import.meta.env.VITE_BACKEND_URL}/post/comment`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tokenI")}`,
      },
      body: JSON.stringify({commentText: commentText, postId: postId})
    })
      .then((response) => response.json())
      .then(function(updatePost) {
        const newPostArr = posts.map(oldPost => {
          if(oldPost._id === updatePost._id) {
            return updatePost;
          } else {
            return oldPost
          }
        })
        setPosts(newPostArr);
        e.target[0].value = "";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //delete post
  const deletePost = postId => {
    //call to api
    fetch(`${import.meta.env.VITE_BACKEND_URL}/post/${postId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenI")}`,
      }
    })
      .then((response) => response.json())
      .then(function(deletedPost) {
        const newPostArr = posts.filter(oldPost => {
          return oldPost._id !== deletedPost.result._id //return the post whose id dont match the delete it
        })
        setPosts(newPostArr);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className='home-container'>
      {posts.map((post) => (
        <div key={post._id} className='card home-card'>
          <h5 style={{ padding: "0.6rem" }}>
            <img className="profilePicUrl" src={post.author.profilePicUrl} alt="Profile Picture" />
            <Link to={post.author?._id !== state?._id ? `/profile/${post.author?._id}` : "/profile"}
            >{post.author?.fullName} </Link>
            {post?.author?._id === state?._id && 
            <i type="button"
              onClick={() => deletePost(post?._id)}
              style={{cursor: "pointer", float: "right", fontSize: "2.5rem"}}
              className="material-icons"
            >
              delete_forever
            </i>}
          </h5>
          <div className='card-image'>
            <img src={post.image} alt={`Imagen de ${post.title}`} />
          </div>
          <div className='card-content'>
            <i className='material-icons' style={{ color: (post.like.includes(state._id)) ? 'red' : '#e9e9e9', marginRight: "0.6rem" }}>
              favorite
            </i>
            {post.like.includes(state._id) ? (
              <i 
                type="button"
                onClick={() => likeUnLike(post._id, 'unlike')}
                className='material-icons' style={{ color: "red", cursor:"pointer" }}>
                thumb_down
              </i>
            ) : (
              <i 
                type="button"
                onClick={() => likeUnLike(post._id, 'like')}
                className='material-icons' style={{ color: "blue", marginRight: "0.6rem", cursor:"pointer" }}>
                thumb_up
              </i>
            )}
            <h6>{post.like?.length} likes</h6>
            <h6>{post.title}</h6>
            <p>{post.body}</p>
            {post.comments.length > 0 ? 
            <h6 style={{fontWeight: "600"}}>All Comments</h6> : ""}
            {post.comments?.map(comment => (
              <h6 key={post._id + comment.commentText}>
                <img className="profilePicUrl" src={comment.commentedBy?.profilePicUrl} alt="Profile Picture" />
                <span style={{fontWeight: "500"}}>{comment.commentedBy?.fullName}:</span> 
                {` `}<span>{comment.commentText}</span>
              </h6>
            ))}
            <form
              onSubmit={e => {submitComment(e, post._id)}}
            >
              <input type='text' placeholder='Enter comment' />
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
