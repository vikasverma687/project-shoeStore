import { useState } from "react";
import "../Styles/Register.css";
import { data, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Register() {



  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmpass) {
      setMessage("password do not match!")
      toast.error("password dont match")
      return;
    }
    try {
      const response = await fetch("http://localhost:8081/api/auth/register", {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullname, username, email, password })

      })

      const data = await response.json();
      
      if (response.ok) {

        setMessage(data.message);

        setTimeout(() => { navigate("/Login") }, 1500);
      } else {
        toast.error(data.detail);
      }

    } catch (error) {
      console.log(error);
      toast.error("server error,check console");

    }

  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Register</h1>

        <input
          className="input-field"
          type="text"
          placeholder="user name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input-field"
          type="text"
          placeholder="full name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />


        <input
          className="input-field"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input-field"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="input-field"
          type="password"
          placeholder="confirm password"
          value={confirmpass} // Corrected: using specific state for confirm
          onChange={(e) => setConfirmpass(e.target.value)}
        />

        <button className="login-button" onClick={handleRegister}>
          Register
        </button>
      </div>

    </div>
  );
}
export default Register;