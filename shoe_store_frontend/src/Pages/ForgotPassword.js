import { useState } from "react";
import "../Styles/ForgotPassword.css"; // 1. Import the separate stylesheet here

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const resetPassord = async (email) => {
        try {
            const response = await fetch(`http://localhost:8081/api/auth/forgot-password?email=${email}`, {
                method: "POST"
            });
            const data = await response.json();

            if (response.ok) {
                setMessage(data.message + " reset link sent, check your Inbox");
            } else {
                setMessage(data.message + " email does not exist");
            }
        } catch (error) {
            setMessage("Network issue or frontend problem");
        }
    }

    // Determine if the current alert message represents a success status or an error
    const isSuccess = message.toLowerCase().includes("check your inbox") || message.toLowerCase().includes("sent");

    return (
        <div className="forgot-wrapper">
            <div className="forgot-card">
                <h2>Forgot Password</h2>
                <p>Enter your email address and we'll send you a link to reset your password.</p>

                <div className="forgot-form-group">
                    <input
                        className="forgot-input"
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />

                    <button 
                        className="forgot-button" 
                        onClick={() => resetPassord(email)}
                    >
                        Send Reset Link
                    </button>
                </div>

                {/* Only renders the banner container if there's text to show */}
                {message && (
                    <div className={`forgot-message ${isSuccess ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;