
import { useEffect , useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import "../Styles/Login.css"
import Homepage from "./Homepage";
import ForgotPassword from "./ForgotPassword";
import toast, { Toaster } from "react-hot-toast";



function Login() {

    const token = localStorage.getItem("token");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();


    useEffect(()=>{

        if(token){
            window.location.replace("/Homepage" );
        }
    },[])

    const handleLogin = async () => {
        localStorage.setItem("page", 1);

        try {
            const response = await fetch(`http://localhost:8081/api/auth/login?email=${email}&password=${password}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {

                const data = await response.json();

                localStorage.setItem("user_id", data.user_id);
                localStorage.setItem("token", data.token);
                localStorage.setItem("username" , data.username);

                localStorage.setItem("role", data.role);


                toast.success(data.message)
                console.log(data.message);
                navigate("/")
            } else {
                toast.error("Invalid Credentials");
            }
        } catch (error) {
            setMessage("network issue")
            console.error(error);
        }
    }

    const handleForgotPassword = async (email) => {
        const response = await fetch(`http://localhost:8081/api/v1/forgot-password?email=${email}`, {
            method: "POST"
        })
        if (response.ok) {
            const data = response.json();
            setMessage(data.message);
        }
    }


    return (
        <div className="login-container">
            <div className="login-card">
                
            <p className="products-redirect">have a look at <Link to={"/"} className="products-redirect-link">Products</Link> till then </p>
                <h1>Login</h1>
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="login-button" onClick={handleLogin}>Login</button>
                <button className="register-button" onClick={() => navigate("/Register")}>register</button>

                <Link className="forgot-password" to={"/ForgotPassword"} onClick={() => handleForgotPassword(email)}>Forgot password?</Link>

                <h1>{message}</h1>
            </div>
        </div>
    );
}

export default Login;