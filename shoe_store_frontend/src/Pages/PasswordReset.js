import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "../Styles/PasswordReset.css"; 

function PasswordReset() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const navigate = useNavigate();

    const handleReset = async (password) => {
        const response = await fetch(`http://localhost:8081/api/auht/reset-password?password=${password}&token=${token}`, {
            method: "POST"
        });
        const data = await response.json();
        if (response.ok) {
            setMessage(data.message);
            setTimeout(() => { navigate("/") }, 1500);
        } else {
            setMessage(data.message);
        }
    }

    return (
        <div className="reset-wrapper">
            <div className="reset-card">
                <h2>Reset Your Password</h2>
                
                <div className="reset-form-group">
                    <input
                        className="reset-input"
                        type="password"
                        placeholder="Type new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    <button 
                        className="reset-button" 
                        onClick={() => handleReset(password)}
                    >
                        Reset Password
                    </button>
                </div>

                <Link className="reset-link" to="/ForgotPassword">
                    Send reset-link again?
                </Link>

                {/* Only render the message box if a message actually exists */}
                {message && (
                    <div className="reset-message">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PasswordReset;