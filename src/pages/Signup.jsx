import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import M from "materialize-css";

const Signup = () => {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [url, setUrl] = useState(undefined);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if(url) {
      submitData();
    }
  }, [url])

  const uploadProfilePicture = async () => {
    const formData = new FormData();
    formData.append("file", profilePic);
    formData.append("upload_preset", "insta-app-clon");
    formData.append("cloud_name", "diegofedez7");

    fetch("https://api.cloudinary.com/v1_1/diegofedez7/upload", {
      method: "post",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setUrl(data.url);
        //setLoaded(true);
      })
      .catch((error) => console.log(error));
  };

  const submitData = async () => {
    if(/^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/.test(email)) {
      M.toast({html: "Enter valid email!", classes:"#c62828 red darken-3"});
      return;
    }
    fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: fullName,
        email: email,
        password: password,
        profilePicUrl: url
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data.error) {
        M.toast({html: data.error, classes:"#c62828 red darken-3"});
      } else {
        M.toast({html: data.result, classes:"#388e3c green darken-2"});
        navigate('/login');
      }
    }).catch(error => {
      console.log(error);
    })
  }

  const register = async () => {
    if(profilePic) {
      uploadProfilePicture();
    } else {
      submitData();
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card input-field">
        <h2>Instagram</h2>
        <input 
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
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
        <div className="file-field input-field">
      <div className="btn #64b5f6 blue darken-1">
        <span>Profile Picture</span>
        <input 
          type="file" 
          onChange={e => setProfilePic(e.target.files[0])}
        />
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div>
        <button 
          type="button"
          onClick={() => register()}
          className="btn waves-effect waves-light btn-large #64b5f6 blue darken-1">
          SIGNUP
        </button>
        <h6>
          <Link to='/login'>Already have an account</Link>
        </h6>
      </div>
    </div>
  )
};

export default Signup;