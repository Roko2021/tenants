import React, { useState } from "react";
import axios from "axios"; // 👈 بدل axiosInstance
import { toast } from "react-toastify";

const ForgetPassword = () => {
    const [email, setEmail] = useState(" ");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email) {
            try {
                const res = await axios.post("http://localhost:8000/api/v1/auth/password-reset/", {
                    email: email.trim()
                });

                if (res.status === 200) {
                    toast.success("A link to reset your password has been sent to your email");
                    setEmail("");
                }
            } catch (error) {
                toast.error("An error occurred: " + (error.response?.data?.detail || "Please try again"));
                console.error(error);
            }
        } else {
            toast.warning("Please enter your email");
        }
    };

    return (
        <div>
            <h2>Enter your registered Email Address</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="text"
                        className="email-form"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button className="vbtn">Send</button>
            </form>
        </div>
    );
};

export default ForgetPassword;
