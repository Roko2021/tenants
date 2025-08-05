import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [logindata, setLogindata] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useContext(AuthContext);

  const handleOnChange = (e) => {
    setLogindata({ ...logindata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = logindata;

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        "http://client1.localhost:8000/accounts/login/",
        logindata,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data.access_token && res.data.email) {
        const userData = {
          email: res.data.email,
          username: res.data.username || res.data.full_name || res.data.email.split('@')[0]
        };
        login(userData, res.data.access_token, res.data.refresh_token);
        navigate("/");
        toast.success('Login successful');
      } else {
        throw new Error('Missing required fields in response');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.detail || 'Login failed');
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("اسم المستخدم المخزن:", parsedUser?.username || parsedUser?.email || 'غير متوفر');
      } catch (error) {
        console.error("خطأ في تحليل بيانات المستخدم من localStorage:", error);
      }
    }

    if (isAuthenticated) {
      console.log("تم تسجيل الدخول بنجاح");
      console.log("اسم المستخدم الحالي:", user?.username || user?.email || 'غير متوفر');
    } else if (localStorage.getItem('access')) {
      console.log("تم تسجيل الدخول مسبقًا (تم العثور على رمز الوصول)");
      // يمكنك هنا محاولة جلب بيانات المستخدم إذا لزم الأمر
    } else if (error) {
      console.log("لم يتم تسجيل الدخول");
    }
  }, [isAuthenticated, isLoading, error, user]);

  return (
    <div className="form-container">
      <div style={{ width: "100%" }} className="wrapper">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {isLoading && <p>Loading ....</p>}
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              className="email-form"
              name="email"
              value={logindata.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="email-form"
              name="password"
              value={logindata.password}
              onChange={handleOnChange}
              required
            />
          </div>
          <input type="submit" value="Login" className="submitButton" disabled={isLoading} />
          <p className="pass-link">
            <Link to="/forget_password">Forgot Password?</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;