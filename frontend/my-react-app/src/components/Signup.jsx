// # frontend/src/pages/Signup.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../AuthContext"; // استيراد AuthContext

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // استيراد دالة login من AuthContext
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        password2: "",
    });
    const [error, setError] = useState("");

    // 🔐 تسجيل الدخول باستخدام Google
    const handleSignInWithGoogle = useCallback(async (response) => {
        console.log("Google Credential Response:", response);

        if (!response.credential) {
            console.error("لم يتم العثور على الرمز المميز");
            toast.error("فشل في الحصول على الرمز المميز");
            return;
        }

        const payload = response.credential;

        try {
            const decodedToken = JSON.parse(atob(payload.split(".")[1]));
            console.log("decodedToken:", decodedToken);

            if (!decodedToken?.email || !decodedToken?.given_name || !decodedToken?.family_name) {
                console.error("البيانات غير مكتملة");
                toast.error("البيانات غير مكتملة");
                return;
            }

            // أرسل الـ access token إلى السيرفر
            const serverRes = await axios.post("http://localhost:8000/api/v1/social/google/", {
                access_token: payload, // payload هو response.credential
            });


            if (serverRes.status === 200) {
                console.log("تم تسجيل الدخول بنجاح", serverRes.data); // طباعة بيانات الاستجابة

                const { email, first_name, last_name, access_token, refresh_token } = serverRes.data;

                const userData = {
                    email: email,
                    names: `${first_name} ${serverRes.data.last_name}`, // استخدام serverRes.data.last_name
                    firstName: first_name,
                    lastName: serverRes.data.last_name, // استخدام serverRes.data.last_name
                };

                login(userData, access_token, refresh_token); // استدعاء دالة login مع userData

                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("access", access_token);
                localStorage.setItem("refresh", refresh_token);

                navigate("/");
            } else {
                toast.error("حدث خطأ أثناء تسجيل الدخول");
            }
        } catch (err) {
            console.error("خطأ في تسجيل الدخول باستخدام Google:", err);
            toast.error("فشل التسجيل باستخدام جوجل");
        }
    }, [navigate, login]); // إضافة login إلى قائمة الاعتماديات

    // 🌐 تهيئة زر Google
    useEffect(() => {
        /* global google */
        if (window.google) {
            google.accounts.id.initialize({
                client_id: import.meta.env.VITE_CLIENT_ID,
                callback: handleSignInWithGoogle,
            });

            google.accounts.id.renderButton(document.getElementById("signInDiv"), {
                theme: "outline",
                size: "large",
                text: "continue-with",
                shape: "circle",
                width: "280",
            });
        }
    }, [handleSignInWithGoogle]);

    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { email, first_name, last_name, password, password2 } = formData;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !first_name || !last_name || !password || !password2) {
            setError("جميع الحقول مطلوبة");
            return;
        }
        if (password !== password2) {
            setError("كلمتا المرور غير متطابقتين");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/accounts/register/", formData);

            if (res.status === 201) {
                toast.success(res.data.message || "تم إنشاء الحساب بنجاح");
                navigate("/otp/verify");
            }
        } catch (err) {
            console.error("خطأ في التسجيل:", err);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("فشل في إنشاء الحساب");
            }
        }
    };

    return (
        <div className="form-container">
            <div className="wrapper" style={{ width: "100%" }}>
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <p style={{ color: "red", padding: "1px" }}>{error && error}</p>
                    <div className="form-group">
                        <label>Email Address:</label>
                        <input
                            type="text"
                            className="email-form"
                            name="email"
                            value={email}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            type="text"
                            className="email-form"
                            name="first_name"
                            value={first_name}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            className="email-form"
                            name="last_name"
                            value={last_name}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            className="email-form"
                            name="password"
                            value={password}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            className="email-form"
                            name="password2"
                            value={password2}
                            onChange={handleOnChange}
                        />
                    </div>
                    <input type="submit" value="Submit" className="submitButton" />
                </form>
                <div className="googleContainer" id="signInDiv"></div>
            </div>
        </div>
    );
};

export default Signup;