import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Signup, Login, Profile, VerifyEmail, ForgetPassword, ResetPassword, Main, AddAnimls, AnimalDetails, PaymentPage
  ,  MyAnimals
 } from './components';
import './App.css';
import Layout from './utils/Layout';

const AuthCheckContext = createContext({ initialAuthChecked: false });

const AuthContext = createContext(null);

function App() {
  const [initialAuthChecked, setInitialAuthChecked] = useState(false);
  const [authState, setAuthState] = useState({ isAuthenticated: false, user: null });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access');
    const refreshToken = localStorage.getItem('refresh');

    if (storedUser && accessToken && refreshToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthState({ isAuthenticated: true, user: parsedUser });
        console.log("App: استعادة حالة التسجيل من localStorage", { isAuthenticated: true, user: parsedUser });
      } catch (error) {
        console.error("App: خطأ في تحليل بيانات المستخدم من localStorage", error);
      }
    }
    setInitialAuthChecked(true);
  }, []);

  return (
    <AuthCheckContext.Provider value={{ initialAuthChecked }}>
      <AuthContext.Provider value={{ ...authState, setAuthState }}>
        <ToastContainer />
        {initialAuthChecked ? (
          <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Signup />} />
            <Route element={<Layout />}>
              <Route path='/' element={<Main />} />
              <Route path='/dashboard' element={<Profile />} />
              <Route path='/otp/verify' element={<VerifyEmail />} />
              <Route path='/forget_password' element={<ForgetPassword />} />
              <Route path='/password-reset/confirm/:uid/:token' element={<ResetPassword />} />
              <Route path='/AddAnimls' element={<AddAnimls />} />
              <Route path="/animal/:id" element={<AnimalDetails />} />
              <Route path="/PaymentPage" element={<PaymentPage />} />
              <Route path="/my-animals" element={<MyAnimals />} />

            </Route>
          </Routes>
        ) : (
          <div>Loading...</div>
        )}
      </AuthContext.Provider>
    </AuthCheckContext.Provider>
  );
}

export default App;

export const useAuth = () => useContext(AuthContext);
export const useAuthCheck = () => useContext(AuthCheckContext);