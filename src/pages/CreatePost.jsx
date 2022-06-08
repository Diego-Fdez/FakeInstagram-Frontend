import { useState, useEffect } from "react";
import M from "materialize-css";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (image) {
      //call to create post api
      fetch(`${import.meta.env.VITE_BACKEND_URL}/post`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("tokenI")}`,
        },
        body: JSON.stringify({
          title: title,
          body: body,
          image: image,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            M.toast({
              html: "Post created successfully!",
              classes: "#388e3c green darken-2",
            });
            setLoaded(false);
            navigate("/profile");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [loaded]); //only call when the value of image changes

  const submitPost = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "insta-app-clon");
    formData.append("cloud_name", "diegofedez7");

    fetch("https://api.cloudinary.com/v1_1/diegofedez7/upload", {
      method: "post",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setImage(data.url);
        setLoaded(true);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className='card create-post-container'>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='post title'
      />
      <input
        type='text'
        placeholder='post content'
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className='file-field input-field'>
        <div className='btn #64b5f6 blue darken-1'>
          <span>Upload Post Image</span>
          <input type='file' onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className='file-path-wrapper'>
          <input className='file-path validate' type='text' />
        </div>
      </div>
      <button
        type='button'
        onClick={() => submitPost()}
        className='btn waves-effect waves-light btn-large #64b5f6 blue darken-1'
      >
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
